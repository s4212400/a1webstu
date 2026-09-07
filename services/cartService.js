const Cart = require('../models/cart');
const Product = require('../models/product');

// Get the cart belonging to a user
async function getCart(userId) {
    let cart = await Cart.findOne({ userId })
        .populate('items.productId');

    if (!cart) {
        cart = await Cart.create({
            userId,
            items: []
        });
    }

    return cart;
}

// Add a product to the user's cart
async function addToCart(userId, productId, quantity = 1) {
    const product = await Product.findOne({ productId });

    if (!product) {
        throw new Error('Product does not exist.');
    }

    if (product.stock <= 0) {
        throw new Error('Product is out of stock.');
    }

    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({
            userId,
            items: []
        });
    }

    const existingItem = cart.items.find(
        item => item.productId.toString() === product._id.toString()
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity
        });
    }

    await cart.save();

    return await Cart.findOne({ userId })
        .populate('items.productId');
}

// Remove a product from the user's cart
async function removeFromCart(userId, productId) {
    const product = await Product.findOne({ productId });

    if (!product) {
        throw new Error('Product does not exist.');
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return null;
    }

    cart.items = cart.items.filter(
        item => item.productId.toString() !== product._id.toString()
    );

    await cart.save();

    return await Cart.findOne({ userId })
        .populate('items.productId');
}

// Clear the user's cart
async function clearCart(userId) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return null;
    }

    cart.items = [];

    await cart.save();

    return cart;
}

// Calculate cart totals
function calculateTotals(cart) {
    const subtotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    calculateTotals
};