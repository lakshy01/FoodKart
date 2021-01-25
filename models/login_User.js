const mongoose = require('mongoose');
const { Schema } = mongoose;

const Login_User_Schema = new Schema({
    name: {
        type: String
    },
    gender: {
        type: String
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    pincode: {
        type: String
    },
    order_history: {
        type: Array
    }
});

module.exports = mongoose.model('Login_User_Schema', Login_User_Schema);