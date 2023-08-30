/*const Dish = require('../models/dish');

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
}*/

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
    return  Dish.find({categoryId});
}

const isKosher = async (categoryId, dishes) =>
{
    if (!categoryId) {
        return dishes.filter((dish) => {
            return dish.kosher;
        });
    } 

    return dishes.filter((dish) => {
        return dish.kosher && dish.categoryId == categoryId;
    });
}

const maxPrice = async (dishes, priceInp, categoryId) =>
{
    const parsedPrice = parseInt(priceInp);
    console.log(categoryId);

    if (!categoryId) {
        return dishes.filter((dish) => {
            return dish.price <= parsedPrice;
        });
    }

    return dishes.filter((dish) => {
        return dish.price <= parsedPrice && dish.categoryId == categoryId;;
    });
}

const HighLowSort = async (kosherCheck, price, categoryId) =>
{
    if (kosherCheck === 2 && !price && !categoryId) {
        return await Dish.find({}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && !price && !categoryId) {
        return await Dish.find({kosher: true}).sort({
            price: -1
        });
    } 
    
    else if (kosherCheck === 2 && price && !categoryId) {
        return await Dish.find({price: { $lte: price }}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 2 && !price && categoryId) {
        return await Dish.find({categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && price && !categoryId) {
        return await Dish.find({kosher: true, price: { $lte: price }}).sort({
            price: -1
        });
    }

    
    else if (kosherCheck === 3 && !price && categoryId) {
        return await Dish.find({kosher: true, categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 2 && price && categoryId) {
        return await Dish.find({price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }

    else if (kosherCheck === 3 && price && categoryId) {
        return await Dish.find({kosher: true, price: { $lte: price }, categoryId}).sort({
            price: -1
        });
    }
}

const LowHighSort = async (kosherCheck, price, categoryId) =>
{
    if (kosherCheck === 2 && !price && !categoryId) {
        return await Dish.find({}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && !price && !categoryId) {
        return await Dish.find({kosher: true}).sort({
            price: 1
        });
    } 
    
    else if (kosherCheck === 2 && price && !categoryId) {
        return await Dish.find({price: { $lte: price }}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 2 && !price && categoryId) {
        return await Dish.find({categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && price && !categoryId) {
        return await Dish.find({kosher: true, price: { $lte: price }}).sort({
            price: 1
        });
    }

    
    else if (kosherCheck === 3 && !price && categoryId) {
        return await Dish.find({kosher: true, categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 2 && price && categoryId) {
        return await Dish.find({price: { $lte: price }, categoryId}).sort({
            price: 1
        });
    }

    else if (kosherCheck === 3 && price && categoryId) {
        return await Dish.find({kosher: true, price: { $lte: price }, categoryId}).sort({
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
    isKosher,
    maxPrice,
    HighLowSort,
    LowHighSort
}