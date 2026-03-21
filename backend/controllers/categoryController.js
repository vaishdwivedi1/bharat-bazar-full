import { Category } from "../models/Category.js";
import fs from "fs";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/uploadOnCloudinary.js";
import mongoose from "mongoose";
import { Product } from "../models/Products.js";
import { User } from "../models/User.js";

export const addCategory = async (req, res) => {
  try {
    // SAB FIELDS add kar yahan
    const {
      name,
      slug,
      description,
      productsCount = "0", // ADD KAR
      icon = "📦", // ADD KAR
      subcategories = [], // ADD KAR
      type = "platform", // ADD KAR
      parentCategory = null, // ADD KAR
      level = 0, // ADD KAR
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

    // Handle subcategories agar string array ho to
    let parsedSubcategories = subcategories;
    if (typeof subcategories === "string") {
      try {
        parsedSubcategories = JSON.parse(subcategories);
      } catch {
        parsedSubcategories = subcategories.split(",").map((s) => s.trim());
      }
    }

    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, "-"),
      image: imageUrl,
      description,
      productsCount, // ADD KAR
      icon, // ADD KAR
      subcategories: parsedSubcategories, // ADD KAR
      type, // ADD KAR
      parentCategory, // ADD KAR
      level, // ADD KAR
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

// ============ SELLER CATEGORY CONTROLLERS ============

export const addSellerCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      isFeatured,
      isActive = true,
      productsCount,
      subcategories,
      level,
      parentCategory,
    } = req.body;

    const imageFile = req.file;
    const sellerId = req.user?.id; // Add optional chaining for safety

    // Validate seller ID
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Handle image upload
    let imageUrl = "";
    if (imageFile) {
      try {
        // Check if uploadOnCloudinary function exists
        if (typeof uploadOnCloudinary !== "function") {
          throw new Error("Cloudinary upload function not configured");
        }

        const cloudinaryResponse = await uploadOnCloudinary(imageFile.path);

        // Check if upload was successful
        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          imageUrl = cloudinaryResponse.secure_url;
        } else {
          throw new Error("Failed to get image URL from Cloudinary");
        }

        // Safely delete temp file
        if (fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        // Don't fail the whole request if image upload fails
        // Just proceed without image
        imageUrl = "";
      }
    }

    // Check if seller already has a category with this name
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case insensitive search
      seller: sellerId,
      type: "seller",
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "You already have a category with this name",
      });
    }

    // Parse subcategories if they're sent as JSON string
    let parsedSubcategories = [];
    if (subcategories) {
      try {
        parsedSubcategories =
          typeof subcategories === "string"
            ? JSON.parse(subcategories)
            : subcategories;
      } catch (e) {
        console.warn("Error parsing subcategories:", e);
        parsedSubcategories = [];
      }
    }

    // Create category with all fields
    const categoryData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^\w]+/g, "-"), // Better slug generation
      description: description || "",
      image: imageUrl,
      icon: icon || "📦",
      isFeatured: isFeatured === "true" || isFeatured === true,
      isActive: isActive === "true" || isActive === true,
      productsCount: productsCount || "0",
      subcategories: parsedSubcategories,
      level: level ? parseInt(level) : 0,
      seller: sellerId,
      type: "seller",
    };

    // Add parentCategory only if provided and valid
    if (
      parentCategory &&
      parentCategory !== "null" &&
      parentCategory !== "undefined"
    ) {
      categoryData.parentCategory = parentCategory;
    }

    const category = await Category.create(categoryData);

    return res.status(201).json({
      success: true,
      message: "Seller category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error in addSellerCategory:", error);

    // Clean up temp file if it exists and there's an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const editSellerCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, slug, description, isActive, parentCategory } = req.body;
    const imageFile = req.file;
    const sellerId = req.user.id;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find the category and ensure it belongs to this seller
    const existingCategory = await Category.findOne({
      _id: categoryId,
      seller: sellerId,
      type: "seller",
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found or you don't have permission to edit it",
      });
    }

    // Build update object
    const updateData = {};

    if (name) {
      // Check if new name conflicts with existing category
      const nameExists = await Category.findOne({
        name: name,
        seller: sellerId,
        type: "seller",
        _id: { $ne: categoryId },
      });

      if (nameExists) {
        return res.status(400).json({
          message: "You already have another category with this name",
        });
      }

      updateData.name = name;
      if (!slug) {
        updateData.slug = name.toLowerCase().replace(/ /g, "-");
      }
    }

    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }
    if (parentCategory !== undefined)
      updateData.parentCategory = parentCategory;

    // Handle image upload
    if (imageFile) {
      try {
        const cloudinaryResponse = await uploadOnCloudinary(imageFile.path);
        updateData.image = cloudinaryResponse.secure_url;
        fs.unlinkSync(imageFile.path);

        // Delete old image
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

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Seller category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteSellerCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sellerId = req.user.id;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find the category and ensure it belongs to this seller
    const category = await Category.findOne({
      _id: categoryId,
      seller: sellerId,
      type: "seller",
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found or you don't have permission to delete it",
      });
    }

    // Check if category has subcategories
    const subCategories = await Category.find({
      parentCategory: categoryId,
      seller: sellerId,
    });

    if (subCategories.length > 0) {
      return res.status(400).json({
        message:
          "Please delete subcategories first or move them to another category",
      });
    }

    // Check if category has products
    const Product = mongoose.model("Product");
    const productsCount = await Product.countDocuments({
      sellerCategory: categoryId,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message:
          "This category has products. Please move products to another category first",
      });
    }

    // Delete image from cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Seller category deleted successfully",
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSellerCategories = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({
      seller: sellerId,
      type: "seller",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("parentCategory", "name image");

    const totalCategories = await Category.countDocuments({
      seller: sellerId,
      type: "seller",
    });
    const totalPages = Math.ceil(totalCategories / limit);

    // Get product counts for each category
    const Product = mongoose.model("Product");
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          sellerCategory: category._id,
        });
        return {
          ...category.toObject(),
          productCount,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: categories.length,
      totalCategories,
      totalPages,
      currentPage: page,
      categories: categoriesWithCounts,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSellerCategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sellerId = req.user._id;

    const category = await Category.findOne({
      _id: categoryId,
      seller: sellerId,
      type: "seller",
    }).populate("parentCategory", "name image");

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Get product count and recent products
    const Product = mongoose.model("Product");
    const productCount = await Product.countDocuments({
      sellerCategory: categoryId,
    });

    const recentProducts = await Product.find({
      sellerCategory: categoryId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name images pricingTiers isActive");

    return res.status(200).json({
      success: true,
      category,
      productCount,
      recentProducts,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllSellerCategories = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { includePlatform } = req.query;

    // Get seller's categories
    const sellerCategories = await Category.find({
      seller: sellerId,
      type: "seller",
      isActive: true,
    }).select("name image slug productCount");

    let platformCategories = [];

    // Optionally include platform categories
    if (includePlatform === "true") {
      platformCategories = await Category.find({
        type: { $ne: "seller" }, // Platform categories
        isActive: true,
      }).select("name image slug");
    }

    return res.status(200).json({
      success: true,
      sellerCategories,
      ...(includePlatform === "true" && { platformCategories }),
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ============ COMMON CONTROLLERS ============

export const getCategoryProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const { page = 1, limit = 10, sort, ...filters } = req.query;

    // First, get the category with its subcategories
    const category = await Category.findById(categoryId)
      .populate("parentCategory", "name image")
      .lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get all subcategory IDs (recursively if needed)
    let categoryIds = [categoryId];

    // If the category has subcategories (stored as strings), we need to find the actual Category documents
    if (category.subcategories && category.subcategories.length > 0) {
      // Find all subcategories that have this category as parent
      const subCategories = await Category.find({
        parentCategory: categoryId,
        isActive: true,
      }).select("_id");

      const subCategoryIds = subCategories.map((sub) => sub._id.toString());
      categoryIds = [...categoryIds, ...subCategoryIds];
    }

    // Build query for products
    const query = {
      isActive: true,
      $or: [
        { category: { $in: categoryIds } },
        { subCategory: { $in: categoryIds } },
      ],
    };

    // Apply additional filters
    if (filters.minPrice || filters.maxPrice) {
      query.pricingTiers = {
        $elemMatch: {
          pricePerPiece: {
            ...(filters.minPrice && { $gte: Number(filters.minPrice) }),
            ...(filters.maxPrice && { $lte: Number(filters.maxPrice) }),
          },
        },
      };
    }

    if (filters.minRating) {
      query["rating.average"] = { $gte: Number(filters.minRating) };
    }

    if (filters.inStock === "true") {
      query.totalStock = { $gt: 0 };
    }

    if (filters.seller) {
      query.seller = filters.seller;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case "price_asc":
          sortOptions = { "pricingTiers.0.pricePerPiece": 1 };
          break;
        case "price_desc":
          sortOptions = { "pricingTiers.0.pricePerPiece": -1 };
          break;
        case "rating_desc":
          sortOptions = { "rating.average": -1 };
          break;
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "popular":
          sortOptions = { "rating.count": -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }

    // Execute queries in parallel for better performance
    const [products, totalCount, priceRange] = await Promise.all([
      Product.find(query)
        .populate("seller", "businessName storeName email")
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Product.countDocuments(query),

      Product.aggregate([
        { $match: query },
        { $unwind: "$pricingTiers" },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$pricingTiers.pricePerPiece" },
            maxPrice: { $max: "$pricingTiers.pricePerPiece" },
          },
        },
      ]),
    ]);

    // Get unique sellers for filter options
    const sellers = await Product.distinct("seller", query);
    const sellerDetails = await User.find({
      _id: { $in: sellers },
      role: "seller",
    }).select("businessName storeName _id");

    // Prepare response
    return res.status(200).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        icon: category.icon,
        parentCategory: category.parentCategory,
        subcategories: category.subcategories,
      },
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalProducts: totalCount,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      filters: {
        priceRange:
          priceRange.length > 0
            ? { min: priceRange[0].minPrice, max: priceRange[0].maxPrice }
            : { min: 0, max: 0 },
        sellers: sellerDetails,
        availableRatings: [4, 3, 2, 1],
      },
      sortOptions: [
        { value: "newest", label: "Newest First" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "rating_desc", label: "Top Rated" },
        { value: "popular", label: "Most Popular" },
      ],
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
