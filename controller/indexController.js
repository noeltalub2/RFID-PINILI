import query from "../database/query_db.js";
import moment from "moment";

const getIndex = (req, res) => {
	res.render("index", { title: "Homepage" });
};

const getAttendance = async (req, res) => {
	const date = new Date(); // Create a Date object
	const month = date.getUTCMonth() + 1; // Get month name (0-11, so using as index)
	const day = date.getUTCDate() + 1; // Get day (1-31)

	const holidays = await query(
		`SELECT * FROM holidays WHERE holiday_date = '2000-${month}-${day}'`
	);

	res.render("rfid-attendance", { title: "RFID Attendance", holidays });
};

const postAttendance = async (req, res) => {
	const rfid = req.body.rfid;
	const attendance_type = req.body.attendance_type;
	const holiday = req.body.holiday;

	const timeStamp = moment().format("LTS");
	const currentDate = moment().format("YYYY-MM-DD");

	try {
		// Check if user exists
		const user = await query(
			"SELECT COUNT(users.id) as 'count', users.firstname,users.lastname,users.profile_url,users.uuid,rfidcards.is_active, rfidcards.cardnumber FROM users INNER JOIN rfidcards ON users.uuid = rfidcards.userUuid WHERE rfidcards.cardnumber = ?",
			[rfid]
		);

		if (!user[0].cardnumber) {
			return res.status(400).json({ error: "Invalid RFID Card" });
		}

		if (!user[0].is_active) {
			return res.status(400).json({ error: "RFID Card is deactivated" });
		}
		// Check if an attendance record already exists for the current day
		const existingRecord = await query(
			"SELECT * FROM attendance WHERE user_uuid = ? AND DATE(log_date) = ? AND time_out IS NOT NULL",
			[user[0].uuid, currentDate]
		);

		if (existingRecord.length > 0) {
			return res.status(400).json({
				error: "Employee has already completed attendance for today",
				isValid: false,
			});
		}

		// Handle different gate types
		switch (attendance_type) {
			case "timein":
				// Check if there's an ongoing entry without an exit
				const timeInEntry = (
				  await query(
					"SELECT COUNT(*) as count FROM attendance WHERE rfid_code = ? AND time_out IS NULL",
					[rfid]
				  )
				)[0].count;
			
				// If there's an ongoing time in, return an error
				if (timeInEntry > 0) {
				  return res.status(400).json({
					error: "Employee has already timed in.",
					isValid: false,
				  });
				}
			
				// Determine status based on time
				const timeInMoment = moment(timeStamp, "LTS");
				let status_timein = "ontime";
			
				if (timeInMoment.isBefore(moment("08:00 AM", "h:mm A"))) {
				  status_timein = "early";
				} else if (timeInMoment.isAfter(moment("08:15 AM", "h:mm A"))) {
				  status_timein = "late";
				}
			
				// Insert a new entry record for attendance
				await query(
				  "INSERT INTO attendance (user_uuid, rfid_code, time_in, status_timein, log_date) VALUES (?, ?, ?, ?, NOW())",
				  [user[0].uuid, rfid, timeStamp, status_timein]
				);
			
				return res.status(200).json({
				  message: "Employee successfully timed in",
				  isValid: true,
				  timestamp: timeStamp,
				  fullname: `${user[0].firstname} ${user[0].lastname}`,
				  profile: user[0].profile_url,
				});
			
			  case "breakin":
				// Ensure there's an ongoing time in without a time out
				const validTimeIn = (
				  await query(
					"SELECT COUNT(*) as count FROM attendance WHERE rfid_code = ? AND time_in IS NOT NULL AND time_out IS NULL AND break_in IS NULL",
					[rfid]
				  )
				)[0].count;
			
				if (validTimeIn === 0) {
				  return res.status(400).json({
					error: "Employee must time in first or is already on a break.",
					isValid: false,
				  });
				}
			
				// Update the attendance record with break_in
				await query(
				  "UPDATE attendance SET break_in = ? WHERE rfid_code = ? AND break_in IS NULL AND time_out IS NULL ORDER BY time_in DESC LIMIT 1",
				  [timeStamp, rfid]
				);
			
				return res.json({
				  message: "Employee successfully took a break",
				  isValid: true,
				  timestamp: timeStamp,
				  fullname: `${user[0].firstname} ${user[0].lastname}`,
				  profile: user[0].profile_url,
				});
			
			  case "breakout":
				// Ensure there's an ongoing break
				const validBreakIn = (
				  await query(
					"SELECT COUNT(*) as count FROM attendance WHERE rfid_code = ? AND break_in IS NOT NULL AND break_out IS NULL AND time_out IS NULL",
					[rfid]
				  )
				)[0].count;
			
				if (validBreakIn === 0) {
				  return res.status(400).json({
					error: "Employee has not started a break or already ended it",
					isValid: false,
				  });
				}
			
				// Update the attendance record with break_out
				await query(
				  "UPDATE attendance SET break_out = ? WHERE rfid_code = ? AND break_out IS NULL AND time_out IS NULL ORDER BY break_in DESC LIMIT 1",
				  [timeStamp, rfid]
				);
			
				return res.json({
				  message: "Employee successfully ended their break",
				  isValid: true,
				  timestamp: timeStamp,
				  fullname: `${user[0].firstname} ${user[0].lastname}`,
				  profile: user[0].profile_url,
				});
			
				case "timeout":
					// Ensure there's an ongoing time in without a time out
					const recentEntry = await query(
						"SELECT id, time_in, break_in, break_out FROM attendance WHERE rfid_code = ? AND time_out IS NULL ORDER BY time_in DESC LIMIT 1",
						[rfid]
					);
				
					if (recentEntry.length === 0) {
						return res.status(400).json({
							error: "Employee must time in first or has already timed out",
							isValid: false,
						});
					}
				
					// Check if the user is still on a break
					if (recentEntry[0].break_in && !recentEntry[0].break_out) {
						return res.status(400).json({
							error: "Employee must end their break before timing out",
							isValid: false,
						});
					}
				
					// Calculate total working hours
					const timeIn = moment(recentEntry[0].time_in, "LTS");
					const timeOut = moment(timeStamp, "LTS");
					let totalWorkingHours = moment
						.duration(timeOut.diff(timeIn))
						.asHours();
				
					// Subtract break duration if applicable
					if (recentEntry[0].break_in && recentEntry[0].break_out) {
						const breakIn = moment(recentEntry[0].break_in, "LTS");
						const breakOut = moment(recentEntry[0].break_out, "LTS");
						const breakDuration = moment
							.duration(breakOut.diff(breakIn))
							.asHours();
				
						totalWorkingHours -= breakDuration;
					}
				
					// Format total working hours to 2 decimal places
					totalWorkingHours = totalWorkingHours.toFixed(2);
				
					// Determine status based on time
					const timeOutMoment = moment(timeStamp, "LTS");
					let status_timeout = "ontime";
				
					if (timeOutMoment.isBefore(moment("05:00 PM", "h:mm A"))) {
						status_timeout = "early";
					} else if (timeOutMoment.isAfter(moment("05:30 PM", "h:mm A"))) {
						status_timeout = "late";
					}
				
					// Update the found entry with an exit time
					await query(
						"UPDATE attendance SET time_out = ?, total_hours = ?, status_timeout = ? WHERE id = ?",
						[timeStamp, totalWorkingHours, status_timeout, recentEntry[0].id]
					);
				
					return res.json({
						message: "Employee successfully timed out",
						isValid: true,
						timestamp: timeStamp,
						fullname: `${user[0].firstname} ${user[0].lastname}`,
						profile: user[0].profile_url,
						totalHours: totalWorkingHours,
					});
				
			  default:
				return res.status(400).json({
				  error: "Invalid action",
				  isValid: false,
				});
		}
	} catch (err) {
		// Log the error and return an internal server error response
		console.error(err);
		return res
			.status(500)
			.json({ error: "Internal server error", isValid: false });
	}
};

const getError403 = (req, res) => {
	res.render("unauthorized", { title: "403 - Unauthorized" });
};
const getError404 = (req, res) => {
	res.render("notfound", { title: "404 - Not found" });
};
export default {
	getIndex,
	getAttendance,
	postAttendance,
	getError403,
	getError404,
};
