const mongoose = require('mongoose');
const { Schema } = mongoose;

const User_Detail_Schema = new Schema({
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
    }
});

module.exports = mongoose.model('UserDetail', User_Detail_Schema);
