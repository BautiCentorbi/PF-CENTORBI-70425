import { Router } from 'express';
import { cartManager } from '../dao/CartManager.js';
import { errorHandler } from '../utils.js';

export const router=Router()

cartManager.setPath('./src/data/carts.json')

router.get('/', async(req,res)=>{
    try {
        let cart = await cartManager.getCart()
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({cart})
    } catch (error) {
        errorHandler(res, error)
    }
})

router.get('/:cid', async(req,res)=>{
    let {cid} = req.params
    try {
        let cartById = await cartManager.getCartById(cid)
        if (!cartById) {
            res.setHeader('Content-Type','application/json')
            return res.status(404).json({error:'Carrito no encontrado'})
        }
        
        let total = cartById.products.reduce((acc,prod)=> acc + prod.product.price * prod.quantity,0)
        
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({cartById, total})
    } catch (error) {
        errorHandler(res, error)
    }
})

router.get('/:cid/products', async (req, res) => {
    const { id } = req.params;
    try {
        let cartById = await cartManager.getCartById(id)
        if (!cartById) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let subtotal = 'cart.products.price + carts.quantity'
        let total = cartById.products.reduce((acc,prod)=> acc + prod.product.price * prod.quantity,0)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ products: cartById.products, total});
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ message: 'Cart created' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.deleteCart(cid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Cart deleted' });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.deleteProductFromCart(cid, pid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: 'Product deleted from cart' });
    } catch (error) {
        errorHandler(res, error);
    }
});

