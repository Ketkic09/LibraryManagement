const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Librarian = require("../models/librarian");
const Books = require("../models/Books");
const { body, validationResult } = require("express-validator"); //install express/vaidator
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchLibraian = require("../midleware/fetchLibraian");
require("dotenv").config();

// ROUTE1: POST:/api/books/addbook This creates a book entry
router.post("/addbook",fetchLibraian, [
    body("name", "Enter the book name").isLength({ min: 1 }),
    body("author", "Enter the author name").isLength({ min: 2 })
    ],
    async(req,res)=>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }
    if(req.user !== undefined){
      try {
        const { name,status, author, publishedBy} = req.body;
        
        const book = new Books({
          name,
          author,
          publishedBy,
          status,
        });
        const savedBook = await book.save();
        res.json(savedBook);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
      }
    }
    else{
      res.status(401).send("Unauthorized access")
    }
    
})


//ROUTE 2: [PUT request] Update a book, authentication required
router.put("/updatebook/:id", fetchLibraian, async (req, res) => {
  const { name,status, author, publishedBy} = req.body;
  if(req.user !== undefined){
    try {
      //creating a newbook object to register the updates
      const newbook = {};
      if (name) {
        newbook.name = name;
      }
      if (status) {
        newbook.status = status;
      }
      if (author) {
        newbook.author = author;
      }
      if (publishedBy) {
        newbook.publishedBy = publishedBy;
      }
  
      //find the book to be updated and update it
      let book = await Books.findById(req.params.id); //taking the id passed from the request parameters
      if (book === undefined) {
        return res.status(404).send("book not found!");
      }
      console.log("book",book)
      
      //updating the book
      book = await Books.findByIdAndUpdate(
        req.params.id,
        { $set: newbook },
        { new: true }
      );
      res.json({ book });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!");
    }
  }else{
    res.status(401).send("Unauthorized access")
  }
  
});

//ROUTE 3: [DELETE req] delete a book, authentication requires
router.delete("/deletebook/:id", fetchLibraian, async (req, res) => {
  if(req.user !== undefined){
    try {
      let book = await Books.findById(req.params.id);
      console.log("book to delete",book)

      if (!book) {
        return res.status(404).send("book not found!");
      }
      book = await Books.findByIdAndDelete(req.params.id);
      res.send({ msg: "this book is deleted", book:book });
    } catch (error) {
      console.error(error.message);
      req.status(500).send("Internal server error!");
    }
  }else{
    res.status(401).send("Unauthorized access")
  }
  
});

//ROUTE 4: [POST] /borrowbook member authentication required
router.post("/borrowbook/:id",fetchLibraian,async(req,res)=>{
  console.log("req.user",req.user)
  if(req.user === undefined){
    return res.status(401).send("Unauthorized access!")
  }
  //check if id requested for the book exists and is available
  const book = await Books.findById(req.params.id)
  if(book === undefined) return res.status(404).send("Book not found")
  if(book!== undefined && book.status === "BORROWED"){
    return res.status(404).send("Book is unavailable")
  }
  const statusBook = await Books.findByIdAndUpdate(
    req.params.id,
    {$set:{status:"BORROWED"}},
    {new:true}
  )
  res.status(200).send({message:"Updated book successfully",book:statusBook})

})

module.exports = router;