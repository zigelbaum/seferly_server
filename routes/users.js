const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, createToken } = require("../models/userModel");
const { validateUser, validateLogin } = require("../validation/userValidation")
const { config } = require("../config/secret")
const router = express.Router();


router.get("/", async (req, res) => {
    res.json({ msg: "Users work" })
})


//returns the user info when he sends token
router.get("/myInfo", auth, async (req, res) => {
    try {
        let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(userInfo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})


//returns token data
router.get("/checkToken", auth, async (req, res) => {
    console.log(req.tokenData)
    res.status(200).json(req.tokenData);
})


//returns rgisterd users list only to the admin
router.get("/usersList", authAdmin, async (req, res) => {
    try {
        let users = await UserModel.find({}, { password: 0 });
        res.json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})


//returns number of registered users to admin
router.get("/count", authAdmin, async (req, res) => {
    try {
        let count = await UserModel.countDocuments({})
        res.json({ count })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


//user sign up to db
router.post("/", async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already exists in the system", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err in user sign up", err })
    }
});


//user login to db
router.post("/login", async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        //check if the email exists in the db
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is incorrect ,code:1" })
        }
        // check if the password entered matches the encrypted password in the db
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is incorrect ,code:2" });
        }
        //Generate a token with the user's ID
        let token = createToken(user._id, user.role);
        res.json({ token });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "error in user login", err })
    }
});


//enables admin change the role of another user
router.patch("/changeRole/:userID", authAdmin, async (req, res) => {
    if (!req.body.role) {
        return res.status(400).json({ msg: "Need to send role in body" });
    }

    try {
        let userID = req.params.userID
        // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
        // TODO:move to config
        if (userID == config.adminId) {
            return res.status(401).json({ msg: "You cant change superadmin to user" });
        }
        let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "error in change role", err })
    }
})


//enables admin to block and unblock user without deleting him
router.patch("/changeActive/:userID", authAdmin, async (req, res) => {
    if (!req.body.active && req.body.active != false) {
        return res.status(400).json({ msg: "Need to send active in body" });
    }

    try {
        let userID = req.params.userID
        // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
        if (userID == config.adminId) {
            return res.status(401).json({ msg: "You cant change superadmin to user" });

        }
        let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err in changeactive", err })
    }
})


//deleting account only for the user and admin
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data;
        // if (req.tokenData.role == "admin") {
        //     data = await UserModel.deleteOne({ _id: idDel })
        // }
        if (req.tokenData._id == idDel || req.tokenData._id == config.adminId) {
            data = await UserModel.deleteOne({ _id: idDel })
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err, couldn't delete the user from db", err })
    }
})


//editing user info only for user and admin
router.put("/:idEdit", auth, async (req, res) => {
    let valdiateBody = validateUser(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit;
        let data;
        // if (req.tokenData.role == "admin") {
        //     data = await UserModel.updateOne({ _id: idEdit }, req.body);
        // }
        if (req.tokenData._id == idEdit || req.tokenData._id == config.adminId) {
            data = await UserModel.updateOne({ _id: idEdit }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err couldn't update user", err })
    }
})


module.exports = router;
