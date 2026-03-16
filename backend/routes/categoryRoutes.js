import expres from "express";
import {
  // Admin controllers
  addCategory,
  deleteCategory,
  editCategory,
  getAllActiveCategory,
  getAllCategory,
  getAllFeaturedCategory,

  // Seller controllers
  addSellerCategory,
  editSellerCategory,
  deleteSellerCategory,
  getSellerCategories,
  getSellerCategoryDetails,
  getAllSellerCategories,

  // Common
  getCategoryProducts,
} from "../controllers/categoryController.js";
import {
  isAdmin,
  isSeller,
  isValidToken,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = expres.Router();

// ============ ADMIN APIs (Platform Categories) ============
// These are main platform categories (like Amazon's top-level categories)
router.post(
  "/v1/admin/add-category",
  isValidToken,
  isAdmin,
  upload.single("image"),
  addCategory,
);
router.put(
  "/v1/admin/edit-category",
  isValidToken,
  isAdmin,
  upload.single("image"),
  editCategory,
);
router.delete(
  "/v1/admin/delete-category",
  isValidToken,
  isAdmin,
  deleteCategory,
);
router.get("/v1/admin/categories", isValidToken, isAdmin, getAllCategory);

// ============ SELLER APIs (Seller's Store Categories) ============
// These are seller-specific categories (like Amazon seller's store categories)
router.post(
  "/v1/seller/add-category",
  isValidToken,
  isSeller,
  upload.single("image"),
  addSellerCategory,
);
router.put(
  "/v1/seller/edit-category/:categoryId",
  isValidToken,
  isSeller,
  upload.single("image"),
  editSellerCategory,
);
router.delete(
  "/v1/seller/delete-category/:categoryId",
  isValidToken,
  isSeller,
  deleteSellerCategory,
);
router.get(
  "/v1/seller/getSellerCategories",
  isValidToken,
  isSeller,
  getSellerCategories,
); // Get all categories created by this seller
router.get(
  "/v1/seller/getSellerCategoryDetails/:categoryId",
  isValidToken,
  isSeller,
  getSellerCategoryDetails,
); // Get specific seller category
router.get(
  "/v1/seller/all-categories",
  isValidToken,
  isSeller,
  getAllSellerCategories,
); // Get all categories (platform + seller's)

// ============ PUBLIC APIs ============
// These are visible to all users
router.get("/v1/getAllActiveCategory", getAllActiveCategory);
router.get("/v1/getAllFeaturedCategory", getAllFeaturedCategory);
router.get("/v1/getAllCategory", getAllCategory);
router.get("/v1/getCategoryProducts", getCategoryProducts);

export default router;
