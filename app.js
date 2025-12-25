//Load environment variables from .env file
require("dotenv").config();

//Import required modules
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
// const askGemini = require("./services/gemini.js");

//Import models and utilities
// const rooms = require('./models/rooms.js')
const path = require('path');
const wrapAsync = require('./utilts/wrapAsync');

//Needed to read form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

//Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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

//Privacy Policy Route
app.get('/privacy', wrapAsync(async (req, res) => {
    res.render("index/privacy.ejs");
}));

//Terms and Conditions Route
app.get('/termsCondition', wrapAsync(async (req, res) => {
    res.render("index/termsCondition.ejs");
}));

// app.get("/test-ai", async (req, res) => {
//   const answer = await askGemini(
//     "Capital of India?"
//   );
//   res.send(answer);
// });

// Login route
app.get("/login", (req, res) => {
    const firebaseConfig = {
    apiKey: "AIzaSyAq7W99zPt86yrMlXf9lHc2ZsJ7iJDtVCc",
    authDomain: "uninav-a8bec.firebaseapp.com",
    projectId: "uninav-a8bec",
    storageBucket: "uninav-a8bec.firebasestorage.app",
    messagingSenderId: "745452549104",
    appId: "1:745452549104:web:ad0a5728d730135f7f6335",
    measurementId: "G-7S2QGFWFK4"
    };

    res.render("login", { firebaseConfig });
});


//Login and Auth Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes)

//AI Routes
const aiRoutes = require("./routes/ai.js");
app.use("/ai", aiRoutes);

//Database Management Routes
const dbs = require('./routes/dbs.js');
app.use('/dbs' , dbs);

//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectMongo();