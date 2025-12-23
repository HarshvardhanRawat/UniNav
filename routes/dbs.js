const expres = require('express');
const router = expres.Router(mergeParams = true);
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const rooms = require('../models/rooms.js');
const methodOverride = require('method-override');


//Method Override setup
router.use(methodOverride('_method'));

//Needed to read form data
router.use(expres.urlencoded({ extended: true }));