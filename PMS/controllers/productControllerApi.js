const express = require('express');
const productModel = require('./../models/productModel');
const AppError = require('../utility/appError');

// Get all products from db
exports.getAllProducts = async (req, res, next) => {
    try {
        const allProducts = await productModel.allProducts();
        console.log(allProducts.length);
        if(allProducts.length > 0)
        {
            res.status(200).json({
                massage: 'success',
                data: allProducts
            });
        }else{
            return next(new AppError(allProducts), 401);
        }
    } catch (error) {
        next(new AppError(error,401));
    }
};

// Get product by id from db
exports.getProductById = async (req, res, next) => {
    try {
        const getProduct = await productModel.getProductById(req.params.id);
        if(getProduct._id)
        {
            res.status(200).json({
                massage: 'success',
                data: getProduct
            });
        }else{
            return next(new AppError(getProduct), 401);
        }
    } catch (error) {
        next(new AppError(error,401));
    }
};

// Add product to db
exports.addProductApi = async (req, res, next) => {
  try {
      console.log(req.body);
    const {pname, price, quantity,vendor, warranty} = req.body;
   if(!pname || !price || !quantity || !vendor || ! warranty){
     return next(new AppError('Please provide all inputs', 401));   
    }else{
    const addProductToDB = await productModel.addProductToDB(
        pname, 
        price, 
        quantity,
        vendor, 
        warranty
    );
    if(addProductToDB._id){
        res.status(200).json(
            {
                status: "Success",
                data: addProductToDB
            }
        )
    }else{
        return next(new AppError(addProductToDB,401));  
    }    
};
  } catch (error) {
     next(new AppError(error,401)); 
  }
};

// edit product to database
exports.editProductApi = async (req, res, next) => {
    try {
        const {pname, price, quantity,vendor, warranty} = req.body;
        const id = req.params.id;
        if(!id || !pname || !price || !quantity || !vendor || !warranty){
            next(new AppError('All input fields are required',401)); 
        }
        const editProduct = await productModel.editProduct(id,pname, price, quantity,vendor, warranty);
        if(editProduct._id){
            res.status(200).json(
                {
                    status: "Success",
                    data: editProduct
                }
            );
        }else{
            return next(new AppError(editProduct, 401));            
        }
    } catch (error) {
        return next(new AppError(error, 401));
    }
};

// delete product from database
exports.deleteProductApi = async(req, res, next) => {
   try {
    const id = req.params.id;
    if(!id){
        return next(new AppError('Please provide id', 401));
    }
    const getDelResponse = await productModel.deleteProduct(id);
    console.log(getDelResponse);
    if(getDelResponse._id){
        res.status(200).json(
            {
                status: "Success",
                data: "Item has been deleted successfuly"
            }
        );
    }
    if(getDelResponse === null){
        return next(new AppError('Please provide a valid id',401));
    }
   } catch (error) {
     return next(new AppError(error,401));  
   }
};
