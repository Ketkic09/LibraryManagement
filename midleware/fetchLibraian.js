const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const fetchLibraian = (req,res,next) =>{
    const token = req.header('auth-token')
    if (!token){
        res.status(401).send({error:"token not found"})
    }

    try{
        const data = jwt.verify(token,JWT_SECRET)
        console.log("data.librarian",data.librarian)
        req.user = data.librarian
        next()
    }catch(error){
        console.error(error.message)
        res.status(401).send({error:"Please authenticate with a valid token"})

    }
}

module.exports = fetchLibraian;