import { cartModel } from "./models/CartModel.js"
import { productModel } from "./models/ProductsModel.js";
import mongoose from "mongoose";

export class cartManager {
    static #path = ''

    static setPath(filePath = '') {
        this.#path = filePath
    }

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
            let carts = await this.getCart();
            let id = carts.length ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
            let newCart = { id: id, products: [] };
            carts.push(newCart);
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error creating cart');
        }
    }

    static async addProductToCart(cartid, productid) {
        try {
            let carts = await this.getCart();
            let cart = carts.find(cart => cart.id === parseInt(cartid));
            if (!cart) {
                throw new Error('Cart not found');
            }

            let product = cart.products.find(prod => prod.product === productid);
            if (product) {
                product.quantity++;
            } else {
                cart.products.push({ product: productid, quantity: 1 });
            }

            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error adding product to cart');
        }
    }

    static async deleteCart(id) {
        let carts = await this.getCart();
        let index = carts.findIndex(cart => cart.id === parseInt(id));
        if (index !== -1) {
            carts.splice(index, 1);
            await fs.promises.writeFile(this.#path, JSON.stringify(carts.length ? carts : [], null, 2));
            return true;
        }
        return false;
    }

    static async getTotalPrice(cartid) {
        try {
            let carts = await this.getCart();
            let cart = carts.find(cart => cart.id === parseInt(cartid));
            if (!cart) {
                throw new Error('Cart not found');
            }
            let total = cart.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);
            return total;
        } catch (error) {
            throw new Error('Error getting total price');
        }
    }   

    static async deleteProductFromCart(cartid, productid) {
        try {
            let carts = await this.getCart();
            let cart = carts.find(cart => cart.id === parseInt(cartid));
            if (!cart) {
                throw new Error('Cart not found');
            }
            let index = cart.products.findIndex(prod => prod.product === productid);
            if (index !== -1) {
                cart.products.splice(index, 1);
                await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error deleting product from cart');
        }
    }
}

