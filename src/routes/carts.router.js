import { Router } from 'express';
import { cartManager } from '../dao/CartManager.js';
import { errorHandler } from '../utils.js';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        let cart = await cartManager.getCart();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cart });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/:cid', async (req, res) => {
    let { cid } = req.params;
    try {
        let cartById = await cartManager.getCartById(cid);
        if (!cartById) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let total = cartById.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cartById, total });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/:cid/products', async (req, res) => {
    const { id } = req.params;
    try {
        let cartById = await cartManager.getCartById(id);
        if (!cartById) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let total = cartById.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ products: cartById.products, total });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ message: 'Carrito creado' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/:cid/products', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.clearCart(cid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.deleteProductFromCart(cid, pid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cid, products);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Carrito actualizado', payload: updatedCart });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/:cid/products/:pid/increase', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.increaseProductQuantity(cid, pid);
        res.redirect(`/carts/${cid}`);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/:cid/products/:pid/decrease', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.decreaseProductQuantity(cid, pid);
        res.redirect(`/carts/${cid}`);
    } catch (error) {
        errorHandler(res, error);
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Cantidad del producto actualizada', payload: updatedCart });
    } catch (error) {
        errorHandler(res, error);
    }
});
