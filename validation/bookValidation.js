const Joi = require("joi");

exports.validateUser = (_reqBody) => {

    let joiSchema = Joi.object({
        class: Joi.string().min(1).max(2).required(),
        eshkol: Joi.string().min(2).max(50).required(),
        subject: Joi.string().min(2).max(50).required(),
        supervision: Joi.string().min(2).max(50).required(),
        approval_number: Joi.number().required(),
        name: Joi.string().min(2).max(50).required(),
        type: Joi.string().min(2).max(50).required(),
        author_name: Joi.string().min(2).max(50).required(),
        publisher: Joi.string().min(2).max(50).required(),
        dancode: Joi.string().pattern(/^\d{2}-\d{7}$/).required()
    })
    return joiSchema.validate(_reqBody);
}