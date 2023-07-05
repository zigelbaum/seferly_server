//TODO: GO OVER THIS PAGE
const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel } = require("../models/userModel");
const { WishModel } = require("../models/wishModel")

router.get("/", auth, (req, res) => {
    res.json({ msg: "books works!" })
})

//returns list of wishes of all users
router.get("/wishList", auth, async (req, res) => {
    //   let perPage = req.query.perPage || 10;
    //   let page = req.query.page || 1;
    //   let sort = req.query.sort || "_id";


    try {
        let data = await WishModel
            .find({})
        // .populate({path:'subjectId',model:'subjects'})
        // .limit(perPage)
        // .skip((page - 1) * perPage)
        // console.log("in return wit pagention")
        console.log(data)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err couldn't load wishess", err });
    }
})


//returns list of user wishes
router.get("/myWishList", auth, async (req, res) => {
    try {
        let data = await WishModel
            .find({ user_id: req.tokenData._id })
            .select('book_id')
            .populate({
                path: 'book_id',
                populate: {
                    //  path: 'bookId.subjectId',
                    path: 'subjectId',
                    model: 'subjects',
                },
                model: 'books'
            })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err couldn't load my wish list ", err });
    }
})


//returns all the users and book name on book
router.get("/bookWishes/:bookId", auth, async (req, res) => {
    try {
        let data = await WishModel
            .find({ book_id: req.params.bookId })
            .populate('user_id', 'fullName email')
            .populate('book_id', 'name')
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err couldn't load users wishing for book ", err });
    }
})


//returns number of wishes in the system
router.get("/count", authAdmin, async (req, res) => {
    try {
        let count = await WishModel.countDocuments({})
        console.log(count)
        res.json({ count })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "could't get count of wishes", err })
    }
})


//post a new wish
router.post("/", auth, async (req, res) => {
    try {
        let wish = new WishModel(req.body);
        wish.user_id = req.tokenData._id;
        await wish.save();
        let user = await UserModel.findByIdAndUpdate({ _id: req.tokenData._id }, { $push: { wishList: wish.book_id } });
        res.json(wish);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err in post wish", err })
    }
})


//deletes a wish
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data = await WishModel.deleteOne({ _id: idDel })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err, couldn't delete the wish from db", err })
    }
})

module.exports = router;