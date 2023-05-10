// start server using cmd : nodemon .\index.js
const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Librarian = require("../models/librarian");
const { body, validationResult } = require("express-validator"); //install express/vaidator
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;


router.get("/", (req, res) => {
  console.log("on api/auth req sent");
  console.log(req.body);
  res.send(req.body);
});
// ROUTE1: POST:/api/auth/createuser This creates a user
router.post(
  "/createuser",
  [
    body("password", "password should have minimum 8 characters").isLength({
      min: 8,
    }),
  ],
  //creating async function so validation is done first
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    //checking if there are any errors and returnign BAD req
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    } else if (req.body.isMember) {
      //no errors then checking if username is taken, if not then user is created
      console.log("enterd else if");
      try {
        console.log("enter try");
        let member = await Member.findOne({ username: req.body.username }); //waits till validation is done
        if (member) {
          success = false;
          return res
            .status(400)
            .json({ success, errors: "username already taken" });
        }
        const salt = await bcrypt.genSalt(10);
        const safePswd = await bcrypt.hash(req.body.password, salt);
        member = await Member.create({
          username: req.body.username,
          password: safePswd,
          name: req.body.name,
        });

        const data = {
          member: {
            id: member.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
        res.send(req.body);
      } catch (error) {
        //catching any other errors
        console.error(error.message);
        res.status(500).send("Internal server occured!");
      }
    } else {
      // if user is librarian
      try {
        let librarian = await Librarian.findOne({
          username: req.body.username,
        }); //waits till validation is done
        if (librarian) {
          success = false;
          return res
            .status(400)
            .json({ success, errors: "username already taken" });
        }
        const salt = await bcrypt.genSalt(10);
        const safePswd = await bcrypt.hash(req.body.password, salt);
        librarian = await Librarian.create({
          username: req.body.username,
          password: safePswd,
          name: req.body.name,
        });

        const data = {
          librarian: {
            id: librarian.id,
          },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
        res.send(req.body);
      } catch (error) {
        //catching any other errors
        console.error(error.message);
        res.status(500).send("Internal server occured!");
      }
    }
  }
);

// ROUTE2: POST:/api/auth/login This authenticates the user

router.post(
  "/login",
  [
    body("username", "enter a valid username").isEmail(),
    body("password", "password incorrect").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, error: errors.array() });
    }
    const { username, password, isMember } = req.body;
    if (isMember) {
      //Find creds in member collection
      try {
        const member = await Member.findOne({ username: username });
        
        console.log("member",member)
        if (!member) {
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials",
          });
        }
        const { name } = member;
        const pswdCompare = await bcrypt.compare(password, member.password);
        if (!pswdCompare) {
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials",
          });
        }
        //if passes all the checks then returning user id
        const data = {
          member: {
            id: member.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, name });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured!");
      }
    } else {
      // If user selected librarian
      try {
        const librarian = await Librarian.findOne({ username: username });
        
        if (!librarian) {
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials",
          });
        }
        const { name } = librarian;
        const pswdCompare = await bcrypt.compare(password, librarian.password);
        if (!pswdCompare) {
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials",
          });
        }
        //if passes all the checks then returning user id
        const data = {
          librarian: {
            id: librarian.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, name });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured!");
      }
    }
  }
);

module.exports = router;
