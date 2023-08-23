const OrderService = require('../services/order');

const getAllOrders = async (req, res) => {
    try {
        let orders = await OrderService.getAll();

        if (req.query.group) {
            let ordersGroup = await OrderService.groupByBranches();

            if (!ordersGroup) {
                return res.status(404).json({errors:["orders not found"]});
            }

            res.json(ordersGroup);
            return;
        } 
        
        if(!orders) {
            throw new Error('Non existing orders');
        }
        
        res.json(orders);
    }

    catch (error) {
        res.status(400).json({
            error: "Getting all the orders - Error",
            message: error.message
        });
    }
}

const creatOrder = async (req, res) => {
    try {
        const tmp = {
            orderNumber: req.body.orderNumber,
            orderDate: req.body.orderDate,
            location: req.body.location,
            totalprice: req.body.totalprice,
            meals: req.body.meals,
            dishes: req.body.dishes,
            branch: req.body.branch,
            closed: req.body.closed
        }
    
        if (req.body.customerId) {
            tmp.customerId = req.body.customerId;
        }
    
        const newOrder = await OrderService.create(tmp);
        res.json(newOrder);
    }

    catch (error) {
        res.status(400).json({
            error: "Creating new order - Error",
            message: error.message
        });
    }
}

const updateOrder = async (req, res) => {
    if (!req.body.orderNumber) {
        res.status(400).json({message:'The new orderNumber to the order is required'});
    }

    if (!req.body.orderDate) {
        res.status(400).json({message:'The new orderDate to the order is required'});
    }

    if (!req.body.location) {
        res.status(400).json({message:'The new location to the order is required'});
    }

    if (!req.body.totalprice) {
        res.status(400).json({message:'The new totalprice to the order is required'});
    }

    if (!req.body.dishes) {
        res.status(400).json({message:'The new dishes to the order is required'});
    }

    if (!req.body.meals) {
        res.status(400).json({message:'The new meals to the order is required'});
    }

    if (!req.body.branch) {
        res.status(400).json({message:'The new branch to the order is required'});
    }

    const newOrder = {
        id: req.params.id,
        orderNumber: req.body.orderNumber,
        orderDate: req.body.orderDate,
        location: req.body.location,
        totalprice: req.body.totalprice,
        meals: req.body.meals,
        dishes: req.body.dishes,
        branch: req.body.branch,
        closed: req.body.closed
    }

    if (req.body.customerId) {
        newOrder.customerId = req.body.customerId;
    }

    const order = await OrderService.update(newOrder);
    if (!order) {
        return res.status(404).json({errors:['Order not found']});
    }

    res.json(order);
};


const deleteOrder = async (req, res) => {
    const order = await OrderService.delete(req.params.id);

    if (!order) {
        return res.status(404).json({errors:['Order not found']});
    }

    res.send();
}

const searchOrder = async (req, res) => {
    const order = await OrderService.search(req.params.id);

    if (!order) {
      return res.status(404).json({errors:['Order not found']});
    }

    if (req.query.group) {
        if(req.query.meals) {
            const meals = await OrderService.groupByMeals(order);

            if (!meals) {
                return res.status(404).json({errors:["Order's meals not found"]});
            }

            res.json(meals);
            return;
        } else {
            const dishes = await OrderService.groupByDishes(order);

            if (!dishes) {
                return res.status(404).json({errors:["Order's dishes not found"]});
            }

            res.json(dishes);
            return;
        }
    }

    res.json(order);
}

module.exports = {
    getAllOrders,
    creatOrder,
    updateOrder,
    deleteOrder,
    searchOrder
}