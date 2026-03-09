import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  slug: String,
  image: String,
  isFeatured: Boolean,
  isActive: Boolean,
});

export const Product = mongoose.model("Product", productSchema);
