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
        dishes: newOrder.dishes,
        branch: newOrder.branch,
        closed: newOrder.closed
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
    order.branch = newOrder.branch;
    order.closed = newOrder.closed;

    if (newOrder.customerId) {
        order.customerId = newOrder.customerId;
    }

    await order.save()
    return order;
}

const groupByMeals = async (order) => {
    const meals = await Order.aggregate([
        { $match: { _id: order._id } },
        { $unwind: '$meals' },
        {
            $group: {
                _id: '$meals',
                count: { $sum: 1 }
            }
        }
    ]);

    return meals;
}

const groupByDishes = async (order) => {
    const dishes = await Order.aggregate([
        { $match: { _id: order._id } },
        { $unwind: '$dishes' },
        {
            $group: {
                _id: '$dishes',
                count: { $sum: 1 }
            }
        }
    ]);

    return dishes;
}

const groupByBranches = async () => {
    const branches = await Order.aggregate([
        {
            $group: {
                _id: {
                    branch: '$branch',
                    closed: '$closed'
                },
                count: { $sum: 1 }
            }
        }
    ]);

    return branches;
}

const searchClosedOrders = async (closed) => {
    return Order.find({closed});
}

const filterOrders = async (NumOfProducts, branch, price, userId, orders) => {
    const parsedPrice = parseInt(price);
    const paresNumOfProducts = parseInt(NumOfProducts);

    if(NumOfProducts && !branch && !price) {
        return await orders.filter((order) => {
            return (order.dishes.length + order.meals.length) >= paresNumOfProducts && userId == order.customerId && order.closed;
        });
    }

    else if (branch && !NumOfProducts && !price) {
        return await orders.filter((order) => {
            return order.branch == branch && userId == order.customerId && order.closed;
        });
    }

    else if (price && !NumOfProducts && !branch) {
        return await orders.filter((order) => {
            return order.totalprice >= parsedPrice && userId == order.customerId && order.closed;
        });
    }

    else if (NumOfProducts && branch && !price) {
        return await orders.filter((order) => {
            return (order.dishes.length + order.meals.length) >= paresNumOfProducts && order.branch == branch && userId == order.customerId && order.closed;
        });
    }

    else if (NumOfProducts && price && !branch) {
        return await orders.filter((order) => {
            return (order.dishes.length + order.meals.length) >= paresNumOfProducts && order.totalprice >= parsedPrice && userId == order.customerId && order.closed;
        });
    }

    else if (price && branch && !NumOfProducts) {
        return await orders.filter((order) => {
            return order.totalprice >= parsedPrice && order.branch == branch && userId == order.customerId && order.closed;
        });
    }

    else if (price && NumOfProducts && branch) {
        return await orders.filter((order) => {
            return (order.dishes.length + order.meals.length) >= paresNumOfProducts && order.totalprice >= parsedPrice && order.branch == branch && userId == order.customerId && order.closed;
        });
    }
}

module.exports = {
    getAll,
    create: createOrder,
    delete: deleteOrder,
    update: updateOrder,
    search: searchOrder,
    groupByMeals,
    groupByDishes,
    groupByBranches,
    searchClosedOrders,
    filterOrders
}