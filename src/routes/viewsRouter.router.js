import { Router } from "express";
import { productManager } from "../dao/ProductManager.js";
import { cartManager } from "../dao/CartManager.js";
export const router = Router();

// Products

router.get("/products", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    if (products.length > 1) {
      console.log(products[1]);
      console.log(Object.keys(products[1]));
    }
    res.render("home", { products });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.render("error", { error: "Producto no encontrado" });
  }
});

router.get("/edit/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    let productById = await productManager.getProductsById(pid);
    if (!productById) {
      res.render("error", { error: "Producto no encontrado" });
    }
    res.render("editProduct", { productById });
  } catch (error) {
    console.log(error);
    res.render("error", { error: "Error obteniendo el producto" });
  }
});

router.post("/products/:pid", async (req, res) => {
  let { pid } = req.params;

  if (req.body._method === "PUT") {
    try {
      const updatedProduct = await productManager.updateProduct(pid, req.body);
      res.redirect("/products/" + pid);
    } catch (error) {
      res.status(500).send("Error actualizando producto: " + error.message);
    }
  } else {
    res.status(400).send("Método no soportado");
  }
});

router.get("/create", (req, res) => {
  res.render("createProduct");
});

router.post("/products", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating product: " + error.message);
  }
});

// Carts

router.get("/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCart();
    if (!carts) {
      return res.render("error", {
        error: "No has añadido nada al carrito aún",
      });
    }
    res.render("carts", { carts });
  } catch (error) {
    console.log(error);
    throw new Error("Error getting cart");
  }
});

router.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  try {
    let cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.render("error", { error: "Carrito no encontrado" });
    }
    let total = cart.products.reduce(
      (acc, prod) => acc + prod.product.price * prod.quantity,
      0
    );
    console.log(total);

    return res.render("cart", { cart, total });
  } catch (error) {
    res.render("error", { error: "Carrito no encontrado" });
  }
});

router.delete("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  try {
    await cartManager.deleteCart(cid);
    res.render("cart", { message: "Cart deleted" });
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting cart");
  }
});

router.delete("/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  try {
    await cartManager.deleteProductFromCart(cid, pid);
    res.render("cart", { message: "Product deleted from cart" });
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting product from cart");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});
