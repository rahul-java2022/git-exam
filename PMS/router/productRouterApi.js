const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productControllerApi');
const authController = require('./../controllers/authController');

// get products
router.get('/allProducts',authController.loginCheck,productController.getAllProducts);
router.get('/ProductById/:id',authController.loginCheck,productController.getProductById);



// crud operations controllers
router.post('/addProduct',authController.loginCheck,productController.addProductApi);
router.patch('/editProduct/:id',authController.loginCheck,productController.editProductApi);
router.delete('/deleteProduct/:id',authController.loginCheck, productController.deleteProductApi);

module.exports = router;