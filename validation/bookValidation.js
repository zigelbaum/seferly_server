const Joi = require("joi");

exports.validateBook = (_reqBody) => {

    let joiSchema = Joi.object({
        class: Joi.string().min(1).max(2).required(),
        subject: Joi.string().min(2).max(50).required(),
        supervision: Joi.string().min(2).max(50).required(),
        name: Joi.string().min(2).max(50).required(),
        type: Joi.string().min(2).max(50).required(),
        author_name: Joi.string().min(2).max(50).required(),
        publisher: Joi.string().min(2).max(50).required(),
        dancode: Joi.string().min(2).max(20).required()
    })
    return joiSchema.validate(_reqBody);
}