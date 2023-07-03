const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { BookModel } = require("../models/bookModel");
const { validateBook } = require("../validation/bookValidation")

router.get("/", authAdmin, (req, res) => {
  res.json({ msg: "books works!" })
})

//returns list of all books
router.get("/booksList", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";


  try {
    if (!req.query.perPage) {
      let data = await BookModel
        .find({})
        .populate('subjectId', 'name')
      console.log("in return without pagention")
      res.json(data);
    } else {
      let data = await BookModel
        .find({})
        .populate('subjectId', 'name')
        .limit(perPage)
        .skip((page - 1) * perPage)
      console.log("in return wit pagention")
      res.json(data);
    }

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err couldn't load books", err });
  }
})


//returns list of names and id's of books
router.get("/booksNamesList", async (req, res) => {
  
  try {
    let data = await BookModel
      .find({}, { _id: 1, name: 1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err couldn't load books names", err });
  }
})


//returns all books by subject
router.get("/subjects/:idSubject", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let subId = req.params.idSubject;
    let data = await BookModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('subjectId', 'name')
      .find({ 'subjectId': subId })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err in get books by subject", err })
  }
})


//returns number of books in the system
router.get("/count", async (req, res) => {
  try {
    let count = await BookModel.countDocuments({})
    console.log(count)
    res.json({ count })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


//post a new book
router.post("/", authAdmin, async (req, res) => {
  let validBody = validateBook(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let book = new BookModel(req.body);
    await book.save();
    res.json(book);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err in post book", err })
  }
})


//updates a book
router.put("/:idEdit", authAdmin, async (req, res) => {
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