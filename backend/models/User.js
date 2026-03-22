import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "seller"],
    },

    // Seller Info
    gst: String,
    pan: String,
    addhaar: String,

    panDoc: String, // Store full URL or path
    addhaarDoc: String, // Store full URL or path

    // References
    banks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bank" }],
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    paymentMethods: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
