import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    minStock: { type: Number, min: 0, default: 0 },
    sold: { type: Number, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    tags: {
      type: [String],
      default: [],
    },
    supplier: {
      name: { type: String, trim: true },
      contactEmail: { type: String, trim: true },
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      UOM: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.model.Product || mongoose.model("Product", ProductSchema);

export default Product;
