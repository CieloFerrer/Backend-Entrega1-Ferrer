import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.send({ status: "success", payload: products });
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).send({ error: "Producto no encontrado" });
    res.send({ status: "success", payload: product });
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ error: "Faltan campos obligatorios" });
    }

    const newProduct = await manager.addProduct({ title, description, code, price, stock, category, thumbnails: thumbnails || [] });
    res.send({ status: "success", payload: newProduct });
});

router.put('/:pid', async (req, res) => {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).send({ error: "No se pudo actualizar" });
    res.send({ status: "success", payload: updated });
});

router.delete('/:pid', async (req, res) => {
    const result = await manager.deleteProduct(req.params.pid);
    if (!result) return res.status(404).send({ error: "No se pudo eliminar" });
    res.send({ status: "success", message: "Producto eliminado" });
});

export default router;