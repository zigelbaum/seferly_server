const mongoose = require("mongoose");
const Joi = require("joi");

const subjectSchema = new mongoose.Schema({
  name: String
})



exports.SubjectModel = mongoose.model("subjects", subjectSchema);

