const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

let uploadSchema = new mongoose.Schema({
    user_id:{ type:mongoose.ObjectId, default:null},
    user_name: String,
    user_phone: String,
    user_email: String,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    price:Number,
    city_name: String,
    subject: {   type: mongoose.ObjectId,
        ref: 'subjects'
    },
    date_created: {
        type: Date, default: Date.now()
    },
    img_url: String,
    info: String
})

exports.UploadModel = mongoose.model("uploads", uploadSchema);
