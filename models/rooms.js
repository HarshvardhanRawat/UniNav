//Schema for Rooms
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    building: String,
    floor: String,
    room: String,
    landmark: String,
    digipin: String,
    mapLink: String,
});

const rooms = mongoose.model('rooms' , roomSchema);
module.exports = rooms;