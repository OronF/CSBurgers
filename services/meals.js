const Meal = require('../models/meals');

const getAll = async() => {
    return await Meal.find({});
}

const createMeal = async (newMeal) => {
    const meal = new Meal({
        name: newMeal.name,
        price: newMeal.price,
        dishes: newMeal.dishes,
        categoryId: newMeal.categoryId,
        picture: newMeal.picture,
        description: newMeal.description,
        kosher: newMeal.kosher
    });

    if (newMeal.webServiceId) {
        meal.webServiceId = newMeal.webServiceId;
    }

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
    meal.kosher = newMeal.kosher;

    if (newMeal.webServiceId) {
        meal.webServiceId = newMeal.webServiceId;
    }

    await meal.save()
    return meal;
}

const getByCategory = async (categoryId) => {
    return await Meal.find({categoryId});
}

const isKosher = async (categoryId, meals) =>
{
    if (!categoryId) {
        return meals.filter((meal) => {
            return meal.kosher;
        });
    } 

    return meals.filter((meal) => {
        return meal.kosher && meal.categoryId == categoryId;
    });
}

const maxPrice = async (meals, priceInp, categoryId) =>
{
    const parsedPrice = parseInt(priceInp);
    console.log(categoryId);

    if (!categoryId) {
        return meals.filter((meal) => {
            return meal.price <= parsedPrice;
        });
    }

    return meals.filter((meal) => {
        return meal.price <= parsedPrice && meal.categoryId == categoryId;
    });
}

const HighLowSort = async (kosherCheck, price, categoryId) =>
{
    if (kosherCheck === 2 && !price && !categoryId) {
        return await Meal.find({}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && !price && !categoryId) {
        return await Meal.find({kosher: true}).sort({
            price: -1
        });
    } 
    
    else if (kosherCheck === 2 && price && !categoryId) {
        return await Meal.find({price: { $lte: price }}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 2 && !price && categoryId) {
        return await Meal.find({categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && price && !categoryId) {
        return await Meal.find({kosher: true, price: { $lte: price }}).sort({
            price: -1
        });
    }

    
    else if (kosherCheck === 3 && !price && categoryId) {
        return await Meal.find({kosher: true, categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 2 && price && categoryId) {
        return await Meal.find({price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && price && categoryId) {
        return await Meal.find({kosher: true, price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }
}

const LowHighSort = async (kosherCheck, price, categoryId) =>
{
    if (kosherCheck === 2 && !price && !categoryId) {
        return await Meal.find({}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && !price && !categoryId) {
        return await Meal.find({kosher: true}).sort({
            price: 1
        });
    } 
    
    else if (kosherCheck === 2 && price && !categoryId) {
        return await Meal.find({price: { $lte: price }}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 2 && !price && categoryId) {
        return await Meal.find({categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && price && !categoryId) {
        return await Meal.find({kosher: true, price: { $lte: price }}).sort({
            price: 1
        });
    }

    
    else if (kosherCheck === 3 && !price && categoryId) {
        return await Meal.find({kosher: true, categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 2 && price && categoryId) {
        return await Meal.find({price: { $lte: price }, categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && price && categoryId) {
        return await Meal.find({kosher: true, price: { $lte: price }, categoryId}).sort({
            price: 1
        });
    }
}

module.exports = {
    getAll,
    create: createMeal,
    delete: deleteMeal,
    update: updateMeal,
    search: searchMeal,
    getByCategory,
    isKosher,
    maxPrice,
    LowHighSort,
    HighLowSort
}