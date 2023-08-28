const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },

    lname: {
        type: String,
        required: true
    },

    orders: {
        type: Array,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    is_Manager: {
        type: Boolean,
        required: true
    },

    currentOrder:{
        type: mongoose.Schema.Types.ObjectId
    }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;