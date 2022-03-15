const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');
const viewController = require('../controllers/viewController')
const authController = require('./../controllers/authController');

// After login view controllers
router.get('/dashboard',authController.loginCheck,viewController.dashboardView);
router.get('/addProduct',authController.loginCheck,viewController.addProductView);
router.get('/editProduct/:id',authController.loginCheck,viewController.editProductView);

// crud operations controllers
router.post('/addProduct',authController.loginCheck,productController.addProduct);
router.post('/editProduct',authController.loginCheck,productController.editProduct);
router.get('/deleteProduct/:id',authController.loginCheck, productController.deleteProduct);

module.exports = router;