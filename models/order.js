const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true
    },

    orderDate: {
        type: Date, 
        default: Date.now,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    totalprice: {
        type: Number,
        required: true
    },

    meals: {
        type: Array,
        required: true
    },

    dishes: {
        type: Array,
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    closed: {
        type: Boolean,
        required: true
    },

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;