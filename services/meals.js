const Meal = require('../models/meals');
const mongoose = require('mongoose');

const getAll = async() => {
    return await Meal.find({});
}

const createMeal = async (name, price, dishes, categoryId, picture, description, kosher) => {
    const meal = new Meal({
        name: name,
        price: price,
        dishes: dishes,
        categoryId: categoryId,
        picture: picture,
        description: description,
        kosher: kosher
    });

    return await meal.save();
}

const searchMeal = async(id) => {
    return await Meal.findById(id);
}

const deleteMeal = async (id) => {
    const meal = await searchMeal(id);

    if (!meal) {
        return null;
    }

    await meal.deleteOne();

    return meal;
}

const updateMeal = async (newMeal) => {
    const meal = await searchMeal(newMeal.id);

    if (!meal) {
        return null;
    }

    meal.name = newMeal.name;
    meal.price = newMeal.price;
    meal.dishes = newMeal.dishes;
    meal.categoryId = newMeal.categoryId;
    meal.picture = newMeal.picture;
    meal.description = newMeal.description;
    meal.koser = newMeal.kosher;

    await meal.save()
    return meal;
}

const getByCategory = async (categoryId) => {
    return await Meal.find({categoryId});
}

module.exports = {
    getAll,
    create: createMeal,
    delete: deleteMeal,
    update: updateMeal,
    search: searchMeal,
    getByCategory
}