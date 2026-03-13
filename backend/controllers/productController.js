import { Product } from "../models/Products.js";

export const getAllProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getAllActiveProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getAllFeaturedProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getProductDetailsUsers = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getTopSellingProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getDiscountedProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getRelatedProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getProductReviews = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const addProductReview = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const updateProductReview = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const deleteProductReview = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getAllProductsBySeller = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getProductDetailsSellers = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductAnalytics = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const createProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const bulkCreateProducts = async (req, res) => {
  try {
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required",
      });
    }

    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const productData = products[i];

        // REQUIRED: Validate all required fields
        const requiredFields = [
          "name",
          "shortDescription",
          "longDescription",
          "pricingTiers",
          "minimumOrderQuantity",
          "totalStock",
          "category",
          "seller",
          "images",
        ];

        const missingFields = requiredFields.filter(
          (field) => !productData[field],
        );

        if (missingFields.length > 0) {
          errors.push({
            product: productData.name || `Product ${i}`,
            error: `Missing required fields: ${missingFields.join(", ")}`,
          });
          continue;
        }

        // Validate pricing tiers
        if (
          !Array.isArray(productData.pricingTiers) ||
          productData.pricingTiers.length === 0
        ) {
          errors.push({
            product: productData.name,
            error: "At least one pricing tier is required",
          });
          continue;
        }

        for (const tier of productData.pricingTiers) {
          if (!tier.minQuantity || !tier.maxQuantity || !tier.pricePerPiece) {
            errors.push({
              product: productData.name,
              error:
                "Each pricing tier must have minQuantity, maxQuantity, and pricePerPiece",
            });
            continue;
          }
        }

        // Validate images
        if (
          !Array.isArray(productData.images) ||
          productData.images.length === 0
        ) {
          errors.push({
            product: productData.name,
            error: "At least one image is required",
          });
          continue;
        }

        for (const image of productData.images) {
          if (!image.url) {
            errors.push({
              product: productData.name,
              error: "Each image must have a url",
            });
            continue;
          }
        }

        // Generate slug if not provided
        if (!productData.slug) {
          productData.slug =
            productData.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") +
            "-" +
            Date.now() +
            "-" +
            i;
        }

        // Check for duplicate slug
        const existingProduct = await Product.findOne({
          slug: productData.slug,
        });
        if (existingProduct) {
          productData.slug = productData.slug + "-" + Date.now();
        }

        // Set default values
        productData.isActive =
          productData.isActive !== undefined ? productData.isActive : true;
        productData.isFeatured = productData.isFeatured || false;
        productData.bulkOrderEligible =
          productData.bulkOrderEligible !== undefined
            ? productData.bulkOrderEligible
            : true;
        productData.gstIncluded =
          productData.gstIncluded !== undefined
            ? productData.gstIncluded
            : true;

        // Initialize rating if not provided
        if (!productData.rating) {
          productData.rating = {
            average: 0,
            count: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
        }

        const product = await Product.create(productData);
        createdProducts.push(product);
      } catch (error) {
        errors.push({
          product: products[i].name || `Product ${i}`,
          error: error.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Created ${createdProducts.length} products successfully`,
      created: createdProducts.length,
      failed: errors.length,
      products: createdProducts,
      errors: errors,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const editProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getFlaggedProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const changeProductStatus = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
