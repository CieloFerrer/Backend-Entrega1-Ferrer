import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.send({ status: "success", payload: newCart });
});

router.get('/:cid', async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.send({ status: "success", payload: cart.products });
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await manager.addProductToCart(cartId, productId);
    
    if (!updatedCart) return res.status(404).send({ error: "No se pudo agregar el producto" });
    res.send({ status: "success", payload: updatedCart });
});

export default router;