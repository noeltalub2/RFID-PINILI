import query from "../database/query_db.js";
import db from "../database/connect_db.js";
import bcrypt, { compareSync } from "bcrypt";
import { nanoid } from "nanoid";
import createToken from "../utils/token.js";
import path from 'path';
import ExcelJS from 'exceljs';
import moment from "moment";
import PDFDocument from 'pdfkit';
const getSignIn = (req, res) => {
	res.render("Admin/signin", { username: req.flash("username")[0] });
};

const postSignIn = (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = "SELECT * from admin WHERE username = ?";

		db.query(findUser, [username], async (err, result) => {
			if (err) {
				req.flash("error_msg", "Authentication failed.");
				res.redirect("/admin/signin");
			} else {
				if (result.length > 0) {
					const match_password = await bcrypt.compare(
						password,
						result[0].password
					);
					if (match_password) {
						const generateToken = createToken(
							result[0].id,
							result[0].username,

							"admin"
						);
						res.cookie("token", generateToken, {
							httpOnly: true,
						});
						res.redirect("/admin/dashboard");
					} else {
						req.flash(
							"error_msg",
							"Incorrect username or password"
						);
						req.flash("username", username); // Flash the username
						res.redirect("/admin/signin");
					}
				} else {
					req.flash("error_msg", "Could'nt find your account");
					res.redirect("/admin/signin");
				}
			}
		});
	} catch {
		throw err;
	}
};

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
const checkRFID = async (req, res) => {
	const { rfid, uuid } = req.body;

	let queryStr;
	let queryParams;

	// If UUID is provided, exclude it from the result
	if (uuid) {
		queryStr =
			"SELECT * FROM rfidcards WHERE cardnumber = ? AND userUuid != ?";
		queryParams = [rfid, uuid];
	} else {
		queryStr = "SELECT * FROM rfidcards WHERE cardnumber = ?";
		queryParams = [rfid];
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

const getDashboard = async (req, res) => {
	const todaySummary = (
		await query(
			"SELECT COUNT(CASE WHEN status_timein = 'early' OR status_timein = 'ontime' OR status_timein = 'late' THEN 1 END) AS present_count, COUNT(CASE WHEN status_timein = 'absent' OR status_timeout = 'absent' THEN 1 END) AS absent_count, COUNT(CASE WHEN status_timein = 'late' THEN 1 END) AS late_count, COUNT(CASE WHEN status_timeout = 'early' THEN 1 END) AS early_timeout_count FROM attendance WHERE log_date = CURDATE();"
		)
	)[0];

	const attendanceMonth = await query(
		"WITH date_series AS ( SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS log_date FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c WHERE a.a + (10 * b.a) + (100 * c.a) < DAY(LAST_DAY(CURDATE())) ) SELECT ds.log_date, COALESCE(COUNT(CASE WHEN status_timein = 'early' OR status_timein = 'late' OR status_timein = 'ontime' THEN 1 END), 0) AS present_count, COALESCE(COUNT(CASE WHEN status_timein = 'absent' THEN 1 END), 0) AS absent_count, COALESCE(COUNT(CASE WHEN status_timein = 'late' THEN 1 END), 0) AS late_count, COALESCE(COUNT(CASE WHEN status_timeout = 'early' THEN 1 END), 0) AS early_timeout_count FROM date_series ds LEFT JOIN attendance a ON ds.log_date = DATE(a.log_date) WHERE ds.log_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND ds.log_date <= LAST_DAY(CURDATE()) GROUP BY ds.log_date ORDER BY ds.log_date ASC; "
	);

	const attendancePercentage = (
		await query(
			"SELECT (SUM(CASE WHEN time_in IS NOT NULL AND time_out IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS attendance_percentage FROM attendance;"
		)
	)[0].attendance_percentage;

	const recentAttendance = await query(
		"SELECT u.profile_url, u.firstname, u.lastname, e.department, e.designation, a.time_in, a.time_out, a.total_hours, a.status_timein, a.status_timeout, a.log_date FROM users u LEFT JOIN employment e ON u.uuid = e.user_uuid LEFT JOIN attendance a ON u.uuid = a.user_uuid ORDER BY a.modified_at DESC LIMIT 5"
	);

	const activeRfid = (
		await query(
			"SELECT COUNT(DISTINCT r.userUuid) AS count FROM rfidcards r WHERE r.is_active = 1;"
		)
	)[0].count;

	const departments = await query(
		"SELECT d.department, COUNT(e.id) AS total_employees FROM department d LEFT JOIN employment e ON d.id = e.department WHERE e.exit_date IS NULL GROUP BY d.department;"
	);

	const averageHours = await query(
		"SELECT AVG(CAST(total_hours AS DECIMAL(5,2))) AS avg_hours FROM attendance WHERE time_in IS NOT NULL AND time_out IS NOT NULL;"
	);

	const upcomingHoliday = (
		await query(
			"SELECT COUNT(*) AS count FROM holidays WHERE holiday_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY holiday_date;"
		)
	)[0].count;

	const totalEmployee = (
		await query("SELECT COUNT(*) AS count FROM users")
	)[0].count;

	const bestAttendance = await query(
		"WITH total_days AS ( SELECT COUNT(DISTINCT a.log_date) AS total_days_in_period FROM attendance a ), attendance_summary AS ( SELECT u.uuid AS user_uuid, u.firstname, u.lastname, u.profile_url, SUM(COALESCE(CAST(a.total_hours AS DECIMAL(10,2)), 0)) AS total_hours, COUNT(DISTINCT a.log_date) AS days_worked, d.department AS department_name, des.designation AS designation_name FROM users u JOIN attendance a ON u.uuid = a.user_uuid JOIN employment e ON u.uuid = e.user_uuid JOIN department d ON e.department = d.id JOIN designation des ON e.designation = des.id WHERE a.status_timein IS NOT NULL AND a.status_timeout IS NOT NULL AND a.status_timein != 'absent' AND a.status_timeout != 'absent' GROUP BY u.uuid, u.firstname, u.lastname, u.profile_url, d.department, des.designation ) SELECT a.user_uuid, a.firstname, a.lastname, a.profile_url, a.total_hours, a.days_worked, a.department_name, a.designation_name, (a.days_worked / t.total_days_in_period) * 100 AS attendance_percentage FROM attendance_summary a JOIN total_days t ON 1 = 1 LIMIT 5;"
	);

	const totalAttendance = (
		await query("SELECT COUNT(*) as count FROM attendance")
	)[0].count;

	res.render("Admin/dashboard", {
		title: "Dashboard",
		page: "dashboard",
		pagetitle: "Dashboard",
		todaySummary,
		attendanceMonth,
		attendancePercentage,
		recentAttendance,
		activeRfid,
		departments,
		averageHours,
		upcomingHoliday,
		totalEmployee,
		bestAttendance,
		totalAttendance,
	});
};

const getEmployee = async (req, res) => {
	const employee = await query(
		"SELECT rc.is_active,u.email, u.profile_url, u.firstname, u.middlename,u.lastname,u.uuid, dp.department,ds.designation FROM `users` u LEFT JOIN employment e ON e.user_uuid = u.uuid LEFT JOIN department dp ON dp.id = e.department LEFT JOIN designation ds ON ds.department_id = dp.id LEFT JOIN rfidcards rc ON rc.userUuid = u.uuid GROUP BY u.uuid;"
	);
	res.render("Admin/employee", {
		title: "Employee",
		page: "employee",
		pagetitle: "All Employee",
		employee,
	});
};

const getEmployeeEditId = async (req, res) => {
	const uuid = req.params.uuid;

	const profile = (
		await query("SELECT * FROM users WHERE uuid = ?", [uuid])
	)[0];

	const rfid = (
		await query("SELECT * FROM rfidcards WHERE userUuid = ?", [uuid])
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
	res.render("Admin/employee_edit", {
		title: "Edit Profile",
		page: "employee",
		pagetitle: "Edit Employee Details",
		profile,
		departments,
		userCurrentDepartment,
		userCurrentDesignations,
		userJoinedDate,
		userExitDate,
		rfid,
	});
};

const postEmployeeEditId = async (req, res) => {
	const profile =
		req.files && req.files.profile ? req.files.profile[0].filename : null;

	// Data from the form
	const id = req.body.uuid;
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
const postEmploymentEdit = async (req, res) => {
	const addOneDay = (date) =>
		new Date(new Date(date).setDate(new Date(date).getDate() + 1))
			.toISOString()
			.split("T")[0];

	const { uuid, department, designation, joined_date, exit_date } = req.body;

	let errors = [];

	// Validate required fields
	if (!department || !designation || !joined_date) {
		errors.push({ msg: "Please fill in all fields." });
	}

	if (errors.length > 0) {
		return res.json({ success: false, errors });
	} else {
		const data = {
			department,
			designation,
			joined_date: addOneDay(joined_date),
		};

		// Conditionally add exit_date if provided
		if (exit_date) {
			data.exit_date = addOneDay(exit_date);
		}

		// Check if employment record exists for the given UUID
		const checkEmploymentSql =
			"SELECT COUNT(*) as count FROM employment WHERE user_uuid = ?";
		db.query(checkEmploymentSql, [uuid], (err, rset) => {
			if (err) {
				return res.json({
					success: false,
					errors: [{ msg: "Failed to verify employment details." }],
				});
			}

			const employmentCount = rset[0].count;

			if (employmentCount > 0) {
				// Update existing record
				const updateSql =
					"UPDATE employment SET ?, modified_at = CURRENT_TIMESTAMP WHERE user_uuid = ?";
				db.query(updateSql, [data, uuid], (err, rset) => {
					if (err) {
						return res.json({
							success: false,
							errors: [
								{ msg: "Failed to update employment details." },
							],
						});
					} else {
						return res.json({ success: true });
					}
				});
			} else {
				// Insert new record
				data.user_uuid = uuid;
				const insertSql = "INSERT INTO employment SET ?";
				db.query(insertSql, data, (err, rset) => {
					if (err) {
						return res.json({
							success: false,
							errors: [
								{ msg: "Failed to add employment details." },
							],
						});
					} else {
						return res.json({ success: true });
					}
				});
			}
		});
	}
};

const postAccountDetails = async (req, res) => {
	const { uuid, username, password } = req.body;
	// Hash the password
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	try {
		await query(
			"UPDATE users SET username = ?, password = ?, modified_at = CURRENT_TIMESTAMP WHERE uuid = ?",
			[username, hashedPassword, uuid]
		);
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.json({ success: false });
	}
};

const postRfidCard = async (req, res) => {
	const { uuid, rfid, status } = req.body;

	const is_active = status === true ? 1 : 0;

	try {
		await query(
			"UPDATE rfidcards SET cardnumber = ?, is_active = ?, modified_at = CURRENT_TIMESTAMP WHERE userUuid = ?",
			[rfid, is_active, uuid]
		);
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.json({ success: false });
	}
};

const getEmployeeAdd = async (req, res) => {
	const departmentDesignation = await query(`
        SELECT dp.id as dp_id, dp.department, ds.designation, ds.id as ds_id 
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
	res.render("Admin/employee_add", {
		title: "Add Employee",
		page: "employee",
		pagetitle: "Add Employee",
		departments,
	});
};
const postEmployeeAdd = async (req, res) => {
	const profile =
		req.files && req.files.profile
			? req.files.profile[0].filename
			: "default.jpg";

	// Data from the form
	const {
		firstname,
		lastname,
		middlename,
		address,
		phonenumber,
		username,
		email,
		birthday,
		gender,
		password,
		confirm_password,
		department,
		designation,
		joined_date,
		rfid,
	} = req.body;

	let errors = [];

	// Validate that all required fields are provided
	if (
		!firstname ||
		!lastname ||
		!middlename ||
		!address ||
		!phonenumber ||
		!username ||
		!email ||
		!birthday ||
		!gender ||
		!password ||
		!confirm_password ||
		!department ||
		!designation ||
		!joined_date ||
		!rfid
	) {
		errors.push({ msg: "Please fill in all required fields." });
	}

	// Check if passwords match
	if (password !== confirm_password) {
		errors.push({ msg: "Passwords do not match" });
	}

	// Check if the username, phone number, or email already exists
	const username_exist =
		"SELECT COUNT(*) as `count` FROM users WHERE username = ?";
	const phone_exist =
		"SELECT COUNT(*) as `count` FROM users WHERE phonenumber = ?";
	const email_exist = "SELECT COUNT(*) as `count` FROM users WHERE email = ?";

	const rfid_exist =
		"SELECT COUNT(*) as `count` FROM rfidcards WHERE cardnumber = ?";

	const username_count = (await query(username_exist, [username]))[0].count;
	const phone_count = (await query(phone_exist, [phonenumber]))[0].count;
	const email_count = (await query(email_exist, [email]))[0].count;
	const rfid_count = (await query(rfid_exist, [email]))[0].count;
	if (username_count > 0) {
		errors.push({ msg: "Username is already taken" });
	}
	if (phone_count > 0) {
		errors.push({ msg: "Phone number is already registered" });
	}
	if (email_count > 0) {
		errors.push({ msg: "Email is already registered" });
	}

	if (rfid_count > 0) {
		errors.push({ msg: "RFID is already registered" });
	}

	// If there are errors, send them as JSON
	if (errors.length > 0) {
		return res.json({ success: false, errors });
	} else {
		// Hash the password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Data to insert into SQL
		const data = {
			uuid: nanoid(6),
			firstname,
			lastname,
			middlename,
			address,
			phonenumber,
			username,
			email,
			birthday,
			gender,
			password: hashedPassword,
			profile_url: profile,
		};

		// Insert new user into database
		const sql = "INSERT INTO users SET ?";
		db.query(sql, data, (err, result) => {
			if (err) {
				console.error(err);
				return res.json({
					success: false,
					errors: [{ msg: "Failed to register user" }],
				});
			} else {
				// Insert employment details
				const addOneDay = (date) =>
					new Date(
						new Date(date).setDate(new Date(date).getDate() + 1)
					)
						.toISOString()
						.split("T")[0];

				const employmentData = {
					user_uuid: data.uuid,
					department,
					designation,
					joined_date: addOneDay(joined_date),
				};

				const employmentSql = "INSERT INTO employment SET ?";
				db.query(employmentSql, employmentData, (err) => {
					if (err) {
						console.error(err);
						return res.json({
							success: false,
							errors: [
								{ msg: "Failed to save employment details" },
							],
						});
					} else {
						const rfidData = {
							cardnumber: rfid,
							userUuid: data.uuid,
							is_active: 1,
						};
						const rfidSql = "INSERT INTO rfidcards SET ?";
						db.query(rfidSql, rfidData, (err) => {
							if (err) {
								console.error(err);
								return res.json({
									success: false,
									errors: [
										{ msg: "Failed to save rfid details" },
									],
								});
							} else {
								return res.json({ success: true });
							}
						});
					}
				});
			}
		});
	}
};

const getRecordAttendance = async (req, res) => {
	const date = new Date(); // Create a Date object
	const month = date.getUTCMonth() + 1; // Get month name (0-11, so using as index)
	const day = date.getUTCDate() + 1; // Get day (1-31)

	const holidays = await query(
		`SELECT * FROM holidays WHERE holiday_date = '2000-${month}-${day}'`
	);

	const now = new Date();
	const currentDate = req.query.date || now.toISOString().split("T")[0];

	const employees = await query(
		"SELECT a.status_timein, u.profile_url, u.uuid, u.firstname, u.middlename, u.lastname, a.time_in, a.time_out, rc.cardnumber FROM users u LEFT JOIN rfidcards rc ON rc.userUuid = u.uuid LEFT JOIN attendance a ON a.user_uuid = u.uuid AND a.log_date = ?;",
		[currentDate]
	);

	res.render("Admin/record_attendance", {
		title: "Record Attendance",
		page: "record-attendance",
		pagetitle: "Record Attendance",

		employees,
		currentDate,
		holidays,
	});
};
const postMarkAttendance = async (req, res) => {
	const { attendance, date } = req.body; // Extract attendance and date from the request body
	const queries = [];

	const date_now = new Date(); // Create a Date object
	const month = date_now.getUTCMonth() + 1; // Get month name (0-11, so using as index)
	const day = date_now.getUTCDate() + 1; // Get day (1-31)

	const holidays = await query(
		`SELECT * FROM holidays WHERE holiday_date = '2000-${month}-${day}'`
	);

	const isHoliday = holidays.length > 0 ? holidays[0].id : null;

	// Use a connection pool and handle each UUID separately
	const connection = await db.promise().getConnection();

	try {
		await connection.beginTransaction();

		// Create an array to store promises for each user
		const promises = Object.keys(attendance).map(async (uuid) => {
			const userAttendance = attendance[uuid];
			const rfidCard = userAttendance.rfidcard;
			const isPresent = userAttendance.status === "on";
			const timeInMoment = moment(userAttendance.timein, "HH:mm");
			const timeOutMoment = moment(userAttendance.timeout, "HH:mm");

			// Check if timeIn and timeOut are valid
			const timeIn =
				isPresent && timeInMoment.isValid()
					? timeInMoment.format("h:mm:ss A")
					: null;
			const timeOut =
				isPresent && timeOutMoment.isValid()
					? timeOutMoment.format("h:mm:ss A")
					: null;

			// Determine status based on time in
			let status_timein = "absent";
			if (timeIn) {
				const timeInMoment = moment(timeIn, "h:mm:ss A");
				if (timeInMoment.isBefore(moment("08:00 AM", "h:mm A"))) {
					status_timein = "early";
				} else if (timeInMoment.isAfter(moment("08:15 AM", "h:mm A"))) {
					status_timein = "late";
				} else {
					status_timein = "ontime";
				}
			}

			// Determine status based on time out
			let status_timeout = timeIn ? null : "absent";
			if (timeOut) {
				const timeOutMoment = moment(timeOut, "h:mm:ss A");
				if (timeOutMoment.isBefore(moment("05:00 PM", "h:mm A"))) {
					status_timeout = "early";
				} else if (
					timeOutMoment.isAfter(moment("05:30 PM", "h:mm A"))
				) {
					status_timeout = "late";
				} else {
					status_timeout = "ontime";
				}
			}
			// Calculate total hours worked
			let total_hours = null;
			if (timeIn && timeOut) {
				const timeInMoment = moment(timeIn, "h:mm:ss A");
				const timeOutMoment = moment(timeOut, "h:mm:ss A");
				total_hours = moment
					.duration(timeOutMoment.diff(timeInMoment))
					.asHours()
					.toFixed(2);
			}

			// Check if the attendance record exists
			const [rows] = await connection.query(
				"SELECT * FROM attendance WHERE user_uuid = ? AND log_date = ?",
				[uuid, date]
			);

			let query = "";
			const values = [
				uuid,
				rfidCard,
				date,
				timeIn,
				timeOut,
				status_timein,
				status_timeout,
				total_hours,
				isHoliday,
			];

			if (rows.length > 0) {
				// Record exists, update it
				query = `
					UPDATE attendance 
					SET time_in = ?, time_out = ?, status_timein = ?, status_timeout = ?, total_hours = ? 
					WHERE user_uuid = ? AND log_date = ?;
				`;
				queries.push({
					query,
					values: [
						timeIn,
						timeOut,
						status_timein,
						status_timeout,
						total_hours,
						uuid,
						date,
					],
				});
			} else {
				// Record does not exist, insert it
				query = `
					INSERT INTO attendance (user_uuid, rfid_code, log_date, time_in, time_out, status_timein, status_timeout, total_hours, holidayId) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
				`;
				queries.push({ query, values });
			}
		});

		// Wait for all promises to resolve
		await Promise.all(promises);

		// Execute all queries
		for (const { query, values } of queries) {
			await connection.query(query, values);
		}

		await connection.commit();
		res.status(200).json({
			success: true,
			message: "Attendance marked successfully.",
		});
	} catch (error) {
		await connection.rollback();
		console.error("Error marking attendance:", error);
		res.status(500).json({
			success: false,
			message: "Error marking attendance.",
		});
	} finally {
		connection.release(); // Release the connection back to the pool
	}
};

const getAttendance = async (req, res) => {
	const now = new Date();
	const attendance = await query(
		"SELECT attendance.*, users.firstname, users.lastname FROM attendance INNER JOIN users ON users.uuid = attendance.user_uuid ORDER BY id DESC"
	);
	const employees = await query(
		"SELECT uuid, firstname, middlename, lastname FROM users"
	);

	const currentMonth = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const currentYear = now.getFullYear();

	res.render("Admin/attendance", {
		title: "Attendance",
		page: "attendance",
		pagetitle: "All Attendance",
		attendance,
		employees,
		currentMonth,
		currentYear,
	});
};

const getAttendanceId = async (req, res) => {
	try {
		const employee_uuid = req.params.uuid;

		// Fetch attendance data for the given employee UUID, ordered by ID in descending order
		const attendance = await query(
			"SELECT a.*, h.description FROM attendance a LEFT JOIN holidays h ON h.id = a.holidayId WHERE a.user_uuid = ? ORDER BY id DESC;",
			[employee_uuid]
		);

		const summaryData = await query(
			"SELECT COUNT(*) AS total_days_present, SUM(CASE WHEN status_timein = 'late' THEN 1 ELSE 0 END) AS total_late_arrivals, SUM(CASE WHEN status_timeout = 'early' THEN 1 ELSE 0 END) AS total_early_departures, SUM(total_hours) AS total_hours_worked, AVG(total_hours) AS average_work_hours, SUM(CASE WHEN status_timein = 'ontime' THEN 1 ELSE 0 END) AS days_with_ontime_arrival, SUM(CASE WHEN status_timeout = 'ontime' THEN 1 ELSE 0 END) AS days_with_ontime_departure, SUM(CASE WHEN status_timein = 'absent' OR status_timeout = 'absent' THEN 1 ELSE 0 END) AS total_days_absent FROM attendance WHERE user_uuid = ?",
			[employee_uuid]
		);

		// Check if any attendance data is found
		if (attendance.length > 0 && summaryData[0].total_days_present) {
			res.status(200).json({
				success: true,
				data: attendance,
				summaryData,
			});
		} else {
			res.status(404).json({
				success: false,
				message: "No attendance records found",
			});
		}
	} catch (error) {
		console.error("Error fetching attendance data:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const getAttendanceReport = async (req, res) => {
	const recentAttendance = await query(
		"SELECT u.profile_url, u.firstname, u.lastname, e.department, e.designation, a.time_in, a.time_out, a.total_hours, a.status_timein, a.status_timeout, a.log_date FROM users u LEFT JOIN employment e ON u.uuid = e.user_uuid LEFT JOIN attendance a ON u.uuid = a.user_uuid WHERE a.log_date IS NOT NULL ORDER BY a.modified_at DESC;"
	);
	const today = new Date();
	const currentMonth = today.getMonth() + 1; // Adding 1 to get the correct month number
	const currentYear = today.getFullYear();
	res.render("Admin/attendance_report", {
		title: "Attendance Report",
		page: "report-attendance",
		pagetitle: "All Attendance Report",
		recentAttendance, currentMonth, currentYear
	});
};

const getExportExcel = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    res.status(400).send('Month and Year are required');
    return;
  }

  // Generate start and end dates
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Generate date headers
  const dateHeaders = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateHeaders.push(currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  db.query(
    `SELECT u.firstname, u.lastname, a.log_date, a.total_hours, a.time_in, a.time_out, h.description AS holiday_name
     FROM users u
     LEFT JOIN attendance a ON u.uuid = a.user_uuid
     LEFT JOIN holidays h ON a.log_date = h.holiday_date
     WHERE a.log_date BETWEEN ? AND ?`,
    [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database query error');
        return;
      }

      const employeeMap = new Map();
      results.forEach(row => {
        const employeeName = `${row.firstname} ${row.lastname}`;
        const logDate = new Date(row.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeIn = row.time_in || '-';
        const timeOut = row.time_out || '-';
        const holidayName = row.holiday_name || '';

        if (!employeeMap.has(employeeName)) {
          employeeMap.set(employeeName, {});
        }

        // Calculate hours worked if time_in and time_out are available
        let calculatedHours = '-';
        if (timeIn !== '-' && timeOut !== '-') {
			calculatedHours = parseFloat(row.total_hours) > 8.00 ? row.total_hours : `${row.total_hours} (Undertime)` //0.00
        }

        employeeMap.get(employeeName)[logDate] = { timeIn, timeOut, calculatedHours, holidayName };
      });

      const doc = new PDFDocument({ margin: 30 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Attendance_Report_${year}-${month}.pdf"`);
      doc.pipe(res);

      employeeMap.forEach((attendance, employeeName) => {
        doc.fontSize(14).font('Helvetica-Bold').text(`Employee: ${employeeName}`, { underline: true });
        doc.fontSize(12).text(`Month: ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`);
        doc.moveDown();

        // Table Headers
        const tableTop = doc.y; // Track the starting Y position of the table
        const columnWidths = [100, 100, 100, 100, 150];
        const rowHeight = 16;

        // Draw Header Row
        doc.fontSize(9).font('Helvetica-Bold');
        drawRow(doc, tableTop, columnWidths, rowHeight, ['Date', 'Time In', 'Time Out', 'Calculated Hours', 'Holiday']);

        // Draw Attendance Rows
        doc.font('Helvetica');
        let currentY = tableTop + rowHeight;
        dateHeaders.forEach(date => {
          const logData = attendance[date] || { timeIn: '-', timeOut: '-', calculatedHours: '-', holidayName: '' };
          drawRow(doc, currentY, columnWidths, rowHeight, [
            date,
            logData.timeIn,
            logData.timeOut,
            logData.calculatedHours,
            logData.holidayName,
          ]);
          currentY += rowHeight;

          // Add new page if the rows exceed the page height
          if (currentY > doc.page.height - 50) {
            doc.addPage();
            currentY = 50; // Reset the Y position
            drawRow(doc, currentY, columnWidths, rowHeight, ['Date', 'Time In', 'Time Out', 'Calculated Hours', 'Holiday']);
            currentY += rowHeight;
          }
        });

        doc.moveDown(2);

        // Certify Section
        doc.font('Helvetica-Bold').text('Certify:', { align: 'left' });
        doc.font('Helvetica').text('I hereby certify that the attendance details above are correct and complete.', { align: 'center' });
        doc.text('_____________________', { align: 'center' });
        doc.text('Authorized Signatory', { align: 'center' });
        doc.addPage(); // Add new page for the next employee
      });

      doc.end();
    }
  );

  // Helper function to draw a row in the table
  function drawRow(doc, y, columnWidths, height, rowValues) {
    let x = doc.page.margins.left; // Starting X position for the first column

    rowValues.forEach((text, i) => {
      // Draw cell borders
      doc.rect(x, y, columnWidths[i], height).stroke();

      // Add text inside the cell
      doc.text(text, x + 5, y + 5, { width: columnWidths[i] - 10, align: 'left' });

      // Update X for the next column
      x += columnWidths[i];
    });
  }
};


  
  
  



const getDepartment = async (req, res) => {
	const departments = await query(
		`SELECT dp.id as dp_id, dp.department, dp.contact_number, dp.room_location FROM department dp ;`
	);

	res.render("Admin/department", {
		title: "Department",
		page: "department",
		pagetitle: "Department",
		departments,
	});
};
const postDepartment = async (req, res) => {
	const { department, contact_number, room_location } = req.body;
	let errors = [];

	// Check if the department name already exists
	const departmentExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE department = ?";
	const departmentCount = (await query(departmentExistQuery, [department]))[0]
		.count;
	if (departmentCount > 0) {
		errors.push({ field: "department", msg: "Department already exists" });
	}

	// Check if the contact number already exists
	const contactNumberExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE contact_number = ?";
	const contactNumberCount = (
		await query(contactNumberExistQuery, [contact_number])
	)[0].count;
	if (contactNumberCount > 0) {
		errors.push({
			field: "contact_number",
			msg: "Contact number already exists",
		});
	}

	// Check if the room location already exists
	const roomLocationExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE room_location = ?";
	const roomLocationCount = (
		await query(roomLocationExistQuery, [room_location])
	)[0].count;
	if (roomLocationCount > 0) {
		errors.push({
			field: "room_location",
			msg: "Room location already exists",
		});
	}

	// Check other fields similarly
	// ...

	if (errors.length > 0) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const departmentData = {
			department,
			contact_number,
			room_location,
		};

		const departmentSql = "INSERT INTO department SET ?";
		const result = await query(departmentSql, departmentData);

		return res.json({ success: true, department_id: result.insertId });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to add department" });
	}
};
const getDepartmentEdit = async (req, res) => {
	const dp_id = req.params.dp_id;

	try {
		const departments = await query(
			`SELECT dp.id as dp_id, dp.department, dp.contact_number, dp.room_location FROM department dp WHERE dp.id = ? ;`,
			[dp_id]
		);

		// Send the department data as JSON
		res.json({
			success: true,
			data: departments[0],
		});
	} catch (error) {
		console.error("Error fetching department data:", error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
const postEditDepartment = async (req, res) => {
	const { department_id, department, contact_number, room_location } =
		req.body;
	let errors = [];

	// Validate required fields
	if (!department_id || !department || !contact_number || !room_location) {
		errors.push({ msg: "Please fill in all required fields." });
	}

	// Check if the department exists
	const departmentExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE id = ?";
	const departmentExists = (
		await query(departmentExistQuery, [department_id])
	)[0].count;
	if (departmentExists === 0) {
		errors.push({ msg: "Department not found." });
	}

	// Check if the department name already exists for another department
	const departmentNameExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE department = ? AND id != ?";
	const departmentNameCount = (
		await query(departmentNameExistQuery, [department, department_id])
	)[0].count;
	if (departmentNameCount > 0) {
		errors.push({
			field: "department",
			msg: "Department name already exists",
		});
	}

	// Check if the contact number already exists for another department
	const contactNumberExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE contact_number = ? AND id != ?";
	const contactNumberCount = (
		await query(contactNumberExistQuery, [contact_number, department_id])
	)[0].count;
	if (contactNumberCount > 0) {
		errors.push({
			field: "contact_number",
			msg: "Contact number already exists",
		});
	}

	// Check if the room location already exists for another department
	const roomLocationExistQuery =
		"SELECT COUNT(*) as count FROM department WHERE room_location = ? AND id != ?";
	const roomLocationCount = (
		await query(roomLocationExistQuery, [room_location, department_id])
	)[0].count;
	if (roomLocationCount > 0) {
		errors.push({
			field: "room_location",
			msg: "Room location already exists",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const departmentData = {
			department,
			contact_number,
			room_location,
		};

		// Update the department in the database
		const departmentSql = "UPDATE department SET ? WHERE id = ?";
		await query(departmentSql, [departmentData, department_id]);

		return res.json({
			success: true,
			message: "Department updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update department" });
	}
};
const deleteDepartment = async (req, res) => {
	const { department_id } = req.body;

	try {
		const deleteQuery = "DELETE FROM department WHERE id = ?";
		await query(deleteQuery, [department_id]);
		return res.json({ success: true });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete department." });
	}
};

const getDesignation = async (req, res) => {
	const departments = await query(`
      SELECT dp.id as dp_id, dp.department FROM department dp;
    `);

	const designations = await query(`
     SELECT dp.id as dp_id, dp.department,ds.designation, ds.id as ds_id FROM department dp INNER JOIN designation ds ON dp.id = ds.department_id ORDER BY ds_id DESC
    `);

	res.render("Admin/designation", {
		title: "Designation",
		page: "designation",
		pagetitle: "Designation",
		departments,
		designations,
	});
};
const postDesignation = async (req, res) => {
	const { department, designation } = req.body;
	let errors = [];

	// Check if the designation already exists for the department
	const designationExistQuery =
		"SELECT COUNT(*) as count FROM designation WHERE designation = ? AND department_id = ?";
	const designationCount = (
		await query(designationExistQuery, [designation, department])
	)[0].count;
	if (designationCount > 0) {
		errors.push({
			field: "designation",
			msg: "Designation already exists in this department",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const designationData = {
			designation,
			department_id: department, // Assuming `department` is the department ID
		};

		const designationSql = "INSERT INTO designation SET ?";
		const result = await query(designationSql, designationData);

		return res.json({ success: true, designation_id: result.insertId });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to add designation" });
	}
};
const getDesignationEdit = async (req, res) => {
	const designation_id = req.params.ds_id;

	try {
		// Query to fetch the specific designation data along with its associated department
		const designations = await query(
			`SELECT 
                dg.id as designation_id, 
                dg.designation, 
                dg.department_id, 
                dp.department 
            FROM 
                designation dg 
            JOIN 
                department dp 
            ON 
                dg.department_id = dp.id 
            WHERE 
                dg.id = ?;`,
			[designation_id]
		);

		// Send the designation data as JSON
		res.json({
			success: true,
			data: designations[0], // Return the first (and likely only) result
		});
	} catch (error) {
		console.error("Error fetching designation data:", error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
const postEditDesignation = async (req, res) => {
	const { designation_id, designation, department_id } = req.body;
	let errors = [];

	// Validate required fields
	if (!designation_id || !designation || !department_id) {
		errors.push({ msg: "Please fill in all required fields." });
	}

	// Check if the designation exists
	const designationExistQuery =
		"SELECT COUNT(*) as count FROM designation WHERE id = ?";
	const designationExists = (
		await query(designationExistQuery, [designation_id])
	)[0].count;
	if (designationExists === 0) {
		errors.push({ msg: "Designation not found." });
	}

	// Check if the designation name already exists within the same department for another designation
	const designationNameExistQuery =
		"SELECT COUNT(*) as count FROM designation WHERE designation = ? AND department_id = ? AND id != ?";
	const designationNameCount = (
		await query(designationNameExistQuery, [
			designation,
			department_id,
			designation_id,
		])
	)[0].count;
	if (designationNameCount > 0) {
		errors.push({
			field: "designation",
			msg: "Designation name already exists in this department",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const designationData = {
			designation,
			department_id,
		};

		// Update the designation in the database
		const designationSql = "UPDATE designation SET ? WHERE id = ?";
		await query(designationSql, [designationData, designation_id]);

		return res.json({
			success: true,
			message: "Designation updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update designation" });
	}
};
const deleteDesignation = async (req, res) => {
	const { designation_id } = req.body;

	try {
		const deleteQuery = "DELETE FROM designation WHERE id = ?";
		await query(deleteQuery, [designation_id]);
		return res.json({ success: true });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete department." });
	}
};

const getHoliday = async (req, res) => {
	const holidays = await query("SELECT * FROM holidays");
	res.render("Admin/holiday", {
		title: "Holiday",
		page: "holiday",
		pagetitle: "Holiday",
		holidays,
	});
};

const getHolidayEdit = async (req, res) => {
	const holiday_id = req.params.holiday_id;

	try {
		const holidays = await query(`SELECT * FROM holidays WHERE id = ?`, [
			holiday_id,
		]);
		const date = new Date(holidays[0].holiday_date); // Create a Date object

		const month = date.getUTCMonth() + 1; // Get month name (0-11, so using as index)
		const day = date.getUTCDate() + 1; // Get day (1-31)

		// Send the holidays data as JSON
		res.json({
			success: true,
			data: holidays[0],
			day,
			month, // Return the first (and likely only) result
		});
	} catch (error) {
		console.error("Error fetching holidays data:", error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

const postHoliday = async (req, res) => {
	const { month, day, description } = req.body;
	let errors = [];

	// Construct the holiday date with a dummy year
	const holidayDate = `2000-${month}-${day}`;

	try {
		// Check if the holiday date already exists
		const holidayExistQuery =
			"SELECT COUNT(*) as count FROM holidays WHERE holiday_date = ?";
		const holidayCount = (await query(holidayExistQuery, [holidayDate]))[0]
			.count;
		if (holidayCount > 0) {
			errors.push({
				field: "day",
				msg: "Holiday for this date already exists",
			});
		}

		// If there are errors, return them
		if (errors.length > 0) {
			return res.status(400).json({ success: false, errors });
		}

		// Insert the new holiday
		const holidayData = {
			holiday_date: holidayDate,
			description,
		};

		const holidaySql = "INSERT INTO holidays SET ?";
		const result = await query(holidaySql, holidayData);

		return res.json({ success: true, holiday_id: result.insertId });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to add holiday" });
	}
};

const postHolidayEdit = async (req, res) => {
	const { holiday_id, month, day, description } = req.body;

	let errors = [];

	// Validate required fields
	if (!holiday_id || !month || !day || !description) {
		errors.push({ msg: "Please fill in all required fields." });
	}

	// Construct the holiday date with a dummy year
	const holidayDate = `2000-${month}-${day}`;

	try {
		// Check if the holiday date already exists (excluding the current holiday being edited)
		const holidayDateExistQuery =
			"SELECT COUNT(*) as count FROM holidays WHERE holiday_date = ? AND id != ?";
		const holidayDateCount = (
			await query(holidayDateExistQuery, [holidayDate, holiday_id])
		)[0].count;
		if (holidayDateCount > 0) {
			errors.push({
				field: "day",
				msg: "Holiday for this date already exists",
			});
		}

		// If there are errors, return them
		if (errors.length > 0) {
			return res.status(400).json({ success: false, errors });
		}

		// Update the holiday in the database
		const holidayData = {
			holiday_date: holidayDate,
			description,
		};

		const holidaySql = "UPDATE holidays SET ? WHERE id = ?";
		await query(holidaySql, [holidayData, holiday_id]);

		return res.json({
			success: true,
			message: "Holiday updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update holiday" });
	}
};

const deleteHoliday = async (req, res) => {
	const { holiday_id } = req.body;

	try {
		const deleteQuery = "DELETE FROM holidays WHERE id = ?";
		await query(deleteQuery, [holiday_id]);
		return res.json({ success: true });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete holidays." });
	}
};

const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/admin/signin");
};
export default {
	getSignIn,
	postSignIn,
	checkUsername,
	checkEmail,
	checkPhonenumber,
	checkRFID,
	getDashboard,
	getEmployee,
	getEmployeeEditId,
	postEmployeeEditId,
	postEmploymentEdit,
	postAccountDetails,
	postRfidCard,
	getEmployeeAdd,
	postEmployeeAdd,
	getRecordAttendance,
	getAttendance,
	getAttendanceId,
	postMarkAttendance,
	getAttendanceReport,
	getExportExcel,
	getDepartment,
	getDepartmentEdit,
	postDepartment,
	postEditDepartment,
	deleteDepartment,
	getDesignation,
	postDesignation,
	getDesignationEdit,
	postEditDesignation,
	deleteDesignation,
	getHoliday,
	getHolidayEdit,
	postHoliday,
	postHolidayEdit,
	deleteHoliday,
	getLogout,
};
