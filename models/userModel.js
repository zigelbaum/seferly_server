const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

let userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email:String,
  password:String,
  city:String,
  phone:String,
  date_created:{
    type:Date , default:Date.now()
  },
  role:{
    type:String, default:"user"
  },
  active:{
    type:Boolean, default: true,
  },
  uploads:[{ type:mongoose.ObjectId, ref:"uploads"}],
  wishList:[{ type:mongoose.ObjectId, ref:'wishes'}]
})

exports.UserModel = mongoose.model("users",userSchema);

exports.createToken = (_id,role) => {
  let token = jwt.sign({_id,role},config.tokenSecret,{expiresIn:"1440mins"});
  return token;
}

