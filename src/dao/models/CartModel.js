import mongoose from 'mongoose';

const collection = 'carts';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
      quantity: Number,
    },
  ],
});

export const cartModel = mongoose.model(collection, cartSchema);
