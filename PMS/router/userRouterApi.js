const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authControllerApi');

router.post('/login',authController.loginAuthApi);
router.post('/registration', authController.registerAuthApi);

module.exports = router;