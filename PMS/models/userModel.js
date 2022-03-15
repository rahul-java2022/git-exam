const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('validator');
const AppError = require('../utility/appError')


// login tokens Schema -- Sub Schema of candidates
const tokensSchema = mongoose.Schema({
    token: {
        type: String,
    },
    expireTime: {
        type: Date,
    }
}, { _id: false });

const userSchema = mongoose.Schema(
    {
        name:
        {
            type: String,
            required: [true, 'Name is required']
        },
        email:
        {
            type: String,
            required: [true, 'Email is required'],
            validate: [validator.isEmail, 'Please provide a valid email'],
            unique: true
        },
        password:
        {
            type: String,
            required: [true, 'Password is required'],
            min: [8, 'password must be atleast 8 charecters']
        },
        token : { 
            type : Array,
        },
        token : [tokensSchema],
        passconf:
        {
            type: String,
            required: [true,'Please Confirm your password'],
            validate: 
                {
                    validator: function(pass){
                    return pass == this.password;
                    },
                    message: 'password and confirm password are not same'
                },
            select:false
        },
        mobile:
        {
            type: Number,
        },
        username:
        {
            type: String,
            unique: [true, 'This username already exists, please try another one']
        }
    }
)
// on save password goes encrypted
userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passconf = undefined;
    next();
    });
    
const User = mongoose.model('User',userSchema);
exports.registerValidation = async (name, email, password, passconf, mobile, username) =>{
    try {
        console.log(name,email,mobile,password,passconf,username);
        const query = {name, email, password, passconf, mobile, username};
        return  await User.create(query);
    } catch (error) {
        throw new AppError(error,401);
    }
};
exports.loginValidation = async (email, password) => 
{
try {
    const query =  { email };
    const emailVerified = await User.findOne(query);
    // console.log(emailVerified);
    if(emailVerified === null){
        return false;
    }else{
        return await loginverify(password, emailVerified.password);
    }
} catch (error) {
    return new AppError(error, 400);
}
};
exports.storeToken = async(email, token, expireTime) => {
    try {
        const query =  { email };
    const getData = await User.findOne(query);
    if(getData._id){
        const query = {token:[{token},{expireTime}]};
        return await User.findByIdAndUpdate(getData._id, query);
    }
    } catch (error) {
        return new AppError(error, 401);
    }
};
exports.verifyToken = async (token) => {
const id = token[1].id;
    const userData =  await User.find({_id:id});
    const dbToken = userData[0].token[0].token;
    if(token[0].token === dbToken){
        return true;
    }
    return false;
};
const loginverify = async (incomingPassword, realPassword) => 
    {
        return await bcrypt.compare(incomingPassword, realPassword);
    }