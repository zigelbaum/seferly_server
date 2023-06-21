const Joi = require("joi");

exports.validateUpload = (_reqBody) => {

    let joiSchema = Joi.object({   
      
        bookId: Joi.string().required(),
        price: Joi.number().min(2).max(99).allow(null, ""),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        info: Joi.string().min(1).max(400).allow(null, ""),
    })
    return joiSchema.validate(_reqBody);
}
