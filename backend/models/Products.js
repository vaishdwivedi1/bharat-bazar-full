import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  unit: String, // e.g., "mm", "kg", "inches"
  group: {
    type: String,
    default: "General", // Allows grouping specifications (e.g., "Dimensions", "Material", "Technical")
  },
  isHighlighted: {
    type: Boolean,
    default: false, // To mark key specifications that should stand out
  },
  order: {
    type: Number,
    default: 0,
  },
});

const highlightSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  icon: String, // Optional icon identifier
  color: String, // Optional color coding
  order: {
    type: Number,
    default: 0,
  },
});

const shippingDetailSchema = new mongoose.Schema(
  {
    // Basic shipping options
    shippingMethods: [
      {
        methodName: {
          type: String,
          required: true,
          enum: [
            "standard",
            "express",
            "freight",
            "local_pickup",
            "seller_specific",
          ],
        },
        cost: {
          type: Number,
          required: true,
          min: 0,
        },
        estimatedDays: {
          min: Number,
          max: Number,
          description: String,
        },
        provider: String, // e.g., "Delhivery", "Blue Dart", "Seller's Own"
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Custom shipping rules
    customShippingRules: [
      {
        ruleName: String,
        condition: {
          type: {
            type: String,
            enum: ["distance", "quantity", "amount", "location", "custom"],
          },
          operator: String, // e.g., "<=", ">=", "=="
          value: mongoose.Schema.Types.Mixed,
          description: String,
        },
        action: {
          type: {
            type: String,
            enum: ["free_shipping", "discount", "extra_charge"],
          },
          value: Number, // Discount percentage or extra charge amount
        },
        message: String, // e.g., "Free shipping within 5km"
      },
    ],

    // Location-based shipping
    localDelivery: {
      available: {
        type: Boolean,
        default: false,
      },
      radius: Number, // in km
      freeWithinRadius: Number, // free shipping within this radius
      additionalChargePerKm: Number,
      contactForDelivery: Boolean,
    },

    // National/International shipping
    domesticShipping: {
      available: {
        type: Boolean,
        default: true,
      },
      zones: [
        {
          zoneName: String,
          states: [String],
          cities: [String],
          pincodes: [String],
          shippingCost: Number,
          estimatedDays: String,
        },
      ],
      freeShippingEligible: {
        minOrderValue: Number,
        applicableZones: [String],
      },
    },

    internationalShipping: {
      available: {
        type: Boolean,
        default: false,
      },
      countries: [
        {
          name: String,
          code: String,
          shippingCost: Number,
          customsDuties: {
            included: Boolean,
            details: String,
          },
          estimatedDays: String,
        },
      ],
    },

    // Bulk order shipping
    bulkShipping: {
      priorityShippingAvailable: {
        type: Boolean,
        default: false,
      },
      freightShipping: {
        available: Boolean,
        contactForQuote: Boolean,
        estimatedLeadTime: String,
      },
      volumeDiscounts: [
        {
          minQuantity: Number,
          maxQuantity: Number,
          shippingDiscountPercent: Number,
        },
      ],
    },

    // Seller's custom shipping notes
    shippingNotes: {
      type: String,
      maxLength: 1000,
    },

    // Return policy
    returnPolicy: {
      eligible: {
        type: Boolean,
        default: true,
      },
      period: Number, // in days
      conditions: String,
      shippingPaidBy: {
        type: String,
        enum: ["seller", "buyer", "mutual"],
        default: "seller",
      },
    },
  },
  { _id: false },
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxLength: 500,
    },
    longDescription: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    // Updated pricing to support multiple tiers
    pricingTiers: [
      {
        minQuantity: {
          type: Number,
          required: true,
          min: 0,
        },
        maxQuantity: {
          type: Number,
          required: true,
          min: 1,
        },
        pricePerPiece: {
          type: Number,
          required: true,
          min: 0,
        },
        discount: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],

    // Minimum order quantity
    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    totalStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // Flexible specifications - sellers can add any specs they want
    specifications: [specificationSchema],

    // Product highlights
    highlights: [highlightSchema],

    // Custom attributes for any additional data
    customAttributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      description: "Sellers can add any custom fields here",
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    warrantyInfo: {
      duration: String,
      type: {
        type: String,
        enum: ["manufacturer", "seller", "extended", "none"],
      },
      details: String,
      terms: String,
    },

    gstIncluded: {
      type: Boolean,
      default: true,
    },
    gstRate: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Seller Information
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerSku: String,
    sellerNotes: String,

    // Flexible shipping details
    shippingDetails: shippingDetailSchema,

    // Bulk order settings
    bulkOrderEligible: {
      type: Boolean,
      default: true,
    },

    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Admin oversight fields - For flagged products
    flagStatus: {
      type: String,
      enum: ["none", "flagged", "hidden"],
      default: "none",
    },
    flagReason: String,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    flaggedAt: Date,
    flagNotes: String,

    // Admin action fields
    adminAction: {
      takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      action: {
        type: String,
        enum: ["hidden", "flaged", "none"],
        default: "none",
      },
      reason: String,
      takenAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", productSchema);
