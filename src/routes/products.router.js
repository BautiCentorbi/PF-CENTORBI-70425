import { Router } from "express";
import { productManager } from "../dao/ProductManager.js";
import { errorHandler, generateId } from "../utils.js";

export const router = Router();

productManager.setPath("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ products });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    let productById = await productManager.getProductsById(pid);
    if (!productById) {
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: productById });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.post("/", async (req, res) => {
  let product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category ||
    !product.thumbnail
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  let uniqueID = generateId();
  product.id = uniqueID;
  product.status = true;
  try {
    await productManager.addProduct(product);
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({ payload: { product } });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    const existingProduct = await productManager.getProductsById(id);
    if (!existingProduct) {
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const updatedProduct = { ...existingProduct, ...updatedFields, id };
    await productManager.updateProduct(id, updatedProduct);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: `Producto: ${id} actualizado` });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productManager.deleteProduct(id);
    if (!result) {
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: `Producto: ${id} eliminado` });
  } catch (error) {
    errorHandler(res, error);
  }
});
