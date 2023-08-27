const DishService = require('../services/dish');

const getAllDishes = async (req,res) => {
    try {
        console.log("in1");

        let dishes;

        if (req.query.categoryId) {
            dishes = await DishService.getByCategory(req.query.categoryId);
            res.json(dishes);
            return;
        } 
            
        dishes = await DishService.getAll();
        
        if (!dishes) {
            throw new Error('Non existing dishes');
        }

        console.log(req.query.kosher);

        if(req.query.price && req.query.kosher && req.query.sort) // price, kosher, sort
        {

                console.log("1");

                if(req.query.sort === "מהמחיר הגבוה לנמוך")
                    dishes = await DishService.LowHighSort();

                if(req.query.sort === "מהמחיר הנמוך לגבוה") 
                    dishes = await DishService.HighLowSort();

            dishes = await DishService.maxPrice(dishes, req.query.price);
            dishes = await DishService.isKosher(req.query.categoryId, dishes);

        }

        if(!req.query.price && req.query.kosher && req.query.sort) // kosher, sort
        {
            console.log("2");

            if(req.query.sort === "מהמחיר הנמוך לגבוה")
                dishes = await DishService.LowHighSort();


            if(req.query.sort === "מהמחיר הגבוה לנמוך")
                dishes = await DishService.HighLowSort();

            dishes = await DishService.isKosher(req.query.categoryId, dishes);
        }


        if(req.query.price && req.query.kosher && !req.query.sort) // kosher, price
        {
            console.log("3");

            dishes = await DishService.maxPrice(dishes, req.query.price);
            dishes = await DishService.isKosher(req.query.categoryId, dishes);
        }

        if(!req.query.price && req.query.kosher && req.query.sort) // price, sort
        {
            console.log("4");

            if(req.query.sort === "מהמחיר הנמוך לגבוה")
                dishes = await DishService.LowHighSort();


            if(req.query.sort === "מהמחיר הגבוה לנמוך")
                dishes = await DishService.HighLowSort();

            dishes = await DishService.maxPrice(dishes, req.query.price);
        }


        if(!req.query.price && !req.query.kosher && req.query.sort) // sort
        {
            console.log("5");


            console.log(dishes);
            console.log("in3");
            if(req.query.sort === "מהמחיר הנמוך לגבוה")
                dishes = await DishService.LowHighSort();


            if(req.query.sort === "מהמחיר הגבוה לנמוך")
                dishes = await DishService.HighLowSort();

            console.log(dishes);
        }

        if(!req.query.price && req.query.kosher && !req.query.sort) // kosher
        {
            console.log("6");

            dishes = await DishService.isKosher(req.query.categoryId, dishes);
        }

        if(req.query.price && !req.query.kosher && !req.query.sort) // price
        {
            console.log("7");

            dishes = await DishService.maxPrice(dishes, req.query.price);
        }

        res.json(dishes);
    }
    
    catch (error) {
        res.status(400).json({
            error: "Getting all the dishes - Error",
            message: error.message
        });
    }
}

const createDish = async (req,res) => {
    try {
        const newDish = await DishService.create(req.body.name, req.body.price, req.body.categoryId, req.body.picture, req.body.description, req.body.kosher);
        res.json(newDish);
    }
    
    catch (error) {
        res.status(400).json({
            error: "Creating new dish - Error",
            message: error.message
        });
    }
}

const updateDish = async (req,res) => {
    if (!req.body.name) {
        res.status(400).json({message:'The new name to the dish is required'});
    }

    if (!req.body.price) {
        res.status(400).json({message:'The new price to the dish is required'});
    }

    if (!req.body.categoryId) {
        res.status(400).json({message:'The new CategoryId to the dish is required'});
    }

    if (!req.body.picture) {
        res.status(400).json({message:'The new picture to the dish is required'});
    }

    if (!req.body.description) {
        res.status(400).json({message:'The new description to the dish is required'});
    }

    if (!req.body.kosher) {
        res.status(400).json({message:'The new kosher to the dish is required'});
    }

    const newDish = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        categoryId: req.body.categoryId,
        picture: req.body.picture,
        description: req.body.description, 
        kosher: req.body.kosher
    }

    const dish = await DishService.update(newDish);
    if (!dish) {
        return res.status(404).json({errors:['Dish not found']});
    }

    res.json(dish);
};


const deleteDish = async (req,res) => {
    const dish = await DishService.delete(req.params.id);
    
    if (!dish) {
        return res.status(404).json({errors:['Dish not found']});
    }

    res.send();
}

const searchDish = async (req,res) => {
    const dish = await DishService.search(req.params.id);
    
    if (!dish) {
      return res.status(404).json({errors:['Dish not found']});
    }

    res.json(dish);
}

module.exports = {
    getAllDishes,
    createDish,
    updateDish,
    deleteDish,
    searchDish
}