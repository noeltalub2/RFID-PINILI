import query from "../database/query_db.js";
import db from "../database/connect_db.js";
import bcrypt from "bcrypt";
import createToken from "../utils/token.js";

import crypto from "crypto";
import nodemailer from "nodemailer";

const getSignIn = (req, res) => {
	res.render("User/signin", { username: req.flash("username")[0] });
};
const postSignIn = (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = "SELECT * from users WHERE username = ?";

		db.query(findUser, [username], async (err, result) => {
			if (err) {
				req.flash("error_msg", "Authentication failed.");
				res.redirect("/signin");
			} else {
				if (result.length > 0) {
					const match_password = await bcrypt.compare(
						password,
						result[0].password
					);
					if (match_password) {
						const generateToken = createToken(
							result[0].uuid,
							result[0].username,
							"user"
						);
						res.cookie("token", generateToken, {
							httpOnly: true,
						});
						res.redirect("/home");
					} else {
						req.flash(
							"error_msg",
							"Incorrect username or password"
						);
						req.flash("username", username); // Flash the username
						res.redirect("/signin");
					}
				} else {
					req.flash("error_msg", "Could'nt find your account");
					res.redirect("/signin");
				}
			}
		});
	} catch {
		throw err;
	}
};

const getReqPass = (req, res) => {
	res.render("User/request-reset");
};

const postReqPass = async (req, res) => {
	const { email } = req.body;

	const user = await query("SELECT * FROM users WHERE email = ?", [email]);

	if (user.length === 0) {
		return res
			.status(400)
			.json({
				success: false,
				errors: [
					{ field: "email", msg: "This email is not registered." },
				],
			});
	}
	const token = crypto.randomBytes(20).toString("hex");
	const expiry = Date.now() + 3600000; // 1 hour

	db.query(
		"UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?",
		[token, expiry, email],
		(err, result) => {
			if (err) throw err;

			const transporter = nodemailer.createTransport({
				service: "Gmail",
				secure: true,
				port: 456,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASS,
				},
			});

			const mailOptions = {
				to: email,
				from: "passwordreset@demo.com",
				subject: "Password Reset",
				text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
			   Please click on the following link, or paste this into your browser to complete the process:\n\n
			   http://${req.headers.host}/reset-password/${token}\n\n
			   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
			};

			transporter.sendMail(mailOptions, (err) => {
				if (err) throw err;

				return res.json({
					success: true,
					msg: "An email with a password reset link has been sent.",
				});
			});
		}
	);
};

const getResetPass = async (req, res) => {
	db.query(
		"SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?",
		[req.params.token, Date.now()],
		(err, user) => {
			if (err) throw err;
			if (!user.length) {
				return res.redirect("/signin")
			}
			res.render("User/reset-password", { token: req.params.token });
		}
	);
};

const postResetPass = async (req,res) => {
	const { token, confirm_password } = req.body;

  db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [token, Date.now()], (err, user) => {
    if (err) throw err;
    if (!user.length) {
		return res.json({
			success: false,
			msg: "Password reset token is invalid or has expired.",
		});
     
    }

    const hashedPassword = bcrypt.hashSync(confirm_password, 10);

    db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = ?', [hashedPassword, token], (err) => {
      if (err) throw err;

	  return res.status(200).json({
		success: true,
		msg: "Password has been reset successfully.",
	});
     
    });
  });
}

const checkUsername = async (req, res) => {
	const { username, uuid } = req.body;

	let queryStr;
	let queryParams;

	// If UUID is provided, exclude it from the result
	if (uuid) {
		queryStr = "SELECT * FROM users WHERE username = ? AND uuid != ?";
		queryParams = [username, uuid];
	} else {
		queryStr = "SELECT * FROM users WHERE username = ?";
		queryParams = [username];
	}

	try {
		const result = await query(queryStr, queryParams);

		if (result.length > 0) {
			return res.json({ available: false });
		} else {
			return res.json({ available: true });
		}
	} catch (err) {
		console.error("Database query failed:", err);
		return res
			.status(500)
			.json({ success: false, message: "Database error" });
	}
};

const checkEmail = async (req, res) => {
	const { email, uuid } = req.body;

	let queryStr;
	let queryParams;

	// If UUID is provided, exclude it from the result
	if (uuid) {
		queryStr = "SELECT * FROM users WHERE email = ? AND uuid != ?";
		queryParams = [email, uuid];
	} else {
		queryStr = "SELECT * FROM users WHERE email = ?";
		queryParams = [email];
	}

	try {
		const result = await query(queryStr, queryParams);

		if (result.length > 0) {
			return res.json({ available: false });
		} else {
			return res.json({ available: true });
		}
	} catch (err) {
		console.error("Database query failed:", err);
		return res
			.status(500)
			.json({ success: false, message: "Database error" });
	}
};

const checkPhonenumber = async (req, res) => {
	const { phonenumber, uuid } = req.body;

	let queryStr;
	let queryParams;

	// If UUID is provided, exclude it from the result
	if (uuid) {
		queryStr = "SELECT * FROM users WHERE phonenumber = ? AND uuid != ?";
		queryParams = [phonenumber, uuid];
	} else {
		queryStr = "SELECT * FROM users WHERE phonenumber = ?";
		queryParams = [phonenumber];
	}

	try {
		const result = await query(queryStr, queryParams);

		if (result.length > 0) {
			return res.json({ available: false });
		} else {
			return res.json({ available: true });
		}
	} catch (err) {
		console.error("Database query failed:", err);
		return res
			.status(500)
			.json({ success: false, message: "Database error" });
	}
};

const getHome = async (req, res) => {
	const totalAttendance = (
		await query(
			"SELECT COUNT(CASE WHEN status_timein != 'absent' THEN 1 END) AS present_count, COUNT(CASE WHEN status_timein = 'absent' THEN 1 END) AS absent_count FROM attendance WHERE attendance.user_uuid = ?",
			[res.locals.user.id]
		)
	)[0];
	const upcomingHoliday = (
		await query(
			"SELECT COUNT(*) AS count FROM holidays WHERE holiday_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY holiday_date;"
		)
	)[0].count;

	const attendanceMonth = await query(
		"WITH date_series AS ( SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS log_date FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c WHERE a.a + (10 * b.a) + (100 * c.a) < DAY(LAST_DAY(CURDATE())) ) SELECT ds.log_date, COALESCE(COUNT(CASE WHEN a.status_timein = 'early' OR a.status_timein = 'ontime' THEN 1 END), 0) AS present_count, COALESCE(COUNT(CASE WHEN a.status_timein = 'absent' THEN 1 END), 0) AS absent_count, COALESCE(COUNT(CASE WHEN a.status_timein = 'late' THEN 1 END), 0) AS late_count, COALESCE(COUNT(CASE WHEN a.status_timeout = 'early' THEN 1 END), 0) AS early_timeout_count FROM date_series ds LEFT JOIN attendance a ON ds.log_date = DATE(a.log_date) AND a.user_uuid = ? WHERE ds.log_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND ds.log_date <= LAST_DAY(CURDATE()) GROUP BY ds.log_date ORDER BY ds.log_date ASC;",
		[res.locals.user.id]
	);

	const attendance_summary = (
		await query(
			"WITH attendance_summary AS ( SELECT AVG(COALESCE(CAST(a.total_hours AS DECIMAL(10,2)), 0)) AS avg_working_hours, AVG(STR_TO_DATE(a.time_in, '%h:%i:%s %p')) AS avg_time_in, AVG(STR_TO_DATE(a.time_out, '%h:%i:%s %p')) AS avg_time_out FROM users u JOIN attendance a ON u.uuid = a.user_uuid WHERE a.status_timein IS NOT NULL AND a.status_timeout IS NOT NULL AND a.status_timein != 'absent' AND a.status_timeout != 'absent' AND u.uuid = ? GROUP BY u.uuid, u.firstname, u.lastname, u.profile_url ) SELECT avg_working_hours, SEC_TO_TIME(AVG(TIME_TO_SEC(avg_time_in))) AS avg_time_in, SEC_TO_TIME(AVG(TIME_TO_SEC(avg_time_out))) AS avg_time_out FROM attendance_summary;",
			[res.locals.user.id]
		)
	)[0];

	const rfidCard = (
		await query("SELECT * FROM rfidcards WHERE userUuid = ?", [
			res.locals.user.id,
		])
	)[0];
	const attendancePresentTotal = (
		await query(
			"WITH total_days AS ( SELECT COUNT(DISTINCT a.log_date) AS total_days_in_period FROM attendance a ), attendance_summary AS ( SELECT u.uuid AS user_uuid, SUM(COALESCE(CAST(a.total_hours AS DECIMAL(10,2)), 0)) AS total_hours, COUNT(DISTINCT a.log_date) AS days_worked FROM users u JOIN attendance a ON u.uuid = a.user_uuid JOIN employment e ON u.uuid = e.user_uuid JOIN department d ON e.department = d.id JOIN designation des ON e.designation = des.id WHERE a.status_timein IS NOT NULL AND a.status_timeout IS NOT NULL AND a.status_timein != 'absent' AND a.status_timeout != 'absent' GROUP BY u.uuid, u.firstname, u.lastname, u.profile_url, d.department, des.designation ) SELECT a.total_hours, (a.days_worked / t.total_days_in_period) * 100 AS attendance_percentage FROM attendance_summary a JOIN total_days t ON 1 = 1 WHERE a.user_uuid = ? LIMIT 1;",
			[res.locals.user.id]
		)
	)[0];
	res.render("User/home", {
		title: "Dashboard",
		page: "home",
		pagetitle: "Dashboard",
		attendance_summary,
		upcomingHoliday,
		rfidCard,
		attendanceMonth,
		attendancePresentTotal,
		totalAttendance,
	});
};

const getAttendance = async (req, res) => {
	const attendance = await query(
		"SELECT * FROM attendance WHERE user_uuid = ? ORDER BY id DESC",

		[res.locals.user.id]
	);

	res.render("User/attendance", {
		title: "Attendance",
		page: "attendance",
		pagetitle: "Your Attendance",
		attendance,
	});
};

const getProfile = async (req, res) => {
	const uuid = res.locals.user.id;
	const profile = (
		await query("SELECT * FROM users WHERE uuid = ?", [res.locals.user.id])
	)[0];

	const departmentDesignation = await query(`
        SELECT dp.id as dp_id, dp.department, dp.contact_number, dp.room_location, ds.designation, ds.id as ds_id 
        FROM department dp 
        INNER JOIN designation ds ON dp.id = ds.department_id 
        ORDER BY dp.id, ds.id;
    `);

	// Grouping designations by department
	const groupedDepartments = departmentDesignation.reduce((acc, record) => {
		if (!acc[record.dp_id]) {
			acc[record.dp_id] = {
				dp_id: record.dp_id,
				department: record.department,
				contact_number: record.contact_number,
				room_location: record.room_location,
				designations: [],
			};
		}
		acc[record.dp_id].designations.push({
			id: record.ds_id,
			designation: record.designation,
		});
		return acc;
	}, {});

	const departments = Object.values(groupedDepartments);

	// User Department and Designation
	const userDepartmentDesignation = await query(
		`
       SELECT emp.joined_date, emp.exit_date, emp.status, dp.id as dp_id, ds.id as ds_id, ds.designation 
       FROM department dp 
       INNER JOIN designation ds ON dp.id = ds.department_id 
       LEFT JOIN employment emp ON dp.id = emp.department 
       WHERE emp.user_uuid = ?
    `,
		[uuid]
	);

	// User Department and Designation
	const userJoinedAndExit = await query(
		`
       SELECT emp.joined_date, emp.exit_date, emp.status
       FROM employment emp
       WHERE emp.user_uuid = ?
    `,
		[uuid]
	);

	// Group designations by department for the user
	const userGroupedDepartments = userDepartmentDesignation.reduce(
		(acc, record) => {
			if (!acc[record.dp_id]) {
				acc[record.dp_id] = {
					dp_id: record.dp_id,
					designations: [],
				};
			}
			acc[record.dp_id].designations.push({
				id: record.ds_id,
				designation: record.designation,
			});
			return acc;
		},
		{}
	);

	const userDepartments = Object.values(userGroupedDepartments);
	const userCurrentDepartment =
		userDepartments.length > 0 ? userDepartments[0].dp_id : null;
	const userCurrentDesignations =
		userDepartments
			.find((dept) => dept.dp_id === userCurrentDepartment)
			?.designations.map((d) => d.id) || [];

	const userJoinedDate = userJoinedAndExit[0]?.joined_date;
	const userExitDate = userJoinedAndExit[0]?.exit_date;

	res.render("User/profile", {
		title: "Profile",
		page: "profile",
		pagetitle: "Your Profile",
		profile,
		departments,
		userCurrentDepartment,
		userCurrentDesignations,
		userJoinedDate,
		userExitDate,
	});
};

const postProfile = async (req, res) => {
	const profile =
		req.files && req.files.profile ? req.files.profile[0].filename : null;

	// Data from the form
	const id = res.locals.user.id;
	const {
		firstname,
		lastname,
		middlename,
		address,
		phonenumber,
		email,
		birthday,
		gender,
	} = req.body;

	let errors = [];

	// Check if the phone number or email has been taken by another user
	const phone_exist =
		"SELECT COUNT(*) as `count` FROM users WHERE phonenumber = ? AND uuid != ?";
	const email_exist =
		"SELECT COUNT(*) as `count` FROM users WHERE email = ? AND uuid != ?";

	const phone_count = (await query(phone_exist, [phonenumber, id]))[0].count;
	const email_count = (await query(email_exist, [email, id]))[0].count;

	if (phone_count > 0) {
		errors.push({
			msg: "Phonenumber is already registered to another user",
		});
	}
	if (email_count > 0) {
		errors.push({ msg: "Email is already registered to another user" });
	}

	if (errors.length > 0) {
		return res.json({ success: false, errors });
	} else {
		// Data to update in SQL
		const data = {
			firstname,
			lastname,
			middlename,
			address,
			phonenumber,
			email,
			birthday,
			gender,
		};

		if (profile) {
			data.profile_url = profile;
		}

		// Update account in the database
		const sql =
			"UPDATE users SET ? , modified_at = CURRENT_TIMESTAMP WHERE uuid = ?";
		db.query(sql, [data, id], (err) => {
			if (err) {
				return res.json({
					success: false,
					error: "Failed to update user details.",
				});
			} else {
				return res.json({ success: true });
			}
		});
	}
};

const postChangePass = async (req, res) => {
	const { current_password, new_password } = req.body;
	const userId = res.locals.user.id;

	try {
		const user = (
			await query("SELECT * FROM users WHERE uuid = ?", [userId])
		)[0];

		const match = await bcrypt.compare(current_password, user.password);
		if (!match) {
			return res
				.status(400)
				.json({
					success: false,
					errors: [
						{
							field: "current_password",
							msg: "Old password is incorrect",
						},
					],
				});
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(new_password, saltRounds);

		await query("UPDATE users SET password = ? WHERE uuid = ?", [
			hashedPassword,
			userId,
		]);

		return res.json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to change password" });
	}
};

const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/signin");
};
export default {
	getSignIn,
	postSignIn,
	getReqPass,

	postReqPass,
	getResetPass,
	postResetPass,
	checkEmail,
	checkPhonenumber,
	checkUsername,
	getHome,
	getAttendance,
	getProfile,
	postProfile,
	postChangePass,

	getLogout,
};
