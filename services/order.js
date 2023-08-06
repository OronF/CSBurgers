const Order = require('../models/order');

const getAll = async() => {
    return await Order.find({});
}

const createOrder = async (newOrder) => {
    const order = new Order({
        orderNumber: newOrder.orderNumber,
        orderDate: newOrder.orderDate,
        location: newOrder.location,
        totalprice: newOrder.totalprice,
        meals: newOrder.meals,
        dishes: newOrder.dishes
    });

    if (newOrder.customerId) {
        order.customerId = newOrder.customerId;
    }

    return await order.save();
}

const searchOrder = async(id) => {
    return await Order.findById(id);
}

const deleteOrder = async (id) => {
    const order = await searchOrder(id);

    if (!order) {
        return null;
    }

    await order.deleteOne();

    return order;
}

const updateOrder = async (newOrder) => {
    const order = await searchOrder(newOrder.id);

    if (!order) {
        return null;
    }

    order.orderNumber = newOrder.orderNumber;
    order.orderDate = newOrder.orderDate;
    order.location = newOrder.location;
    order.totalprice = newOrder.totalprice;
    order.meals = newOrder.meals;
    order.dishes = newOrder.dishes;

    if (newOrder.customerId) {
        order.customerId = newOrder.customerId;
    }

    await order.save()
    return order;
}

module.exports = {
    getAll,
    create: createOrder,
    delete: deleteOrder,
    update: updateOrder,
    search: searchOrder
}