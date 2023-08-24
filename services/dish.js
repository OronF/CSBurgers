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
        description: newDish.description
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

    if (newDish.webServiceId) {
        dish.webServiceId = newDish.webServiceId;
    }

    await dish.save();
    return dish;
}

const getByCategory = async (categoryId) => {
    return await Dish.find({categoryId});
}

module.exports = {
    getAll,
    create: createDish,
    delete: deleteDish,
    update: updateDish,
    search: searchDish,
    getByCategory
}