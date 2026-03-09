import { Category } from "../models/Category.js";
import fs from "fs";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/uploadOnCloudinary.js";
import mongoose from "mongoose";

export const addCategory = async (req, res) => {
  try {
    // With multer, form fields will be in req.body
    const {
      name,
      slug,
      description,
      isActive = true,
      isFeatured = true,
    } = req.body;

    // Check if image file exists
    const imageFile = req.file;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Handle image upload
    let imageUrl = "";
    try {
      const cloudinaryResponse = await uploadOnCloudinary(imageFile.path);
      imageUrl = cloudinaryResponse.secure_url;
      fs.unlinkSync(imageFile.path); // Clean up temp file
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);
      return res.status(500).json({ message: "Error uploading image" });
    }

    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, "-"),
      image: imageUrl,
      description,
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    if (category._id) {
      return res.status(201).json({
        message: "Category created successfully",
        category,
      });
    }
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllActiveCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments({ isActive: true });
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      success: true,
      count: categories.length,
      totalCategories,
      totalPages,
      currentPage: page,
      categories,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllFeaturedCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({
      isFeatured: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments({
      isFeatured: true,
      isActive: true,
    });
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      success: true,
      count: categories.length,
      totalCategories,
      totalPages,
      currentPage: page,
      categories,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments({});
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      success: true,
      count: categories.length,
      totalCategories,
      totalPages,
      currentPage: page,
      categories,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive, isFeatured, id } = req.body;

    const imageFile = req.file;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find the category first
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Build update object with only provided fields
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined)
      updateData.isActive = isActive === "true" || isActive === true;
    if (isFeatured !== undefined)
      updateData.isFeatured = isFeatured === "true" || isFeatured === true;

    // Handle slug (generate if name is updated but slug not provided)
    if (slug) {
      updateData.slug = slug;
    } else if (name) {
      updateData.slug = name.toLowerCase().replace(/ /g, "-");
    }

    // Handle image upload if new file is provided
    if (imageFile) {
      try {
        const cloudinaryResponse = await uploadOnCloudinary(imageFile.path);
        updateData.image = cloudinaryResponse.secure_url;
        fs.unlinkSync(imageFile.path); // Clean up temp file

        // Optional: Delete old image from cloudinary
        if (existingCategory.image) {
          const publicId = existingCategory.image
            .split("/")
            .pop()
            .split(".")[0];
          await deleteFromCloudinary(publicId);
        }
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query; // Change from req.params to req.query

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optional: Delete image from cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Check if category has subcategories
    const subCategories = await Category.find({ parent: id });
    if (subCategories.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with subcategories. Delete subcategories first.",
      });
    }

    // Check if category has products
    const Product = mongoose.model("Product");
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with products. Move or delete products first.",
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
