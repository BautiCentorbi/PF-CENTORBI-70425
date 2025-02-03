import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    code: { type: String, unique: true },
    thumbnail: { type: String },
    price: { type: Number },
    stock: { type: Number },
    category: { type: String },
    status: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(collection, productSchema);
