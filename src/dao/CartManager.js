import { cartModel } from "./models/CartModel.js"
import { productModel } from "./models/ProductsModel.js";
import mongoose from "mongoose";

export class cartManager {

    static async getCart() {
        try {
            const carts = await cartModel.find().lean();
            return carts
        } catch (error) {   
            console.log(error)
            throw new Error('Error getting cart');
        }
    }

    static async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product').lean();
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart
        } catch (error) {
            console.log(error)
            throw new Error('Error getting the requested cart');
        }
    }

    static async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            await newCart.save();
        } catch (error) {
            console.log(error)
            throw new Error('Error creating cart');
        }
    }

    static async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Cart not found');
            }
            const product = cart.products.find(prod => prod.product.equals(productId));
    
            if (product) {
                product.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await cart.save();
        } catch (error) {
            console.log(error);
            throw new Error('Error adding product to cart');
        }
    }

    static async deleteCart(id) {
        try {
            await cartModel.findByIdAndDelete(id);
            return true 
        } catch (error) {
            console.log(error)
            throw new Error('Error deleting cart');
        }
    }

    static async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Cart not found');
            }
            const index = cart.products.findIndex(prod => prod.product.equals(productId));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error deleting product from cart');
        }
    }
    
}

