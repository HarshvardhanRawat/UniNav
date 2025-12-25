const joi = require('joi');

// Schema for validating room information
module.exports.roomSchema = joi.object({
    room: joi.object({
        building: joi.string().required(),
        floor: joi.string().required(),
        room: joi.string().required(),
        landmark: joi.string().required(),
        directionHint: joi.string().allow('').optional(),
        digipin: joi.string().required()
    }).required()
});