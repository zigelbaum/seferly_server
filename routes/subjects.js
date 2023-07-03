const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { SubjectModel } = require("../models/subjectModel");
const { validateSubject } = require("../validation/subjectValidation")
const router = express.Router();

router.get("/" ,authAdmin, async(req,res)=> {
  res.json({msg:"Subjects work"})
})


router.get("/subjectsList", async (req, res) => {

  try {
    let data = await SubjectModel.find({})
      .sort({ name: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there was an error try again later", err })
  }
})


router.post("/", authAdmin, async (req, res) => {
  let validBody = validateSubject(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let subject = new SubjectModel(req.body);
    await subject.save();
    res.json(subject);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err in post subject", err })
  }
})


router.put("/:idEdit", authAdmin, async (req, res) => {
  let validBody = validateSubject(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await SubjectModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err in edit subject", err })
  }
})


router.delete("/:idDel", authAdmin, async (req, res) => {
  try {
    let idDel = req.params.idDel
    let data = await SubjectModel.deleteOne({ _id: idDel });
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err in delete subject", err })
  }
})

module.exports = router;