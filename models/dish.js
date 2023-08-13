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

    CategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    picture: {
        type: String,
        required:true
    }
});

const Dish = mongoose.model("dishes", DishSchema);

module.exports = Dish;