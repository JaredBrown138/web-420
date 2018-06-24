var express = require('express'); var router = express.Router();
var auth_controller = require('../controllers/authController');
var bodyParser = require('body-parser')
var checkToken = require("../check-token");
// POST request for registering a user 
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('/auth/register', urlencodedParser, auth_controller.user_register);
// GET request for verifying user tokens 
router.get('/auth/token', checkToken, auth_controller.user_token);
// POST request for logging a user in
router.post('/auth/login', urlencodedParser, auth_controller.user_login);
// GET request for logging a user out
router.get('/auth/logout', auth_controller.user_logout);
module.exports = router;