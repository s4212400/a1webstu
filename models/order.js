const mongoose = require('mongoose');

// Order item schema
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    productNumber: {
        type: Number,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

// Order schema
const orderSchema = new mongoose.Schema({

    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    },

    // Customer information
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    // Delivery address
    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    postcode: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    // Delivery
    delivery: {
        type: String,
        required: true,
        enum: ['standard', 'express', 'pickup']
    },

    deliveryDate: {
        type: String,
        required: true
    },

    // Payment
    paymentMethod: {
        type: String,
        required: true
    },

    // Products purchased
    items: {
        type: [orderItemSchema],
        required: true,
        default: []
    },

    // Order totals
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    shipping: {
        type: Number,
        required: true,
        min: 0
    },

    tax: {
        type: Number,
        required: true,
        min: 0
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    // Order status
    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default: 'confirmed'
    }

}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;