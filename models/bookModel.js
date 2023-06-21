const mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    class: String,
    subject:String,
    supervision: String,
    name:String,
    type:String,
    author_name:String,
    publisher:String,
    // dancode: String
})

exports.BookModel = mongoose.model("books", bookSchema);



