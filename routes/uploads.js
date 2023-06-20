const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UploadModel } = require("../models/uploadModel");
const { UserModel } = require("../models/userModel");
const {validateUpload} = require("../validation/uploadValidation");
const { model } = require("mongoose");
const router = express.Router();


router.get("/" ,authAdmin, async(req,res)=> {
    res.json({msg:"uploads works"})
  })
  
//returns list of all uploads
router.get("/uploadsList", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
  
    try {
      let data = await UploadModel
        .find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err couldn't load uploads", err });
    }
})

//returns all uploads by subject
router.get("/subject/:subName", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
  
    try {
      let subName = req.params.subName;
      let subReg = new RegExp(subName, "i");
      let data = await UploadModel.find({ subject: subReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ _id: -1 })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err in get uploads by subject", err })
    }
  })

  //returns all uploads by book
router.get("/book/:bookName", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
  
    try {
      let bookName = req.params.bookName;
      let bookReg = new RegExp(bookName, "i");
      let data = await UploadModel.find({ book_name: bookReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ _id: -1 })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err in get uploads by book", err })
    }
  })

//returns all uploads by city
router.get("/city/:cityName", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
  
    try {
      let cityName = req.params.cityName;
      let cityReg = new RegExp(cityNameName, "i");
      let data = await UploadModel.find({ city: cityReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ _id: -1 })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err in get uploads by city", err })
    }
  })

  //returns all uploads within price range
  router.get("/prices", async (req, res) => { 
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "price"
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let min = req.query.min;
      let max = req.query.max;
      if (min && max) {
        let data = await UploadModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
        res.json(data);
      }
      else if (max) {
        let data = await UploadModel.find({ price: { $lte: max } })
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
        res.json(data);
      } else if (min) {
        let data = await UploadModel.find({ price: { $gte: min } })
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
        res.json(data);
      } else {
        let data = await UploadModel.find({})
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
        res.json(data);
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err in get uploads in price range", err })
    }
  })

//post a new upload, needs to be a logged in user
router.post("/", auth, async (req, res) => {
    let validateBody = validateUpload(req.body);
    if (validateBody.error) {
      return res.status(400).json(validateBody.error.details);
    }
    try {
      let upload = new UploadModel(req.body);
      upload.user_id = req.tokenData._id;
      let userInfo= await UserModel.findOne({ user_id: upload.user_id})
      upload.user_name=userInfo.fullName;
      upload.user_phone=userInfo.phone;
      upload.user_email=userInfo.email;
      await upload.save();
      res.status(201).json(upload);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err failed to add upload to db", err });
    }
  })

  //update an upload
  router.put("/:idEdit", auth, async (req, res) => {
    let valdiateBody = validateUpload(req.body);
    if (valdiateBody.error) {
      return res.status(400).json(valdiateBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      let data;
      if (req.tokenData.role == "admin") {
        data = await UploadModel.updateOne({ _id: idEdit }, req.body);
      } else { 
        data = await UploadModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body); 
      }
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err couldn't update upload", err })
    }
  })

  //deletes an upload
  router.delete("/:idDel", auth, async (req, res) => {
    try {
      let idDel = req.params.idDel;
      let data;
      if (req.tokenData.role == "admin") {
        data = await UploadModel.deleteOne({ _id: idDel })
      }
      else {
        data = await UploadModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
      }
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err, couldn't delete the upload from db", err })
    }
  })


module.exports = router;
