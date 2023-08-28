const { Double } = require('bson');
const mongoose = require('mongoose');

const BranchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    address: {
        type: String, 
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    activityTime: {
        type: String,
        required: true
    }, 

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    coordinateX:
    {
        type: Number,
        required: true
    },
    
    coordinateY:
    {
        type: Number,
        required: true
    },

    area: {
        type: String,
        required: true
    }
});

const Branches = mongoose.model('branches', BranchesSchema);

module.exports = Branches;