const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")
const {UserModel}=require("./userModel")
const {BookModel}=require("./bookModel")

let uploadSchema = new mongoose.Schema({
    user_id:{ type:mongoose.ObjectId, ref:"users"},
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    price:Number,
    date_created: {
        type: Date, default: Date.now()
    },
    img_url: String,
    info: String
})

exports.UploadModel = mongoose.model("uploads", uploadSchema);
