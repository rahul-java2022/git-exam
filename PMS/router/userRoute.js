const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

// view routes
router.get('/', viewController.loginView);
router.get('/registration', viewController.registerView);
router.get('/home',userController.home);

// Authentication controllers
router.post('/login',authController.loginAuth);
router.post('/registration', authController.registerAuth);


// logout route
router.get('/logout',userController.logout);

module.exports = router;