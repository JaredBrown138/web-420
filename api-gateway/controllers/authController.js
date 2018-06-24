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
    User.getById(req.userId, function(err, user){
        if(err) return res.status(500).send('There was a problem finding the user.');
        if(!user) return res.status(404).send('No user found.');

        res.status(200).send(user);
    });
};

exports.user_login = function(req, res){
    console.log(req.body.email);
    User.getOne(req.body.email, function(err, user){
        if (err) return res.status(500).send('Error on Server');
        if (!user) return res.status(404).send('User not found');
        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
        if(!passwordIsValid) return res.status(401).send({ auth: false, token: null});

        var token = jwt.sign({id: user._id}, config.web.secret, {
            expiresIn: 86400
        });

        res.status(200).send( {auth: true, token: token});
    })
}

exports.user_logout = function(req, res){
    res.status(200).send({auth: false, token: null});
}