const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilts/wrapAsync.js');
const ExpressError = require('../utilts/ExpressError.js');
const {roomSchema} = require('../schema.js');
const Room = require('../models/rooms.js');
const methodOverride = require('method-override');


//Method Override setup
router.use(methodOverride('_method'));

//Needed to read form data
router.use(express.urlencoded({ extended: true }));

//Validation middleware
const validateRoom = (req, res, next) => {
    let {error} = roomSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Index route
router.get('/', wrapAsync(async (req, res) => {
    const allrooms = await Room.find({});
    res.render('./dbs/index.ejs', {allrooms});
}));


//New route
router.get('/new', (req, res) => {
    res.render('./dbs/new.ejs');
});


//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const room = await Room.findById(id);

    if(!room) {
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/dbs');
    }

    res.render('./dbs/show.ejs', {room});
}));


//Create route
router.post('/', validateRoom, wrapAsync(async (req, res) => {
    const newroom = new Room(req.body.room);
    await newroom.save();
    req.flash('success', 'Successfully created a new room entry!');
    res.redirect("/dbs");
}));


//Edit route 
router.get('/:id/edit', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const room = await Room.findById(id);

    if(!room) {
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/dbs');
    }

    res.render('./dbs/edit.ejs', {room});
}));


//Update route
router.put('/:id', validateRoom, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const room = await Room.findByIdAndUpdate(id, {...req.body.room});
    req.flash('success', 'Successfully updated the room!');
    res.redirect(`/dbs/${room._id}`);
}));


//Delete route 
router.delete('/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Room.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the room!');
    res.redirect('/dbs');
}));

module.exports = router;
