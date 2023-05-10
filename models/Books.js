const mongoose = require('mongoose')
const { Schema } = mongoose;

const BooksSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    publishedBy:{
        type: String,
    },
    status:{
        type: String,
        default: "AVAILABLE"
    },
    BorrowedBy:{
        type: String,
        default: null
    }
    
})

const Books = mongoose.model('books',BooksSchema)
Books.createIndexes()
module.exports = Books