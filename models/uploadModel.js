const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

let uploadSchema = new mongoose.Schema({
    user_id: String,
    user_name: String,
    user_phone: String,
    user_email: String,
    book_name: String,
    price:Number,
    city_name: String,
    subject: String,
    date_created: {
        type: Date, default: Date.now()
    },
    img_url: String,
    info: String
})

exports.UploadModel = mongoose.model("uploads", uploadSchema);
