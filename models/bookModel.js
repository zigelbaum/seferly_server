const mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    class: String,
    subjectId:{ type:mongoose.Schema.Types.ObjectId, ref:'subjects'},
    supervision: String,
    name:String,
    type:String,
    author_name:String,
    publisher:String
})

exports.BookModel = mongoose.model("books", bookSchema);



