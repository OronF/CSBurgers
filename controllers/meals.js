const MealService = require('../services/meals');

const getAllMeals = async (req, res) => {
    try {
        let meals;

        if (req.query.categoryId) {
            meals = await MealService.getByCategory(req.query.categoryId);
        } else {
            meals = await MealService.getAll();
        }

        res.json(meals);
    }

    catch (error) {
        res.status(400).json({
            error: "Getting all the meals - Error",
            message: error.message
        });
    }
}

const createMeal = async (req, res) => {
    try {
        const tmp = {
            name: req.body.name,
            price: req.body.price,
            dishes: req.body.dishes,
            categoryId: req.body.categoryId,
            picture: req.body.picture,
            description: req.body.description
        }

        if (req.body.webServiceId) {
            tmp.webServiceId = req.body.webServiceId;
        }

        const newMeal = await MealService.create(tmp);

        if (!newMeal) {
            throw new Error("couldn't create new meal");
        }

        res.json(newMeal);
    }
    
    catch (error) {
        res.status(400).json({
            error: "Creating new meal - Error",
            message: error.message
        });
    }
}

const updateMeal = async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({message:'The new name to the meal is required'});
    }

    if (!req.body.price) {
        res.status(400).json({message:'The new price to the meal is required'});
    }

    if (!req.body.dishes) {
        res.status(400).json({message:'The new dishes to the meal is required'});
    }

    if(!req.body.categoryId) {
        res.status(400).json({message:'The new CategoryId to the meal is required'});
    }

    if (!req.body.picture) {
        res.status(400).json({message:'The new picture to the meal is required'});
    }

    if (!req.body.description) {
        res.status(400).json({message:'The new description to the meal is required'});
    }

    const newMeal = {
        id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        dishes: req.body.dishes,
        categoryId: req.body.categoryId,
        picture: req.body.picture,
        description: req.body.description
    }

    if (req.body.webServiceId) {
        newMeal.webServiceId = req.body.webServiceId;
    }

    const meal = await MealService.update(newMeal);
    
    if (!meal) {
        return res.status(404).json({errors:['Meal not found']});
    }

    res.json(meal);
};


const deleteMeal = async (req, res) => {
    const meal = await MealService.delete(req.params.id);

    if (!meal) {
        return res.status(404).json({errors:['Meal not found']});
    }

    res.send();
}

const searchMeal = async (req, res) => {
    const meal = await MealService.search(req.params.id);

    if (!meal) {
      return res.status(404).json({errors:['Meal not found']});
    }

    res.json(meal);
}

module.exports = {
    getAllMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    searchMeal
}