const mongoose = require("mongoose");
const Joi = require("joi");

const wishSchema = new mongoose.Schema({
  user_id: { type:mongoose.ObjectId, ref:"users"},
  book_id: { type:mongoose.ObjectId, ref:"books"}
})



exports.WishModel = mongoose.model("wishes", wishSchema);
