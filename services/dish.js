const Dish = require('../models/dish');

const getAll = async() => {
    return await Dish.find({});
}

const createDish = async (newDish) => {
    const dish = new Dish({
        name: newDish.name,
        price: newDish.price,
        categoryId: newDish.categoryId,
        picture: newDish.picture,
        description: newDish.description,
        kosher: newDish.kosher
    });

    if (newDish.webServiceId) {
        dish.webServiceId = newDish.webServiceId;
    }
    
    return await dish.save();
}

const searchDish = async(id) => {
    return await Dish.findById(id);
}

const deleteDish = async (id) => {
    const dish = await searchDish(id);

    if (!dish) {
        return null;
    }

    await dish.deleteOne();

    return dish;
}

const updateDish = async (newDish) => {
    const dish = await searchDish(newDish.id);

    if (!dish) {     
        return null;
    }
       
    dish.name = newDish.name;
    dish.price = newDish.price;
    dish.categoryId = newDish.categoryId;
    dish.picture = newDish.picture;
    dish.description = newDish.description;
    dish.kosher = newDish.kosher;

    if (newDish.webServiceId) {
        dish.webServiceId = newDish.webServiceId;
    }

    await dish.save();
    return dish;
}

const getByCategory = async (categoryId) => {
    return await Dish.find({categoryId});
}

const filterDishes = async (price, kosher, categoryId, dishes) => {
    const parsedPrice = parseInt(price);

    if (kosher && !price && !categoryId) {
        return await dishes.filter((dish) => {
            return dish.kosher;
        });
    }
    
    else if (!kosher && price && !categoryId) {
        return await dishes.filter((dish) => {
            return dish.price <= parsedPrice;
        });
    }
    
    else if (kosher && price && !categoryId) {
        return await dishes.filter((dish) => {
            return dish.kosher && dish.price <= parsedPrice;
        });
    }

    else if (kosher && !price && categoryId) {
        return await dishes.filter((dish) => {
            return dish.kosher && dish.categoryId == categoryId;
        });
    }
    
    else if (!kosher && price && categoryId) {
        return await dishes.filter((dish) => {
            return dish.price <= parsedPrice && dish.categoryId == categoryId;
        });
    }

    else if (kosher && price && categoryId) {
        return await dishes.filter((dish) => {
            return dish.kosher && dish.price <= parsedPrice && dish.categoryId == categoryId;
        });
    }
}

const HighLowSort = async (kosher, price, categoryId) =>
{
    if (!kosher && !price && !categoryId) {
        return await Dish.find({}).sort({
            price: -1
        });
    }

    else if (kosher && !price && !categoryId) {
        return await Dish.find({kosher}).sort({
            price: -1
        });
    } 
    
    else if (!kosher && price && !categoryId) {
        return await Dish.find({price: { $lte: price }}).sort({
            price: -1
        });
    }

    else if (!kosher && !price && categoryId) {
        return await Dish.find({categoryId}).sort({
            price: -1
        });
    }

    else if (kosher && price && !categoryId) {
        return await Dish.find({kosher, price: { $lte: price }}).sort({
            price: -1
        });
    }

    
    else if (kosher && !price && categoryId) {
        return await Dish.find({kosher, categoryId}).sort({
            price: -1
        });
    }

    else if (!kosher && price && categoryId) {
        return await Dish.find({price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }

    else if (kosher && price && categoryId) {
        return await Dish.find({kosher, price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }
}

const LowHighSort = async (kosher, price, categoryId) =>
{
    if (!kosher && !price && !categoryId) {
        return await Dish.find({}).sort({
            price: 1
        });
    } 

    else if (kosher && !price && !categoryId) {
        return await Dish.find({kosher}).sort({
            price: 1
        });
    } 
    
    else if (!kosher && price && !categoryId) {
        return await Dish.find({price: { $lte: price }}).sort({
            price: 1
        });
    }

    else if (!kosher && !price && categoryId) {
        return await Dish.find({categoryId}).sort({
            price: 1
        });
    }

    else if (kosher && price && !categoryId) {
        return await Dish.find({kosher, price: { $lte: price }}).sort({
            price: 1
        });
    }

    
    else if (kosher && !price && categoryId) {
        return await Dish.find({kosher, categoryId}).sort({
            price: 1
        });
    }

    else if (!kosher && price && categoryId) {
        return await Dish.find({price: { $lte: price }, categoryId}).sort({
            price: 1
        });
    }

    else if (kosher && price && categoryId) {
        return await Dish.find({kosher, price: { $lte: price }, categoryId}).sort({
            price: 1
        });
    }
}


module.exports = {
    getAll,
    create: createDish,
    delete: deleteDish,
    update: updateDish,
    search: searchDish,
    getByCategory,
    filterDishes,
    HighLowSort,
    LowHighSort
}