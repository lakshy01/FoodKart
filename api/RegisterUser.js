const UserDetail = require('../models/User_Details');
const RestarauntDetail = require('../models/Restaraunt_detail');
const CurrentUser = require('../models/login_User');
const Router = require('express').Router();

function compare(a, b) {
    if (a.rating > b.rating) {
        return -1;
    } else if (a.rating < b.rating) {
        return 1;
    }
    return 0;
}

Router.route('/users')
    // Task 1
    .post((req, res) => {
        const user = new UserDetail(req.body);
        user.save();
        return res.status(200).json(user);
    })

Router.route('/users/:user_id')
    // Task 2
    // assuming that I have the user_id from the front end 
    .get((req, res) => {
        UserDetail.findOne({ phoneNumber: req.params.user_id })
            .then((user) => {
                // log out previous user
                CurrentUser.deleteMany()
                    .then(() => {
                        console.log("All users logged out");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                // log in the current user
                let my_user = new CurrentUser({
                    name: user.name,
                    gender: user.gender,
                    phoneNumber: user.phoneNumber,
                    pincode: user.pincode
                });
                console.log(my_user);
                my_user.save();
                return res.json(my_user);
            })
            .catch((err) => {
                return res.send(err);
            });
    });


Router.route('/restaurants')
    // Task 3
    .post((req, res) => {
        // current_user if exist that means I need to select the restaraunt otherwise do nothing
        CurrentUser.find((err, users) => {
            if (users.length === 1) {
                const restaraunt = new RestarauntDetail(req.body);
                restaraunt.save();
                return res.status(200).json(restaraunt);
            } else {
                console.log("No users has been registered");
            }
        })
    })

Router.route('/restaurants/:Owner_id')
    // Task 4
    .post((req, res) => {
        RestarauntDetail.findOne({ restaraunt_name: req.params.Owner_id })
            .then((restaurant) => {
                console.log(restaurant);
                let prev_quant = restaurant.initial_quantity;
                restaurant.initial_quantity = prev_quant + req.body.initial_quantity;
                restaurant.save();
                return res.status(200).json(restaurant);
            })
            .catch((err) => {
                return res.send(err);
            });
    })

Router.route('/rate_restaurant/:Owner_id')
    // Task 5
    .post((req, res) => {
        CurrentUser.find((err, users) => {
            if (users.length === 1) {
                RestarauntDetail.findOne({ restaraunt_name: req.params.Owner_id })
                    .then((restaraunt) => {
                        console.log(restaraunt);
                        restaraunt.rating = req.body.rating;
                        restaraunt.comment = req.body.comment;
                        restaraunt.save();
                        return res.status(200).json(restaraunt);
                    })
                    .catch((err) => {
                        return res.send(err);
                    })
            } else {
                console.log("No user logged in");
            }
        })
    })

Router.route('/restaurants_list/:mode')
    // Task 6 
    .get((req, res) => {
        CurrentUser.find((err, users) => {
            if (users.length === 1) {
                let user_pincode = users[0].pincode;
                if (req.params.mode === "rating") {
                    RestarauntDetail.find()
                        .then((restaurants) => {
                            restaurants.sort(compare);
                            let final_list = restaurants.filter((restaurant) => restaurant.rating != 0);
                            let servicable_list = [];
                            for (let i = 0; i < final_list.length; i++) {
                                let pins = final_list[i].servicable_pincodes.split("/");
                                for (let j = 0; j < pins.length; j++) {
                                    if (pins[j] === user_pincode) {
                                        servicable_list.push(final_list[i]);
                                        break;
                                    }
                                }
                            }
                            let compressed_final_list = [];
                            for (let i = 0; i < servicable_list.length; i++) {
                                compressed_final_list.push({
                                    restaraunt_name: servicable_list[i].restaraunt_name,
                                    servicable_pincodes: servicable_list[i].servicable_pincodes,
                                    food_item_name: servicable_list[i].food_item_name,
                                    rating: servicable_list[i].rating
                                })
                            }
                            return res.json(compressed_final_list);
                        })
                        .catch((err) => {
                            res.json(err);
                        })
                } else if (req.params.mode === "price") {
                    RestarauntDetail.find()
                        .then((restaurants) => {
                            restaurants.sort((a, b) => (a.food_item_price < b.food_item_price) ? 1 : ((b.food_item_price < a.food_item_price) ? -1 : 0));
                            let servicable_list = [];
                            for (let i = 0; i < restaurants.length; i++) {
                                let pins = restaurants[i].servicable_pincodes.split("/");
                                for (let j = 0; j < pins.length; j++) {
                                    if (pins[j] === user_pincode) {
                                        servicable_list.push(restaurants[i]);
                                        break;
                                    }
                                }
                            }
                            let final_list = [];
                            for (let i = 0; i < servicable_list.length; i++) {
                                final_list.push({
                                    restaraunt_name: servicable_list[i].restaraunt_name,
                                    food_item_name: servicable_list[i].food_item_name
                                })
                            }
                            return res.json(final_list);
                        })
                        .catch((err) => {
                            res.json(err);
                        })
                }
            } else {
                console.log("No user logged in");
            }
        })
    })

Router.route('/place_order/:Owner_Id')
    // Task 7
    .post((req, res) => {
        CurrentUser.find((err, users) => {
            if (users.length === 1) {
                RestarauntDetail.findOne({ restaraunt_name: req.params.Owner_Id })
                    .then((restaraunt) => {
                        let final_quant;
                        if (req.body.quantity <= restaraunt.initial_quantity) final_quant = req.body.quantity;
                        else {
                            console.log("Quantity asked too much!!!");
                            return res.send("Quantity asked too much!!!");
                        }
                        users[0].order_history.push({
                            restaraunt_name: req.body.restaraunt_name,
                            quantity: final_quant
                        })
                        console.log("Orderd Successfully");
                        return res.send("Orderd Successfully");
                    })
                    .catch((err) => {
                        return res.send(err);

                    })
            } else {
                console.log("No current user logged in");
            }
        })
    })

exports = module.exports = Router;