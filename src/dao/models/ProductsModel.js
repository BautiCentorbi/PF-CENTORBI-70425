import mongoose from "mongoose";

const collection = "products";

const productSchema = new mongoose.Schema({
    title: { type: String,},
    description: { type: String,},
    code: { type: String, unique: true,},
    thumbnail: { type: String,},
    price: { type: Number,},
    stock: { type: Number,},
    category: { type: String,},
    status: { type: Boolean,},
},
{
    timestamps: true
});

export const productModel = mongoose.model(collection, productSchema);