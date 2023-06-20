const express= require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const {BookModel}=require("../models/bookModel");
const {validateBook}=require("../validation/bookValidation")

router.get("/" ,authAdmin, (req,res)=> {
  res.json({msg:"books works!"})
})

//returns list of all books
router.get("/booksList", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await BookModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err couldn't load books", err });
  }
})

//returns all books by subject
router.get("/city/:idSubject", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let subName = req.params.idSubject;
    let subReg = new RegExp(subName, "i");
    let data = await BookModel.find({ subject: subReg })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err in get books by subject", err })
  }
})

//post a new book
router.post("/", authAdmin, async (req, res) => {
  let validBody = validateBook(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let subject = new BookModel(req.body);
    await subject.save();
    res.json(subject);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err in post book", err })
  }
})

  //updates a book
  router.put("/:idEdit",authAdmin, async (req, res) => {
    let valdiateBody = validateBook(req.body);
    if (valdiateBody.error) {
      return res.status(400).json(valdiateBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      let data;
      data = await BookModel.updateOne({ _id: idEdit }, req.body);
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err couldn't update book", err })
    }
  })

//deletes a book
router.delete("/:idDel", authAdmin, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data;
    data = await BookModel.deleteOne({ _id: idDel })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err, couldn't delete the book from db", err })
  }
})

module.exports = router;