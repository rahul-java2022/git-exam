const express = require('express');
const userModel = require('./../models/userModel');

exports.home = async(req, res) => {
    res.redirect('/prod/dashboard');
};

exports.logout = async(req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};