const joi = require('joi');

module.exports.roomSchema = joi.object({
    room: joi.object({
        building: joi.string().required(),
        floor: joi.string().required(),
        room: joi.string().required(),
        landmark: joi.string().required(),
        digipin: joi.string().required()
    }).required()
});