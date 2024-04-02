const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const {signupSchema,loginSchema} = require("../validators/authValidator");
const validate = require("../middlewares/validateMiddleware");
const isAuthenticated = require('../middlewares/authMiddleware');


router.route('/signup').post(validate(signupSchema), userControllers.signupUser);
router.route('/login').post(validate(loginSchema), userControllers.loginUser);

//secured routes 
router.route('/logout').get(isAuthenticated, userControllers.logoutUser);
// router.route('/refresh-token').post(userControllers.refreshAccessToken);
router.route('/user-profile').get(isAuthenticated, userControllers.userProfile);

module.exports = router;