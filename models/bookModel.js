const mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    class: String,
    eshkol: String,
    subject:String,
    supervision: String,
    approval_number: Number,
    name:String,
    type:String,
    author_name:String,
    publisher:String,
    dancode: String
})

exports.BookModel = mongoose.model("books", bookSchema);



