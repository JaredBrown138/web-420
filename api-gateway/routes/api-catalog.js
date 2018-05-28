var express = require('express'); var router = express.Router();
var auth_controller = require('../controllers/authController');
var bodyParser = require('body-parser')
// POST request for registering a user 
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('/auth/register', urlencodedParser, auth_controller.user_register);
// GET request for verifying user tokens 
router.get('/auth/token', auth_controller.user_token);
module.exports = router;