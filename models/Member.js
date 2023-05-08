const mongoose = require('mongoose')
const { Schema } = mongoose;

const MemberSchema = new Schema({
    
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
    booksBorrowed:{
        type:String
    }
})

const Member = mongoose.model('member',MemberSchema)
Member.createIndexes()
module.exports = Member