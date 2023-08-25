const Dish = require('../models/dish');

const getAll = async() => {
    return await Dish.find({});
}

const createDish = async (name, price, categoryId, picture, description, kosher) => {
    const dish = new Dish({
        name: name,
        price: price,
        categoryId: categoryId,
        picture: picture,
        description: description,
        kosher: kosher
    });
    
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

    await dish.save();
    return dish;
}

const getByCategory = async (categoryId) => {
    return await Dish.find({categoryId});
}

const isKosher = async (categoryId, dishes) =>
{
    return dishes.filter((dish) => {
        return dish.kosher;
    });
}

const maxPrice = async (dishes, priceInp) =>
{
    const parsedPrice = parseInt(priceInp);

    return dishes.filter((dish) => {
        return dish.price <= parsedPrice;
    });
}

const HighLowSort = async (dishes) =>
{
    return await Dish.find({}).sort({
        price: 1
    });
}

const LowHighSort = async (dishes) =>
{
}


module.exports = {
    getAll,
    create: createDish,
    delete: deleteDish,
    update: updateDish,
    search: searchDish,
    getByCategory,
    isKosher,
    maxPrice,
    HighLowSort,
    LowHighSort
}