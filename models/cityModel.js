const mongoose =require("mongoose");
const Joi = require("joi");

const citySchema = new mongoose.Schema({
    name:String
})


exports.CityModel = mongoose.model("cities",citySchema);