import express from "express";
import {
  createAdmin,
  forgotPassword,
  registerBuyer,
  registerSeller,
  sendEmailOtp,
  userLogin,
  verifyEmailOtp,
  resetPassword,
} from "../controllers/authController.js";
import { isAdmin, isValidToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/v1/login", userLogin);
router.post("/admin/v1/createAdmin", isValidToken, isAdmin, createAdmin);
router.post(
  "/seller/v1/registerSeller",
  upload.fields([
    { name: "panDoc", maxCount: 1 },
    { name: "addhaarDoc", maxCount: 1 },
  ]),
  registerSeller,
);
router.post("/user/v1/registerBuyer", registerBuyer);
router.post("/v1/forgot-password", forgotPassword);
router.post("/v1/send-otp", sendEmailOtp);
router.post("/v1/verify-otp", verifyEmailOtp);
router.post("/v1/reset-password", resetPassword);

export default router;
