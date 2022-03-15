const express = require('express');
const productModel = require('../models/productModel');
const AppError = require('../utility/appError');

/***********Product view Controllers*************/
// Dashboard View page
exports.dashboardView = async(req, res)=>{
    const allProducts = await productModel.allProducts();
    const cookieData = req.cookies.token;
    const name = cookieData[1].name;
    res.render('dashboard',{
        data: allProducts,
        header:'dashboard',
        err_msg : req.flash('error'),
        success_msg : req.flash('success'),
        name
    });
 };
//  Edit product view page
 exports.editProductView = async(req, res) => {
    try {
        if(req.params.id){
            const productData = await productModel.getProductById(req.params.id);
            const cookieData = req.cookies.token;
            const name = cookieData[1].name;
            if(productData._id){
                res.render('editProduct',{
                    data:productData,
                    header:'Edit Product',
                    err_msg : req.flash('error'),
                    success_msg : req.flash('success'),
                    name
                });
            }else{
                res.render('addProduct');
            }
        }else{
            throw new AppError('product id is not avaliable', 401);
        }
    } catch (error) {
        return new AppError(error,401);
    }
}
// Add product view page
exports.addProductView = async(req, res) => {
    try {
        const cookieData = req.cookies.token;
            const name = cookieData[1].name;
        res.render('addProduct', {
            header: 'Add Product',
            err_msg: req.flash('error'),
            success_msg: req.flash('success'),
            name
        });
    } catch (error) {
        return new AppError(error, 401);
    }
};

/********User View Controllers*******/
// Login View Controller
exports.loginView = async(req,res) => {
    try {
        res.render('login', 
    {
        header : 'login',
        err_msg : req.flash('error'),
        success_msg : req.flash('success')
    })
    } catch (error) {
      res.status(400).json(
        {
            status: 'failed',
            massage: error
        });  
    }
}

// Registration view controller
exports.registerView = async(req,res) => {
    
        res.render('register', 
            {
                header : 'Registration',
                err_msg : req.flash('error'),
                success_msg : req.flash('success')
            }
        );
};
