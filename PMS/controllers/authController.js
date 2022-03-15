const userModel = require('../models/userModel');
const express = require('express');
const AppError = require('../utility/appError');
const crypto = require('crypto');

exports.loginAuth = async (req, res, next) => 
{
    try {
        const{email, password} = req.body;
        const verifiedLogin = await userModel.loginValidation(email,password);
    if(verifiedLogin){
        const createToken = await crypto.randomBytes(32).toString('hex');
        const createTokenExpiry = Date.now() + 24*60*60*1000;
        // console.log(createToken, createTokenExpiry);
        const storeToken = await userModel.storeToken(
            email,
            createToken,
            createTokenExpiry
        );
        // console.log(storeToken.token[0].token);
        const data = [{token: createToken},{id:storeToken._id,name:storeToken.name}];
        if(storeToken._id){
            await res.cookie('token',data, { maxAge: 900000, httpOnly: true });
            req.flash('success', 'Welcome Back');
            res.redirect('/prod/dashboard');
        }
    }else{
        req.flash('error', 'Invalid username/password');
        res.redirect('/');
    }
    } catch (error) {
        res.status(400).json(
            {status:'failed',
            massage: error}
        );        
    }
};

exports.loginCheck = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token);
        if(token){
            const verifyToken = await userModel.verifyToken(token);
            // console.log(verifyToken);
            if(verifyToken){
                next();
            }else{
                req.flash('error','Token is Invalid, Please login again')
                res.redirect('/');  
            }

        }else{
            res.redirect('/');
        }
    } catch (error) {
        
    }
}
exports.registerAuth = async (req, res) => 
{
    try {
        const{name, email, password,passconf, mobile, username} = req.body;
        if(!name || !email || !password || !passconf || !mobile || !username){
            return new AppError('please provide inputs', 401);
        }
    const verifiedregistration = await userModel.registerValidation(name, email, password,passconf, mobile, username);
    if(verifiedregistration._id){
            req.flash('success', 'User has been registered Successfuly');
            res.redirect('/');
    }else{
        req.flash('error',"User registration failed");
        req.redirect('/registration');
    }
    } catch (error) {
        return new AppError(error, 400);
    }
};