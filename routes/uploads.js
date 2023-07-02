
const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { UploadModel } = require("../models/uploadModel");
const { validateUpload } = require("../validation/uploadValidation");
const { BookModel } = require("../models/bookModel");
const { forEach, filter } = require("lodash")
const router = express.Router();


// get upload with uploadId
router.get("single/:uploadId", async (req, res) => {
  let uploadID = req.params.uploadId
  try {
    let upload = await UploadModel.find({ _id: uploadID })
      .populate('user_id', 'fullName email city phone')
      .populate({
        path: 'bookId',
        populate: {
          path: 'subjectId',
          model: 'subjects'
        },
        model: 'books'
      })
    //,
    //select:'name subjectId type'})
    console.log(upload)
    res.json(upload)
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})


//returns list of all uploads
router.get("/uploadsList", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let data = await UploadModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('user_id', 'fullName email city phone')
      .populate({
        path: 'bookId',
        populate: {
        //  path: 'bookId.subjectId',
          path: 'subjectId',
          model: 'subjects',
        },
        model: 'books',
        select: 'name subjectId type'
      })
    console.log(data);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
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
    await upload.save();
    res.status(201).json(upload);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err failed to add upload to db", err });
  }
});


//returns all uploads by subject
router.get("/subjects/:subId", async (req, res) => {

  try {
    let subId = req.params.subId;

    let data = await UploadModel.find({})
      .populate('user_id', 'fullName email city phone')
      .populate({
        path: 'bookId',
        populate: {
          path: 'subjectId',
          model: 'subjects',
          match: { _id: subId }
        },
        model: 'books',
        select: 'name subjectId type',

      })
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err in get uploads by subjects", err })
  }
})
//works
//returns all uploads by book id
router.get("/books/:bookID", async (req, res) => {
  try {
    let bookID = req.params.bookID;

    let data = await UploadModel.find({})
      .populate('user_id', 'fullName email city phone')
      .populate({
        path: 'bookId',
        populate: {
          path: 'subjectId',
          model: 'subjects',
        },
        model: 'books',
        select: 'name subjectId type',
      })
      .find({ bookId: bookID })

    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err in get uploads by subjects", err })
  }
})



//returns all uploads by city
router.get("/cities/:cityName", async (req, res) => {

  try {
    let cityName = req.params.cityName;
    let data = await UploadModel.find({})
      .populate('user_id', 'fullName email city phone')
      .populate({
        path: 'bookId',
        populate: {
          path: 'subjectId',
          model: 'subjects',
        },
        model: 'books',
        select: 'name subjectId type',
      });
    let result = filter(data, (item) => {
      return item.user_id.city === cityName;

    })
    res.json(result)
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
    let data;
    let min = req.query.min;
    let max = req.query.max;
    console.log(min)
    console.log(max)
    if (min && max) {
      data = await UploadModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate('user_id', 'fullName email city phone')
        .populate({
          path: 'bookId',
          populate: {
            path: 'subjectId',
            model: 'subjects',
          },
          model: 'books',
          select: 'name subjectId type'
        })

    }
    else if (max) {
      data = await UploadModel.find({ price: { $lte: max } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate('user_id', 'fullName email city phone')
        .populate({
          path: 'bookId',
          populate: {
            path: 'subjectId',
            model: 'subjects',
          },
          model: 'books',
          select: 'name subjectId type'
        })

    } else if (min) {
      data = await UploadModel.find({ price: { $gte: min } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate('user_id', 'fullName email city phone')
        .populate({
          path: 'bookId',
          populate: {
            path: 'subjectId',
            model: 'subjects',
          },
          model: 'books',
          select: 'name subjectId type'
        })

    } else {
      data = await UploadModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate('user_id', 'fullName email city phone')
        .populate({
          path: 'bookId',
          populate: {
            path: 'subjectId',
            model: 'subjects',
          },
          model: 'books',
          select: 'name subjectId type'
        })

    }

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err in get uploads in price range", err })
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


//works
//deletes an upload
router.delete("/:idDel", authAdmin, async (req, res) => {
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
