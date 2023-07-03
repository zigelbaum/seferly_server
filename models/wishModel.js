const mongoose = require("mongoose");
const Joi = require("joi");

const wishSchema = new mongoose.Schema({
  user_id: { type:mongoose.ObjectId, ref:"users"},
  upload_id: { type:mongoose.ObjectId, ref:"uploads"}
})



exports.WishModel = mongoose.model("subjects", wishSchema);
