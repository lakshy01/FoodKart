const mongoose = require('mongoose');
const { Schema } = mongoose;

const Restaraunt_Detail_Schema = new Schema({
    restaraunt_name: {
        type: String
    },
    servicable_pincodes: {
        type: String
    },
    food_item_name: {
        type: String
    },
    food_item_price: {
        type: Number
    },
    initial_quantity: {
        type: Number
    },
    rating: {
        type: Number
    },
    comment: {
        type: String
    }
});

module.exports = mongoose.model('RestarauntDetail', Restaraunt_Detail_Schema);
