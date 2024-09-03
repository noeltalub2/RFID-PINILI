import { Router } from "express";
import userController from "../controller/userController.js";
import { uploadConfig } from "../middleware/uploadImage.js";
import auth from "../middleware/authMiddleware.js";
import { resizeImages } from "../middleware/uploadImage.js"; // Ensure you import the resizeImages middleware

const router = Router();

router.get("/signin", auth.forwardAuth, userController.getSignIn);

router.post("/signin", auth.forwardAuth, userController.postSignIn);


router.get("/request-reset", auth.forwardAuth, userController.getReqPass);
router.post("/request-reset", auth.forwardAuth, userController.postReqPass);

router.get("/reset-password/:token", auth.forwardAuth, userController.getResetPass);
router.post("/reset-password/", auth.forwardAuth, userController.postResetPass);

router.post(
	"/check-username",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.checkUsername
);
router.post(
	"/check-email",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.checkEmail
);
router.post(
	"/check-phonenumber",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.checkPhonenumber
);
router.get(
	"/home",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.getHome
);
router.get(
	"/attendance",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.getAttendance
);


router.get(
	"/profile",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.getProfile
);

router.post(
	"/profile",
	auth.requireAuth,
	auth.checkRole(["user"]),
	uploadConfig, // Apply the uploadConfig middleware here as well
	resizeImages, // Apply the resizeImages middleware to process the uploaded images
	userController.postProfile
);

router.post(
	"/profile/change-password",
	auth.requireAuth,
	auth.checkRole(["user"]),

	userController.postChangePass
);



router.get(
	"/logout",
	auth.requireAuth,
	auth.checkRole(["user"]),
	userController.getLogout
);

export default router;
