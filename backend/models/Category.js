import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
    },

    // Figma wali fields - bas itna hi chahiye tha
    productsCount: {
      type: String,
      default: "0",
    },
    icon: {
      type: String,
      default: "📦",
    },
    subcategories: [
      {
        type: String,
        trim: true,
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

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      enum: ["platform", "seller"],
      default: "platform",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: function () {
        return this.type === "seller";
      },
    },
  },
  {
    timestamps: true,
  },
);

// Sirf 1 index - sabse zyada use hone wala
categorySchema.index({ parentCategory: 1, isActive: 1 });

export const Category = mongoose.model("Category", categorySchema);
