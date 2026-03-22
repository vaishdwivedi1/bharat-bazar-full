import { Product } from "../models/Products.js";
import { Category } from "../models/Category.js";
import mongoose from "mongoose";
import fs from "fs";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/uploadOnCloudinary.js";

// ============ USER APIs (Public/Authenticated Users) ============

export const getAllActiveProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    const products = await Product.find(query)
      .populate("category", "name slug image")
      .populate("subCategory", "name slug")
      .populate("seller", "businessName storeName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getAllActiveProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isFeatured: true, isActive: true };

    const products = await Product.find(query)
      .populate("category", "name slug image")
      .populate("subCategory", "name slug")
      .populate("seller", "businessName storeName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getAllFeaturedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductDetailsUsers = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId)
      .populate("category", "name slug image description")
      .populate("subCategory", "name slug")
      .populate("seller", "businessName storeName email phone address")
      // .populate("reviews", "rating comment user createdAt")
      .populate("relatedProducts", "name images pricingTiers slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in getProductDetailsUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Get category and all subcategories
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Find all subcategories under this category
    const subCategories = await Category.find({
      parentCategory: categoryId,
    });

    const categoryIds = [categoryId, ...subCategories.map((sc) => sc._id)];

    const query = {
      category: { $in: categoryIds },
      isActive: true,
    };

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("seller", "businessName storeName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // Text search
    if (q && q.trim()) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
        { longDescription: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query["pricingTiers.pricePerPiece"] = {};
      if (minPrice)
        query["pricingTiers.pricePerPiece"].$gte = parseFloat(minPrice);
      if (maxPrice)
        query["pricingTiers.pricePerPiece"].$lte = parseFloat(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOptions = { "pricingTiers.0.pricePerPiece": 1 };
    } else if (sort === "price_desc") {
      sortOptions = { "pricingTiers.0.pricePerPiece": -1 };
    } else if (sort === "rating_desc") {
      sortOptions = { "rating.average": -1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("seller", "businessName storeName")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
      searchTerm: q,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .populate("seller", "businessName")
      .sort({ "sales.count": -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getTopSellingProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getDiscountedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find({
      isActive: true,
      "pricingTiers.discount": { $gt: 0 },
    })
      .populate("category", "name slug")
      .populate("seller", "businessName")
      .sort({ "pricingTiers.discount": -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getDiscountedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.query;
    const limit = parseInt(req.query.limit) || 5;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      isActive: true,
      category: product.category,
    })
      .populate("category", "name slug")
      .populate("seller", "businessName")
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts,
    });
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId).populate({
      path: "reviews",
      options: { skip, limit, sort: { createdAt: -1 } },
      populate: { path: "user", select: "name email" },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product ID and rating are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId,
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review (you need a Review model)
    const Review = mongoose.model("Review");
    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    product.reviews.push(review._id);

    // Update rating distribution
    const oldDistribution = product.rating.distribution;
    oldDistribution[rating] = (oldDistribution[rating] || 0) + 1;

    // Calculate new average
    const totalRatings = product.reviews.length + 1;
    const sumRatings = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      rating,
    );
    product.rating.average = sumRatings / totalRatings;
    product.rating.count = totalRatings;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error in addProductReview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProductReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const userId = req.user.id;

    const Review = mongoose.model("Review");
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission",
      });
    }

    const oldRating = review.rating;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product && oldRating !== rating) {
      const oldDist = product.rating.distribution;
      oldDist[oldRating] = Math.max(0, (oldDist[oldRating] || 0) - 1);
      oldDist[rating] = (oldDist[rating] || 0) + 1;

      const totalRatings = product.reviews.length;
      const sumRatings = product.reviews.reduce(
        (sum, r) => sum + r.rating,
        rating - oldRating,
      );
      product.rating.average = sumRatings / totalRatings;
      await product.save();
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error in updateProductReview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const userId = req.user.id;

    const Review = mongoose.model("Review");
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission",
      });
    }

    const product = await Product.findById(review.product);
    if (product) {
      // Update rating distribution
      const oldDist = product.rating.distribution;
      oldDist[review.rating] = Math.max(0, (oldDist[review.rating] || 0) - 1);

      const totalRatings = product.reviews.length - 1;
      if (totalRatings > 0) {
        const sumRatings = product.reviews.reduce(
          (sum, r) => sum + r.rating,
          -review.rating,
        );
        product.rating.average = sumRatings / totalRatings;
      } else {
        product.rating.average = 0;
      }
      product.rating.count = totalRatings;

      product.reviews = product.reviews.filter(
        (r) => r.toString() !== reviewId,
      );
      await product.save();
    }

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProductReview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============ SELLER APIs ============

export const getAllProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status;

    const query = { seller: sellerId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProductsBySeller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductDetailsSellers = async (req, res) => {
  try {
    const { productId } = req.query;
    const sellerId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("reviews", "rating comment user createdAt");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in getProductDetailsSellers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { period = "30d" } = req.query;

    // Calculate date range
    let startDate = new Date();
    if (period === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const products = await Product.find({ seller: sellerId });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const featuredProducts = products.filter((p) => p.isFeatured).length;
    const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
    const totalValue = products.reduce((sum, p) => {
      const minPrice = Math.min(...p.pricingTiers.map((t) => t.pricePerPiece));
      return sum + minPrice * p.totalStock;
    }, 0);

    // Get sales data (if you have an Order model)
    const Order = mongoose.model("Order");
    const salesData = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerId,
          createdAt: { $gte: startDate },
          status: "completed",
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.seller": sellerId,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$items.totalPrice" },
          totalOrders: { $addToSet: "$_id" },
          totalItems: { $sum: "$items.quantity" },
        },
      },
    ]);

    const sales = salesData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      totalItems: 0,
    };

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.seller": sellerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        activeProducts,
        featuredProducts,
        totalStock,
        totalValue,
        sales: {
          totalRevenue: sales.totalRevenue,
          totalOrders: sales.totalOrders.length,
          totalItems: sales.totalItems,
          period,
        },
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error in getProductAnalytics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const {
      name,
      shortDescription,
      longDescription,
      slug,
      minimumOrderQuantity,
      totalStock,
      category,
      subCategory,
      isFeatured,
      isActive,
      bulkOrderEligible,
      gstIncluded,
      gstRate,
      pricingTiers,
      specifications,
      highlights,
      warrantyInfo,
      shippingDetails,
    } = req.body;

    // Validate required fields
    if (!name || !shortDescription || !longDescription || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, shortDescription, longDescription, category",
      });
    }

    // Parse JSON strings if needed
    let parsedPricingTiers = pricingTiers;
    let parsedSpecifications = specifications;
    let parsedHighlights = highlights;
    let parsedWarrantyInfo = warrantyInfo;
    let parsedShippingDetails = shippingDetails;

    try {
      if (typeof pricingTiers === "string") {
        parsedPricingTiers = JSON.parse(pricingTiers);
      }
      if (typeof specifications === "string") {
        parsedSpecifications = JSON.parse(specifications);
      }
      if (typeof highlights === "string") {
        parsedHighlights = JSON.parse(highlights);
      }
      if (typeof warrantyInfo === "string") {
        parsedWarrantyInfo = JSON.parse(warrantyInfo);
      }
      if (typeof shippingDetails === "string") {
        parsedShippingDetails = JSON.parse(shippingDetails);
      }
    } catch (e) {
      console.error("Error parsing JSON fields:", e);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in one of the fields",
        error: e.message,
      });
    }

    // Validate pricing tiers
    if (
      !parsedPricingTiers ||
      !Array.isArray(parsedPricingTiers) ||
      parsedPricingTiers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one pricing tier is required",
      });
    }

    // Handle image uploads
    const imageFiles = req.files;
    const images = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        try {
          const cloudinaryResponse = await uploadOnCloudinary(file.path);
          images.push({ url: cloudinaryResponse.secure_url });
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Clean up temp file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug || finalSlug === "") {
      finalSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Add timestamp to ensure uniqueness
    finalSlug = `${finalSlug}-${Date.now()}`;

    // Create product
    const productData = {
      name,
      shortDescription,
      longDescription,
      slug: finalSlug,
      minimumOrderQuantity: parseInt(minimumOrderQuantity) || 1,
      totalStock: parseInt(totalStock) || 0,
      category,
      seller: sellerId,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isActive: isActive === "true" || isActive === true,
      bulkOrderEligible:
        bulkOrderEligible === "true" || bulkOrderEligible === true,
      gstIncluded: gstIncluded === "true" || gstIncluded === true,
      gstRate: parseFloat(gstRate) || 18,
      pricingTiers: parsedPricingTiers,
      specifications: parsedSpecifications || [],
      highlights: parsedHighlights || [],
      warrantyInfo: parsedWarrantyInfo || {
        duration: "",
        type: "none",
        details: "",
        terms: "",
      },
      shippingDetails: parsedShippingDetails || {
        shippingMethods: [
          {
            methodName: "standard",
            cost: 0,
            estimatedDays: { min: 3, max: 7 },
            isActive: true,
          },
        ],
        returnPolicy: {
          eligible: true,
          period: 7,
          conditions: "",
          shippingPaidBy: "seller",
        },
      },
      images,
      rating: {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    };

    // Add subCategory only if provided
    if (subCategory && subCategory !== "") {
      productData.subCategory = subCategory;
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);

    // Clean up uploaded files
    if (req.files) {
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error("Error deleting temp file:", unlinkError);
          }
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;
    const updates = req.body;
    const imageFiles = req.files;

    // Find product and check ownership
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission",
      });
    }

    // Parse JSON fields
    const fieldsToParse = [
      "pricingTiers",
      "specifications",
      "highlights",
      "warrantyInfo",
      "shippingDetails",
    ];
    fieldsToParse.forEach((field) => {
      if (updates[field] && typeof updates[field] === "string") {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle image updates
    if (imageFiles && imageFiles.length > 0) {
      const newImages = [];
      for (const file of imageFiles) {
        try {
          const cloudinaryResponse = await uploadOnCloudinary(file.path);
          newImages.push({ url: cloudinaryResponse.secure_url });
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
        }
      }

      // Keep existing images if not replaced
      const existingImages =
        updates.keepImages === "true" ? product.images : [];
      updates.images = [...existingImages, ...newImages];

      // Delete old images from Cloudinary if replacing
      if (updates.keepImages !== "true" && product.images.length > 0) {
        for (const img of product.images) {
          const publicId = img.url.split("/").pop().split(".")[0];
          await deleteFromCloudinary(publicId);
        }
      }
    }

    // Update slug if name changed
    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check for duplicate slug
      const existingProduct = await Product.findOne({
        slug: updates.slug,
        _id: { $ne: productId },
      });
      if (existingProduct) {
        updates.slug = `${updates.slug}-${Date.now()}`;
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...updates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in editProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission",
      });
    }

    // Check if product has any orders (if you have Order model)
    const Order = mongoose.model("Order");
    const hasOrders = await Order.exists({ "items.product": productId });
    if (hasOrders) {
      // Instead of deleting, mark as inactive
      product.isActive = false;
      await product.save();
      return res.status(200).json({
        success: true,
        message:
          "Product has existing orders. It has been deactivated instead of deleted.",
        product,
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        const publicId = img.url.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const changeProductStatusBySeller = async (req, res) => {
  try {
    const { productId, status } = req.body;
    const sellerId = req.user.id; // FIXED: Changed from adminId to sellerId

    if (!productId || !status) {
      return res.status(400).json({
        success: false,
        message: "Product ID and status are required",
      });
    }

    // Find product and ensure it belongs to this seller
    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission",
      });
    }

    // Sellers can only activate or deactivate products
    // They cannot flag or hide products
    if (status === "active") {
      product.isActive = true;
    } else if (status === "inactive") {
      product.isActive = false;
    } else {
      return res.status(403).json({
        success: false,
        message:
          "Sellers can only activate or deactivate products. Use 'active' or 'inactive' status only.",
      });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${status === "active" ? "activated" : "deactivated"} successfully`,
      product,
    });
  } catch (error) {
    console.error("Error in changeProductStatusBySeller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============ ADMIN APIs ============

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const query = {};

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === "true";
    }

    // Filter by featured
    if (req.query.isFeatured === "true") {
      query.isFeatured = true;
    }

    const products = await Product.find(query)
      .populate("category", "name slug image")
      .populate("subCategory", "name slug")
      .populate("seller", "businessName storeName email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getFlaggedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { flagStatus: { $ne: "none" } };

    const products = await Product.find(query)
      .populate("seller", "businessName storeName email")
      .populate("flaggedBy", "name email")
      .sort({ flaggedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error in getFlaggedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const changeProductStatus = async (req, res) => {
  try {
    const { productId, status, reason } = req.body;
    const adminId = req.user.id;

    if (!productId || !status) {
      return res.status(400).json({
        success: false,
        message: "Product ID and status are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product status
    if (status === "active") {
      product.isActive = true;
      product.flagStatus = "none";
      product.flagReason = null;
      product.flaggedBy = null;
      product.flaggedAt = null;
    } else if (status === "inactive") {
      product.isActive = false;
    } else if (status === "flagged") {
      product.flagStatus = "flagged";
      product.flagReason = reason;
      product.flaggedBy = adminId;
      product.flaggedAt = new Date();
      product.isActive = false;
    } else if (status === "hidden") {
      product.flagStatus = "hidden";
      product.flagReason = reason;
      product.flaggedBy = adminId;
      product.flaggedAt = new Date();
      product.isActive = false;
    }

    product.adminAction = {
      takenBy: adminId,
      action: status,
      reason: reason || "",
      takenAt: new Date(),
    };

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product status changed to ${status} successfully`,
      product,
    });
  } catch (error) {
    console.error("Error in changeProductStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
