import { Router } from "express";
import { productManager } from "../dao/ProductManager.js";
import { errorHandler } from "../utils.js";

export const router = Router();

router.get("/", async (req, res) => {
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

    const pagination = {
      prevPage: products.page > 1 ? products.page - 1 : null,
      nextPage: products.page < products.totalPages ? products.page + 1 : null,
      hasPrevPage: products.page > 1,
      hasNextPage: products.page < products.totalPages,
      totalPages: products.totalPages,
      prevLink:
        products.page > 1
          ? `/api/products?page=${
              products.page - 1
            }&limit=${limit}&sort=${sort}&category=${category}&availability=${availability}`
          : null,
      nextLink:
        products.page < products.totalPages
          ? `/api/products?page=${
              products.page + 1
            }&limit=${limit}&sort=${sort}&category=${category}&availability=${availability}`
          : null,
    };

    res.status(200).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: pagination.prevPage,
      nextPage: pagination.nextPage,
      page: products.page,
      hasPrevPage: pagination.hasPrevPage,
      hasNextPage: pagination.hasNextPage,
      prevLink: pagination.prevLink,
      nextLink: pagination.nextLink,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    let productById = await productManager.getProductsById(pid);
    if (!productById) {
      res.status(404).json("error", { error: "Producto no encontrado" });
    }
    return res.status(200).json("product", { productById });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.code ||
      !newProduct.price ||
      !newProduct.status ||
      !newProduct.stock ||
      !newProduct.category ||
      !newProduct.thumbnail
    ) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    return res.status(201).json("product", { newProduct });
  } catch (error) {
    errorHandler(res, error);
  }
});

router.put("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    let productById = await productManager.getProductsById(pid);
    if (!productById) {
      res.status(404).json("error", { error: "Producto no encontrado" });
    }
    res.render("editProduct", { productById });
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
