var User = require('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var bodyParser = require('body-parser')
// Register a new user on POST 
exports.user_register = function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    console.log("Good!");
    var newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
    });
    console.log("Object Created");
    User.add(newUser, (err, user) =>{
        if (err){
            console.log("Error with registration!");
            return res.status(500).send("There was a problem with registering the user.");
        }
        console.log("No error with registration!");
        var token = jwt.sign({ id: user._id}, config.web.secret, {
            expiresIn: 86400
        });
        res.status(200).send({auth: true, token: token});
        console.log("Sent information on JWT!");
    })
}; 
// Verify token on GET 
exports.user_token = function(req, res) {
    var token = req.headers['x-access-token'];
    if(!token) return res.status(401).send({auth: false, message: 'No token provided'});

    jwt.verify(token, config.web.secret, function(err, decoded){
        if(err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        User.getById(decoded.id, function(err, user){
            if(err) return res.status(500).send('There was a problem finding the user.');
            if(!user) return res.status(404).send('No user found.');

            res.status(200).send(user);
        })
    });
}; 