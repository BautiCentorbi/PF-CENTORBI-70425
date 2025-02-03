import { Router } from "express";
import { cartManager } from "../dao/CartManager.js";
import { productManager } from "../dao/ProductManager.js";
export const router = Router();

router.get("/products", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    category,
    availability,
  } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { price: sort === "asc" ? 1 : -1 },
    };

    const query = {};
    if (category && category !== "all") {
      query.category = category;
    }

    if (availability && availability !== "all") {
      query.status = availability === "available";
    }

    const products = await productManager.getProducts({ query, options });

    const uniqueCategories = await productManager.getUniqueCategories();

    const pagination = {
      prevPage: products.page > 1 ? products.page - 1 : null,
      nextPage: products.page < products.totalPages ? products.page + 1 : null,
      hasPrevPage: products.page > 1,
      hasNextPage: products.page < products.totalPages,
      totalPages: products.totalPages,
      prevLink:
        products.page > 1
          ? `/products?page=${
              products.page - 1
            }&limit=${limit}&sort=${sort}&category=${category}`
          : null,
      nextLink:
        products.page < products.totalPages
          ? `/products?page=${
              products.page + 1
            }&limit=${limit}&sort=${sort}&category=${category}`
          : null,
    };

    res.render("home", {
      products: products.docs,
      page: products.page,
      limit: products.limit,
      sort,
      category,
      availability,
      uniqueCategories,
      ...pagination,
    });
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
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating product: " + error.message);
  }
});

router.post("/cart/add/:pid", async (req, res) => {
  const { pid } = req.params;
  const cartId = "679b9342359b65b2722c6867";
  try {
    await cartManager.addProductToCart(cartId, pid);
    res.redirect("/products/" + pid);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Error añadiendo producto al carrito: " + error.message);
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


router.post("/cart/delete/:cid/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  try {
    await cartManager.deleteProductFromCart(cid, pid);
    res.redirect("/carts/" + cid);
  } catch (error) {
    res
      .status(500)
      .send("Error eliminando producto del carrito: " + error.message);
  }
});

router.post("/carts/:cid/empty", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.clearCart(cid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send("Error vaciando el carrito: " + error.message);
  }
});