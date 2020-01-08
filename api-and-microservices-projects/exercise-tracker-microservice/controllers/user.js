const User = require('../models/user');

exports.addUser = async function (req, res, next) {
    const username = req.body.username;
    let user = await User.find({username: username});

    if(user && user.length < 1) {
        user = new User({
            username: username
        });

        try {
            await user.save();

            res.json({username: user.username, _id: user._id});
        } catch(e) {
            console.log(e);
            next(e);
        }
    } else {
        res.send("username already taken");
    }
}

exports.findAllUsers = async function(req, res, next) {
    let users;
    try {
        users = await User.find({}).select({ "__v": 0 });
        
        res.json(users);
    } catch(e) {
        console.log(e);
        next(e);
    }
}