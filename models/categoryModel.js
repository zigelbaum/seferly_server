const mongoose =require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name:String,
  url_name:String
})



exports.CategoryModel = mongoose.model("categories",categorySchema);

