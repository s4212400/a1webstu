const Order = require('../models/order');

const createOrder = async (userId, orderData) => {
    try {
        const order = new Order({
            orderNumber: orderData.orderNumber,

            userId: userId,

            orderDate: new Date(),

            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,

            address: orderData.address,
            city: orderData.city,
            postcode: orderData.postcode,
            country: orderData.country,

            delivery: orderData.delivery,
            deliveryDate: orderData.deliveryDate,

            paymentMethod: orderData.paymentMethod,

            items: orderData.items,

            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            total: orderData.total,

            status: 'confirmed'
        });

        return await order.save();

    } catch (error) {
        console.error(
            'Error creating order:',
            error.message
        );

        throw error;
    }
};

const getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('items.productId');
};

const getUserOrders = async (userId) => {
    return await Order.find({ userId })
        .sort({ orderDate: -1 })
        .populate('items.productId');
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders
};