import { Router } from "express";
import { productManager } from "../dao/ProductManager.js";
import { cartManager } from "../dao/CartManager.js";
import { productModel } from "../dao/models/ProductsModel.js";
export const router = Router();

// Products

router.get("/products", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    if (products.length > 1) {
      console.log(products[1])
      console.log(Object.keys(products[1]))
    }
    res.render("home", { products });
  } catch (error) {
    console.log(error)
  }
});
router.get("/products/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    let productById = await productManager.getProductsById(pid);
    if (!productById) {
      res.render("error", { error: "Producto no encontrado" });
    }
    return res.render("product", { productById });
  } catch (error) {
    res.render("error", { error: "Producto no encontrado" });
  }
});

// Carts

router.get("/carts", async (req, res) => {
  const carts = await cartManager.getCart();
  res.render("carts", { carts });
});

router.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params
  try {
    let cartById = await cartManager.getCartById(cid);
    if (!cartById) {
      return res.render("error", { error: "Carrito no encontrado" });
    }
    return res.render("cart", { cartById });
  } catch (error) {
    res.render("error", { error: "Carrito no encontrado" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
})
