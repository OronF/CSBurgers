const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    picture: {
        type: String,
        required: true
    }, 

    description: {
        type: String,
        required: true
    },

    kosher:
    {
        type: Boolean,
        required: true
    },
                                       
    webServiceId: {
        type: String
    }
});

const Dish = mongoose.model("dishes", DishSchema);

module.exports = Dish;