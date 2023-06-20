const express= require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { CityModel } = require("../models/cityModel");
const {validateCity}=require("../validation/cityValidation")
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 99;
  let page = req.query.page || 1;

  try{
    let data = await CityModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // .sort({_id:-1}) like -> order by _id DESC
    .sort({_id:-1})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there was an error try again later",err})
  }
})

router.get("/byId/:id", async(req,res) => {
  try{
    let data = await CityModel.findOne({_id:req.params.id})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there was an error try again later",err})
  }
})



router.post("/", authAdmin, async(req,res) => {
  let validBody = validateCity(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let city = new CityModel(req.body);
    await city.save();
    res.json(city);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit", authAdmin, async(req,res) => {
  let validBody = validateCity(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await CityModel.updateOne({_id:idEdit},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:idDel", authAdmin, async(req,res) => {
  try{
    let idDel = req.params.idDel
    let data = await CityModel.deleteOne({_id:idDel});
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

module.exports = router;