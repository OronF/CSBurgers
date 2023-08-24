const CatrgoryService = require('../services/category');

const getAllCategories = async (req, res) => {
    try {

        let Catrgories;

        if(req.query.categorytype) {
            Catrgories = await CatrgoryService.searchCatrgoryByType(req.query.categorytype);
        } else {
            Catrgories = await CatrgoryService.getAll();
        }

        if(!Catrgories) {
            throw new Error('Non existing categories');
        }

        res.json(Catrgories);
    }

    catch (error) {
        res.status(400).json({
            error: "Getting all the categories - Error",
            message: error.message
        });
    }
}

const createCategory = async (req, res) => {
    try {
        const newCatrgory = await CatrgoryService.create(req.body.name, req.body.categorytype);
        res.json(newCatrgory);
    }

    catch (error) {
        res.status(400).json({
            error: "Creating new category - Error",
            message: error.message
        });
    }
}

const updateCategory = async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({message:'The new name to the category is required'});
    }

    if (!req.body.categorytype) {
        res.status(400).json({message:'The new categorytype to the category is required'});
    }

    const newCatrgory = {
        id: req.params.id,
        name: req.body.name,
        categorytype: req.body.categorytype
    }

    const category = await CatrgoryService.update(newCatrgory);
    if (!category) {
        return res.status(404).json({errors:['Category not found']});
    }

    res.json(category);
};


const deleteCategory = async (req, res) => {
    const category = await CatrgoryService.delete(req.params.id);
    
    if (!category) {
        return res.status(404).json({errors:['Category not found']});
    }

    res.send();
}

const searchCategory = async (req, res) => {
    const category = await CatrgoryService.search(req.params.id);
    
    if (!category) {
      return res.status(404).json({errors:['Category not found']});
    }

    res.json(category);
}

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategory
}