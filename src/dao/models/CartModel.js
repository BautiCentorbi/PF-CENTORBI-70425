import mongoose from "mongoose";

const collection = "carts";

const cartSchema = new mongoose.Schema({
    products: { type: Array, default: [] },
},
{
    timestamps: true
});

export const cartModel = mongoose.model(collection, cartSchema);