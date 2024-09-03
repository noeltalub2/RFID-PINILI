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
						error: "Employee Timed In Already",
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

				if (holiday) {
					// Insert a new entry record for attendance
					await query(
						"INSERT INTO attendance (user_uuid, rfid_code, time_in, status_timein, holidayId, log_date) VALUES (?, ?, ?, ?, ?, NOW())",
						[user[0].uuid, rfid, timeStamp, status_timein, holiday]
					);
				} else {
					// Insert a new entry record for attendance
					await query(
						"INSERT INTO attendance (user_uuid, rfid_code, time_in, status_timein, log_date) VALUES (?, ?, ?, ?, NOW())",
						[user[0].uuid, rfid, timeStamp, status_timein]
					);
				}

				// Return success response
				return res.status(200).json({
					message: "Employee successfully timed in",
					isValid: true,
					timestamp: timeStamp,
					fullname: `${user[0].firstname} ${user[0].lastname}`,
					profile: user[0].profile_url,
				});

			case "timeout":
				// Find the most recent entry for the RFID tag that hasn't exited yet
				const recent_entry = await query(
					"SELECT id, time_in FROM attendance WHERE rfid_code = ? AND time_out IS NULL ORDER BY time_in DESC LIMIT 1",
					[rfid]
				);

				if (recent_entry.length === 0) {
					return res.status(400).json({
						error: "Employee has not timed in yet or already timed out.",
						isValid: false,
					});
				}
				// Calculate total hours worked
				const timeIn = moment(recent_entry[0].time_in, "LTS");
				const timeOut = moment(timeStamp, "LTS");
				const total_hours = moment
					.duration(timeOut.diff(timeIn))
					.asHours()
					.toFixed(2);
				// Determine status based on time
				const timeOutMoment = moment(timeStamp, "LTS");
				let status_timeout = "ontime";

				if (timeOutMoment.isBefore(moment("05:00 PM", "h:mm A"))) {
					status_timeout = "early";
				} else if (
					timeOutMoment.isAfter(moment("05:30 PM", "h:mm A"))
				) {
					status_timeout = "late";
				}

				// Update the found entry with an exit time
				await query(
					"UPDATE attendance SET time_out = ?, total_hours = ?, status_timeout = ? WHERE id = ?",
					[timeStamp, total_hours, status_timeout, recent_entry[0].id]
				);

				return res.json({
					message: "Employee successfully timed out",
					isValid: true,
					timestamp: timeStamp,
					fullname: `${user[0].firstname} ${user[0].lastname}`,
					profile: user[0].profile_url,
				});

			default:
				return res
					.status(400)
					.json({ error: "Invalid attendance type", isValid: false });
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
