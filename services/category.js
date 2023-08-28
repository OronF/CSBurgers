const Category = require('../models/category');

const getAll = async() => {
    return await Category.find({});
}

const createCatrgory = async (name, categorytype) => {
    const category = new Category({
        name: name,
        categorytype: categorytype
    });
    
    return await category.save();
}

const searchCatrgory = async(id) => {
    return await Category.findById(id);
}

const deleteCatrgory = async (id) => {
    const category = await searchCatrgory(id);

    if (!category) {
        return null;
    }

    await category.deleteOne();

    return category;
}

const updateCatrgory = async (newCatrgory) => {
    const category = await searchCatrgory(newCatrgory.id);

    if (!category) {     
        return null;
    }
       
    category.name = newCatrgory.name;
    category.categorytype = newCatrgory.categorytype;

    await category.save();
    return category;
}

const searchCatrgoryByType = async (categorytype) => {
    return await Category.find({categorytype});
}

module.exports = {
    getAll,
    create: createCatrgory,
    delete: deleteCatrgory,
    update: updateCatrgory,
    search: searchCatrgory,
    searchCatrgoryByType
}