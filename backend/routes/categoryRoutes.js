import expres from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllActiveCategory,
  getAllCategory,
  getAllFeaturedCategory,
} from "../controllers/categoryController.js";
import { isAdmin, isValidToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = expres.Router();

router.post(
  "/v1/add-category",
  isValidToken,
  isAdmin,
  upload.single("image"),
  addCategory,
);
router.put(
  "/v1/edit-category",
  isValidToken,
  isAdmin,
  upload.single("image"),
  editCategory,
);
router.delete("/v1/delete-category", isValidToken, isAdmin, deleteCategory);

router.get("/v1/category/active", getAllActiveCategory);
router.get("/v1/category/featured", getAllFeaturedCategory);
router.get("/v1/category/all", getAllCategory);
router.get("/v1/category-details", isAdmin, addCategory);
export default router;
