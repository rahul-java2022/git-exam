const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const router = require('./router/userRoute');
const prodRouter = require('./router/productRoute');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const userRouterApi = require('./router/userRouterApi');
const productRouterApi = require('./router/productRouterApi');
// set view engine first
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// Static Files Folder
app.use('/assets', express.static('./public'));

// session
app.use(session({
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
    // store: new MongoStore({ 
    //     mongooseConnection: mongoose.connection,
    //     ttl: 14 * 24 * 60 * 60,
    // }),
    saveUninitialized: true,
    proxy: true,
    resave: 'true',
    secret: 'fvsd4567##$fgDDChfg'
}));

// flash middleware
app.use(flash());

// cookie middleware
app.use(cookieParser());

// body parser middleware
app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: "2mb"
 }));
// parse application/json
app.use(bodyParser.json({
    limit: "2mb"
}));
// use json
app.use(express.json());

// set routes
app.use('/', router);
app.use('/prod', prodRouter);

// set api routes
 app.use('/api/v1/users',userRouterApi);
 app.use('/api/v1/products',productRouterApi);

 app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        massage: err.massage
    })
})
module.exports = app;
