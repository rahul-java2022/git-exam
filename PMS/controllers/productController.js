const express = require('express');
const productModel = require('./../models/productModel');
const AppError = require('../utility/appError');

// Add product to db
exports.addProduct = async (req, res) => {
  try {
      console.log(req.body);
    const {pname, price, quantity,vendor, warranty} = req.body;
   if(!pname || !price || !quantity || !vendor || ! warranty){
    req.flash('error','Please provide all inputs')
    res.redirect('/prod/addProduct');    
    }else{
    const addProductToDB = await productModel.addProductToDB(
        pname, 
        price, 
        quantity,
        vendor, 
        warranty
    );
    if(addProductToDB._id){
        req.flash('success','Item has been added successfuly');
        res.redirect('/prod/dashboard');
    }else{
        req.flash('error', 'something went wrong, please try again later');
        res.redirect('/prod/addProduct');
    }    
};
  } catch (error) {
     return new AppError(error,401); 
  }
};

// edit product to database
exports.editProduct = async (req, res) => {
    try {
        const {id,pname, price, quantity,vendor, warranty} = req.body;
        if(!id || !pname || !price || !quantity || !vendor || !warranty){
            req.flash('error', 'All input fields are required');
            res.redirect('/prod/editProduct/'+id);
        }
        const editProduct = await productModel.editProduct(id,pname, price, quantity,vendor, warranty);
        if(editProduct._id){
            req.flash('success', 'Item has been updated successfuly');
            res.redirect('/prod/dashboard');
        }else{
            req.flash('error', 'something went wrong, please try again later');
            res.redirect('/prod/editProduct/'+id);            
        }
    } catch (error) {
        return new AppError(error, 401);
    }
};

// delete product from database
exports.deleteProduct = async(req, res) => {
   try {
    const id = req.params.id;
    const getDelResponse = await productModel.deleteProduct(id);
    if(getDelResponse._id){
        req.flash('success', 'Item has been deleted successfuly');
        res.redirect('/prod/dashboard');
    }else{
        req.flash('error', 'Something went wrong, please try again later');
    };
   } catch (error) {
     return new AppError(error,401);  
   }
};
