const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const initData = require('./data.js');
const rooms = require('../models/rooms.js');

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
};

const initDB = async () => {
    await rooms.deleteMany({});
    await rooms.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}

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