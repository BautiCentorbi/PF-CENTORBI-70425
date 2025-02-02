import { productModel } from "./models/ProductsModel.js";

export class productManager {
  static #path = "";

  static setPath(filePath = "") {
    this.#path = filePath;
  }

  static async getProducts() {
    try {
      return await productModel.find().lean();
    } catch (error) {
      console.log(error)
      throw new Error("Error getting products");
    }
  }

  static async getProductsById(id) {
    try {
      const productById = await productModel.findById(id).lean();
      console.log(productById)
      return productById;
    } catch (error) {
      console.log(error)
      throw new Error("Error getting product by id");
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
        const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedData, { new: true });
        return updatedProduct;
    } catch (error) {
        console.log(error)
        throw new Error("Error updating product");
    }
}


  static async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((prod) => prod.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(products, null, 2)
      );
      return true;
    }
    return false;
  }
}
