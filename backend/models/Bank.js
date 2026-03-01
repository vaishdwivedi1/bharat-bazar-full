import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    cardHolderName: String,
    last4Digits: String,
    expiryMonth: String,
    expiryYear: String,
    brand: String,
  },
  { _id: false },
);

const upiSchema = new mongoose.Schema(
  {
    upiId: String,
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);

const bankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountHolderName: { type: String, required: true },
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },

    bankAddress: {
      state: String,
      city: String,
      pincode: String,
    },

    card: cardSchema,
    upi: upiSchema,

    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }, // timestamps add kiye
);

export const Bank = mongoose.model("Bank", bankSchema);
