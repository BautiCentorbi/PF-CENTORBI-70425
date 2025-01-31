import { Router } from "express";
import { productManager } from "../dao/ProductManager.js";
import { cartManager } from "../dao/CartManager.js";
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
router.post("/addproduct", async (req, res) => {
  try {
    const productData = req.body
    await productManager.addProduct(productData);
    res.render("addProduct", { message: "Product created" });
  } catch (error) {
    console.log(error)
    throw new Error("Error adding product");
  }
})

// Carts

router.get("/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCart();
    if (!carts) {
      return res.render("error", { error: "No has añadido nada al carrito aún" });
    }
    res.render("carts", { carts });
  } catch (error) {
    console.log(error)
    throw new Error("Error getting cart");
  }
});

router.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params
  try {
    let cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.render("error", { error: "Carrito no encontrado" });
    }
    let total = cart.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);
    console.log(total)

    return res.render("cart", { cart, total });
  } catch (error) {
    res.render("error", { error: "Carrito no encontrado" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
})
