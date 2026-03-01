import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["home", "office", "warehouse", "billing", "shipping"],
      default: "office",
    },
    line1: { type: String, required: true },
    line2: { type: String },
    state: { type: String, required: true },
    city: { type: String, required: true },
    addressPincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }, // timestamps add kiye
);

export const Address = mongoose.model("Address", addressSchema);
