const mongoose = require('mongoose')
const { Schema } = mongoose;

const LibrarianSchema = new Schema({
    
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    
})

const Librarian = mongoose.model('librarian',LibrarianSchema)
Librarian.createIndexes()
module.exports = Librarian