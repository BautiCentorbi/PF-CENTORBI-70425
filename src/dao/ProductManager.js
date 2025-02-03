import { productModel } from "./models/ProductsModel.js";

export class productManager {
  static async getProducts({ query = {}, options = {} }) {
    try {
      options.lean = true;
      return await productModel.paginate(query, options);
    } catch (error) {
      console.log(error);
      throw new Error("Error getting products");
    }
  }
  static async getProductsById(id) {
    try {
      const productById = await productModel.findById(id).lean();
      console.log(productById);
      return productById;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting product by id");
    }
  }

  static async getUniqueCategories() {
    try {
      const uniqueCategories = await productModel.distinct("category").lean();
      return uniqueCategories;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting unique categories");
    }
  }

  static async addProduct(product) {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      throw new Error("Error adding product");
    }
  }
  static async updateProduct(productId, updatedData) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating product");
    }
  }

  static async deleteProduct(id) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting product");
    }
  }
}
