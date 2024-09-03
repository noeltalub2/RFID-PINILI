import { Router } from "express";
import adminController from "../controller/adminController.js";
import { uploadConfig } from "../middleware/uploadImage.js";
import auth from "../middleware/authMiddleware.js";
import { resizeImages } from "../middleware/uploadImage.js"; // Ensure you import the resizeImages middleware

const router = Router();

router.get("/signin", auth.forwardAuth, adminController.getSignIn);
router.post("/signin", auth.forwardAuth, adminController.postSignIn);

router.post(
	"/employee/check-username",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.checkUsername
);
router.post(
	"/employee/check-email",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.checkEmail
);
router.post(
	"/employee/check-phonenumber",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.checkPhonenumber
);
router.post(
	"/employee/check-rfid",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.checkRFID
);

router.get(
	"/dashboard",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getDashboard
);

router.get(
	"/employee",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getEmployee
);
router.get(
	"/employee/add",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getEmployeeAdd
);


router.post(
	"/employee/",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	uploadConfig, // Apply the uploadConfig middleware here as well
	resizeImages, // Apply the resizeImages middleware to process the uploaded images
	adminController.postEmployeeAdd
);


router.get(
	"/employee/:uuid/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getEmployeeEditId
);

router.post(
	"/employee/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	uploadConfig, // Apply the uploadConfig middleware here as well
	resizeImages, // Apply the resizeImages middleware to process the uploaded images
	adminController.postEmployeeEditId
);


router.post(
	"/employee/employment",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postEmploymentEdit
);

router.post(
	"/employee/login",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postAccountDetails
);

router.post(
	"/employee/rfid",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postRfidCard
);

router.get(
	"/record-attendance",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getRecordAttendance
);

router.post(
	"/mark-attendance",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postMarkAttendance
);

router.get(
	"/attendance",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAttendance
);
router.get(
	"/attendance/:uuid",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAttendanceId
);
router.get(
	"/report-attendance",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAttendanceReport
);
router.get(
	"/report-attendance/export",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getExportExcel
);
router.get(
	"/department",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getDepartment
);
router.get(
    "/department/:dp_id/edit",
    auth.requireAuth,
    auth.checkRole(["admin"]),
    adminController.getDepartmentEdit 
);

router.post(
	"/department",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postDepartment
);

router.post(
	"/department/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postEditDepartment
);
router.post(
	"/department/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteDepartment
);



router.get(
	"/designation",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getDesignation
);
router.get(
    "/designation/:ds_id/edit",
    auth.requireAuth,
    auth.checkRole(["admin"]),
    adminController.getDesignationEdit 
);

router.post(
	"/designation",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postDesignation
);

router.post(
	"/designation/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postEditDesignation
);

router.post(
	"/designation/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteDesignation
);

router.get(
	"/holiday",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getHoliday
);
router.get(
	"/holiday/:holiday_id/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getHolidayEdit
);
router.post(
	"/holiday",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postHoliday
);
router.post(
	"/holiday/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.postHolidayEdit
);

router.post(
	"/holiday/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteHoliday
);



router.get(
	"/logout",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getLogout
);

export default router;
