const mongoose = require('mongoose')
require('dotenv').config()


//const mongoURI = "mongodb://localhost:27017/ecom"
const mongoURI = process.env.MONGO


const connectToMongo = () =>{
    mongoose.connect(mongoURI,()=>{
        console.log("Successfully connected to mongo db")
    })

}

module.exports = connectToMongo;