const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    dishes: {
        type: Array,
        required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    picture:{
        type: String,
        required: true
    }, 

    description: {
        type: String,
        required: true
    },

    webServiceId: {
        type: String
    }
});

const Meal = mongoose.model("meals", MealSchema);

module.exports = Meal;