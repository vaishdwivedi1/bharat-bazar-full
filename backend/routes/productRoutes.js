import express from "express";
import {
  isAdmin,
  isSeller,
  isValidToken,
} from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getAllActiveProducts,
  getAllFeaturedProducts,
  getProductDetailsUsers,
  getProductsByCategory,
  searchProducts,
  getTopSellingProducts,
  getDiscountedProducts,
  getRelatedProducts,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getAllProductsBySeller,
  getProductDetailsSellers,
  getProductAnalytics,
  editProduct,
  deleteProduct,
  getFlaggedProducts,
  createProduct,
  changeProductStatus,
  bulkCreateProducts,
} from "../controllers/productController.js";

const router = express.Router();

// ============ USER APIs (Public/Authenticated Users) ============
router.get("/v1/getAllProducts", getAllProducts);
router.get("/v1/getAllActiveProducts", getAllActiveProducts);
router.get("/v1/getAllFeaturedProducts", getAllFeaturedProducts);
router.get("/v1/getProductDetailsUsers", getProductDetailsUsers);
router.get("/v1/getProductsByCategory", getProductsByCategory);
router.get("/v1/searchProducts", searchProducts);
router.get("/v1/getTopSellingProducts", getTopSellingProducts);
router.get("/v1/getDiscountedProducts", getDiscountedProducts);
router.get("/v1/getRelatedProducts", getRelatedProducts);
router.get("/v1/getProductReviews", getProductReviews);
router.post("/v1/addProductReview", addProductReview);
router.post("/v1/updateProductReview", updateProductReview);
router.post("/v1/deleteProductReview", deleteProductReview);

// ============ SELLER APIs (Seller Only) ============
router.get(
  "/v1/getAllProductsBySeller",
  isValidToken,
  isSeller,
  getAllProductsBySeller,
);
router.get(
  "/v1/getProductDetailsSellers",
  isValidToken,
  isSeller,
  getProductDetailsSellers,
);
router.get(
  "/v1/getProductAnalytics",
  isValidToken,
  isSeller,
  getProductAnalytics,
);
// router.post(
//   "/v1/createProduct",
//   isValidToken,
//   // isSeller,
//   isAdmin,
//   createProduct,
// ); // Changed from get to post
router.post("/v1/bulkCreateProducts", bulkCreateProducts); // Changed from get to post
router.post("/v1/editProduct", isValidToken, isSeller, editProduct); // Changed from get to post
router.post("/v1/deleteProduct", isValidToken, isSeller, deleteProduct); // Changed from get to post

// ============ ADMIN APIs (Admin Only) ============
// Product Oversight (not full approval, just oversight) [citation:1][citation:7]
router.get(
  "/admin/v1/getFlaggedProducts",
  isValidToken,
  isAdmin,
  getFlaggedProducts,
); // Products reported by users
router.post(
  "/admin/v1/changeProductStatus",
  isValidToken,
  isAdmin,
  changeProductStatus,
); // Hide / unhide / flag inappropriate products

export default router;
