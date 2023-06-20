
exports.validateSubject = (_reqBody) => {
    let joiSchema = Joi.object({
      name:Joi.string().min(2).max(99).required()
      })
    return joiSchema.validate(_reqBody);
  }