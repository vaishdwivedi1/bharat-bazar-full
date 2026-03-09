import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: String,
  description: String,
  slug: String,
  image: String,
  isFeatured: Boolean,
  isActive: Boolean,
});

export const Category = mongoose.model("Category", categorySchema);
