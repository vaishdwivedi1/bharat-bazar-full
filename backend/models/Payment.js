import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["upi", "card", "bank"],
      required: true,
    },

    // For UPI
    upiId: {
      type: String,
      validate: {
        validator: function (v) {
          if (this.type !== "upi") return true;
          // Basic UPI ID validation (name@provider)
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(v);
        },
        message: "Invalid UPI ID format (e.g., name@okhdfcbank)",
      },
    },
    upiName: String,

    // For Cards
    cardNumber: {
      type: String,
      validate: {
        validator: function (v) {
          if (this.type !== "card") return true;
          // Store only last 4 digits
          return true;
        },
      },
    },
    cardLastFour: String,
    cardHolderName: String,
    cardExpiryMonth: String,
    cardExpiryYear: String,
    cardBrand: {
      type: String,
      enum: ["visa", "mastercard", "amex", "rupay", "other"],
    },

    // For Bank Account
    bankName: String,
    accountNumber: String,
    accountLastFour: String,
    ifscCode: String,
    accountHolderName: String,
    accountType: {
      type: String,
      enum: ["savings", "current"],
      default: "savings",
    },

    // Common fields
    isDefault: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Metadata
    provider: String, // e.g., "razorpay", "stripe", "paytm"
    providerPaymentMethodId: String, // ID from payment provider

    // Additional info
    nickname: String, // User-friendly name like "My HDFC Card"
    notes: String,
  },
  { timestamps: true },
);

// Index for faster lookups
paymentMethodSchema.index({ user: 1, isDefault: 1 });

export const PaymentMethod = mongoose.model(
  "PaymentMethod",
  paymentMethodSchema,
);
