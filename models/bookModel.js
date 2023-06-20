const mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    name:String,
    class: String,
    subject:String,
    supervision: String,
    type:String,
    author_name:String,
    publisher:String
})

exports.BookModel = mongoose.model("books", bookSchema);



