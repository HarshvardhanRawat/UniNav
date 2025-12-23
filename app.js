//Load environment variables from .env file
require("dotenv").config();

//Import required modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');

//Import models and utilities
const rooms = require('./models/rooms.js')
const path = require('path');
const wrapAsync = require('./utilts/wrapAsync');

//Needed to read form data
app.use(express.urlencoded({ extended: true }));

//Ejs-Mate setup
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

//View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Method Override setup
app.use(methodOverride('_method'));

//Server configuration
const connectMongo = require("./services/mongo");
const port = process.env.PORT || 8080;

//Session configuration
const session = require('express-session');
const sessionOptions = {
    secret: "thisshould",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

//Flash middleware setup
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Home Route
app.get('/', wrapAsync(async (req, res) => {
    res.render("index/index.ejs");
}));

app.get('/privacy', wrapAsync(async (req, res) => {
    res.render("index/privacy.ejs");
}));

app.get('/termsCondition', wrapAsync(async (req, res) => {
    res.render("index/termsCondition.ejs");
}));

const dbs = require('./routes/dbs.js');
app.use('/dbs' , dbs);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectMongo();