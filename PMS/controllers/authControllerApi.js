const userModel = require('../models/userModel');
const express = require('express');
const AppError = require('../utility/appError');
const crypto = require('crypto');

// Login authentification controller
exports.loginAuthApi = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email, !password) {
            return next(new AppError('Please provide all inputs'),401);
        }else{
            const verifiedLogin = await userModel.loginValidation(email, password);
            if (verifiedLogin) {
                const createToken = await crypto.randomBytes(32).toString('hex');
                const createTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
                // console.log(createToken, createTokenExpiry);
                const storeToken = await userModel.storeToken(
                    email,
                    createToken,
                    createTokenExpiry
                );
                // console.log(storeToken.token[0].token);
                const data = [
                    { token: createToken },
                    { id: storeToken._id,
                      name: storeToken.name 
                    }
                ];
                if (storeToken._id) {
                    await res.cookie('token', data, { maxAge: 900000, httpOnly: true });
                    res.status(200).json({
                        status: 'success',
                        data: storeToken
                    })
                } else {
                    return next(new AppError(storeToken, 401));
                }
            } else {
                return next(new AppError('Invalid Email/Password', 401));
            }
        }
    } catch (Error) {
        return next(new AppError(Error, 401));
    }
};

// Registration authentification controller
exports.registerAuthApi = async (req, res, next) => {
    try {
        const { name, email, password, passconf, mobile, username } = req.body;
        if (!name || !email || !password || !passconf || !mobile || !username) {
            return new AppError('please provide inputs', 401);
        }
        const verifiedRegistration = await userModel.registerValidation(
            name,
            email,
            password,
            passconf,
            mobile,
            username
        );
        if (verifiedRegistration._id) {
            res.status(200).json({
                status:"success",
                massage: "User has been registererd successfuly"
            })
        } else {
            return next(new AppError(verifiedRegistration, 401));
        }
    } catch (error) {
        return next(new AppError(error, 400));
    }
};

// login check controller
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
                return next(new AppError('Login verification has been failed', 401)); 
            }

        }else{
            return next(new AppError('Token has been required', 401));
        }
    } catch (error) {
        return next(new AppError(error, 401));
    }
}