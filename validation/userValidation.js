const Joi = require("joi");

exports.validateUser = (_reqBody) => {

    let joiSchema = Joi.object({
        fullName: {
            firstName: Joi.string().min(2).max(50).required(),
            lastName: Joi.string().min(2).max(50).required(),
        },
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(4).max(50).required(),
        phone: Joi.string().pattern(/^(05\d{8})$/).required(),
        city: Joi.string().min(3).max(99).required(),
        school: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(4).max(50).required()
    })

    return joiSchema.validate(_reqBody);
}