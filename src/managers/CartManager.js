import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        
        const newCart = { id: newId, products: [] };
        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === parseInt(id));
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId));

        if (cartIndex === -1) return null;

        const productInCart = carts[cartIndex].products.find(p => p.product === parseInt(productId));

        if (productInCart) {
            productInCart.quantity++;
        } else {
            carts[cartIndex].products.push({ product: parseInt(productId), quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return carts[cartIndex];
    }
}