// For adding data to the database

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const initData = require('./data.js');
const rooms = require('../models/rooms.js');

// Connect to MongoDB
const main = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
};

//Delete existing data and add initial data
const initDB = async () => {
    await rooms.deleteMany({});
    await rooms.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}

// Connect and initialize the database
main()
    .then(async () => {
        await initDB();
        console.log("Data initialization complete");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        mongoose.connection.close();
    });