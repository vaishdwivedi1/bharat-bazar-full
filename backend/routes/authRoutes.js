import express from "express";
import {
  userLogin,
  createAdmin,
  createSeller,
} from "../controllers/authController.js";
import { isAdmin, isValidToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/admin/v1/login", userLogin);
router.post("/admin/v1/createAdmin", isValidToken, isAdmin, createAdmin);
router.post(
  "/admin/v1/createSeller",
  upload.fields([
    { name: "panDoc", maxCount: 1 },
    { name: "addhaarDoc", maxCount: 1 },
  ]),
  createSeller,
);

export default router;
