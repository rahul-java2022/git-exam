const mongoose = require('mongoose');
const AppError = require('../utility/appError');


const productSchema = mongoose.Schema(
    {
        pname:
        {
            type: String,
            required: [true, 'Product name is required']
        },
        price:
        {
            type: Number,
            required: [true, 'price is required']
        },
        quantity:
        {
            type: Number,
            required: [true, 'Quantity is required']
        },
        vendor : { 
            type: String,
            required: [true, 'Vendor is required']
        },
        warranty:
        {
            type: String,
            required: [true,'warrenty is required'],
        },
        token:
        {
            tokenId:
            {
                type: String
            },
            tokenTime:
            {
                type: Date
            }
        }
    }
);
// attach collection with schema using mongoose
const Product = mongoose.model('Product',productSchema);

// fetch all products from db
exports.allProducts = async () => {
    try {
        return await Product.find();
    } catch (error) {
        return new AppError(error, 400);
    }
};

// fetch product from db by using id
exports.getProductById = async (prodId) =>{
    try {
        return await Product.findById(prodId);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// edit product in db with  id
exports.editProduct = async(id,pname, price, quantity,vendor, warranty) => {
    try {
        const editData = {pname, price, quantity,vendor, warranty};
        return await Product.findByIdAndUpdate(id,editData);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// Delete product from db by id
exports.deleteProduct = async(id) => {
    try {
        const delId = {_id:id};
    return await Product.findByIdAndDelete(delId);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// add new product to db
exports.addProductToDB = async(pname, price, quantity,vendor, warranty) => 
{
    try {
        const productDetails = {pname, price, quantity,vendor, warranty};
        return await Product.create(productDetails);
    } catch (error) {
        return new AppError(error, 400);
    }
};