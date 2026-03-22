import express from "express";
import {
  addAddress,
  addPaymentMethod,
  changePassword,
  // Account Settings
  deactivateAccount,
  deleteAccount,
  deleteAddress,
  deleteAvatar,
  deletePaymentMethod,
  // Address Management
  getAddresses,
  // Admin Only
  getAllUsers,
  // Payment Methods (UPI, Cards)
  getPaymentMethods,
  // Profile
  getProfile,
  // Seller Verification
  getSellerVerification,
  getUserById,
  setDefaultAddress,
  setDefaultPaymentMethod,
  toggleUserStatus,
  updateAddress,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import {
  isAdmin,
  isSeller,
  isValidToken,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ============ PROFILE MANAGEMENT ============
router.get("/v1/profile", isValidToken, getProfile);
router.put("/v1/profile", isValidToken, updateProfile);
router.put("/v1/change-password", isValidToken, changePassword);
router.post(
  "/v1/upload-avatar",
  isValidToken,
  upload.single("avatar"),
  uploadAvatar,
);
router.delete("/v1/delete-avatar", isValidToken, deleteAvatar);

// ============ ADDRESS MANAGEMENT ============
router.get("/v1/addresses", isValidToken, getAddresses);
router.post("/v1/addresses", isValidToken, addAddress);
router.put("/v1/addresses/:addressId", isValidToken, updateAddress);
router.delete("/v1/addresses/:addressId", isValidToken, deleteAddress);
router.put("/v1/addresses/:addressId/default", isValidToken, setDefaultAddress);

// ============ PAYMENT METHODS (UPI, CARDS) ============
router.get("/v1/payment-methods", isValidToken, getPaymentMethods);
router.post("/v1/payment-methods", isValidToken, addPaymentMethod);
router.delete(
  "/v1/payment-methods/:paymentMethodId",
  isValidToken,
  deletePaymentMethod,
);
router.put(
  "/v1/payment-methods/:paymentMethodId/default",
  isValidToken,
  setDefaultPaymentMethod,
);

// ============ SELLER VERIFICATION ============
router.get(
  "/v1/seller/verification",
  isValidToken,
  isSeller,
  getSellerVerification,
);

// ============ ACCOUNT SETTINGS ============
router.post("/v1/deactivate", isValidToken, deactivateAccount);
router.delete("/v1/account", isValidToken, deleteAccount);

// ============ ADMIN ROUTES ============
router.get("/v1/admin/users", isValidToken, isAdmin, getAllUsers);
router.get("/v1/admin/users/:userId", isValidToken, isAdmin, getUserById);
router.put(
  "/v1/admin/users/:userId/status",
  isValidToken,
  isAdmin,
  toggleUserStatus,
);

export default router;
