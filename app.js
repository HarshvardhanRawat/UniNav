const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');

const wrapAsync = require('./utilts/wrapAsync');

require("dotenv").config();
const connectMongo = require("./services/mongo");

const Room = require("./models/rooms.js");

const port = 8080;

app.get('/', wrapAsync(async (req, res) => {
    res.render("index/index.ejs");
}));

app.get('/privacy', wrapAsync(async (req, res) => {
    res.render("index/privacy.ejs");
}));

app.get('/termsCondition', wrapAsync(async (req, res) => {
    res.render("index/termsCondition.ejs");
}));

app.get('/db', wrapAsync(async (req, res) => {
    const rooms = await Room.find();
    res.render("index/db.ejs", { rooms });
}));

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectMongo();