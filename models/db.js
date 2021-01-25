const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Jack:Welcome@123@cluster0.i6bva.mongodb.net/foodkarts?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log("Mongodb connected");
    } else {
        console.log("Mongodb is not connected");
    }
});

require('./User_Details');
