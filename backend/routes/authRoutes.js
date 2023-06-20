import express from "express";
import { validateSignup, validateSignin } from "./../middlewares/validator";
import User from "./../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";

import { sendMail } from "./../middlewares/sendMail";
dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  const reqUser = req.body;

  // Validation
  const { errors, isValid } = validateSignup(reqUser);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Create a new user in the db
  try {
    const user = await User.findOne({ email: reqUser.email });
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = await new User({ ...reqUser });
    newUser.password = newUser.encryptPassword(reqUser.password);
    await newUser.save();

    // Create and send the JWT token
    jwt.sign(
      { email: newUser.email },
      process.env.SECRET_KEY,
      {
        expiresIn: 3600, // 1 houre in seconds
      },
      (err, token) => {
        res.send({
          token: token,
          userData: { id: newUser._id, name: newUser.fullName, role: newUser.role },
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/login", async (req, res) => {
  const reqUser = req.body;
  // Validation
  const { errors, isValid } = validateSignin(reqUser);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = reqUser.email;
  const password = reqUser.password;

  // Find user
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Incorrect Username" });
    if (!user.validPassword(password)) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Create and send the JWT token
    jwt.sign(
      { email },
      process.env.SECRET_KEY,
      {
        expiresIn: 3600, // 1 houre in seconds
      },
      (err, token) => {
        res.send({
          token: token,
          userData: { id: user._id, name: user.fullName, role: user.role },
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/sendMails", async (req, res) => {
  const { email } = req.query;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    res.status(404);
    return res.json({ message: "the email provided was not found" });
  } else if (findUser) {
    jwt.sign(
      { email },
      process.env.SECRET_KEY,
      {
        expiresIn: 180, // 3 minute in seconds
      },
      (err, token) => {
        const link = `${process.env.BASE_URL}/reset-password/${token}`;
        sendMail('password_Reset_Template',{email:req.query.email,link:link});
        res.send("password reset link sent to your email account");
      }
    );
  } else {
    res.status(500);
    return res.json({ message: "Internal Server Error" });
  }
});

router.get("/successfully/sendMails", async (req, res) => {
  const { email } = req.query;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    res.status(404);
    return res.json({ message: "the email provided was not found" });
  } else if (findUser) {
    sendMail('verify_Email_Template',{email:req.query.email});
  } else {
    res.status(500);
    return res.json({ message: "Internal Server Error" });
  }
});

router.put("/passwordReset", async (req, res) => {
  const { token, password } = req.body;
  const decoded = jwt_decode(token);
  const email = decoded.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    res.status(404);
    return res.json({ message: "the email provided was not found" });
  } else if (findUser) {
    findUser.password = findUser.encryptPassword(password);
    const userDetail = await User.findByIdAndUpdate(findUser._id, findUser);
    return res.json(userDetail);
  } else {
    res.status(500);
    return res.json({ message: "Internal Server Error" });
  }
});

router.get("/token", async (req, res) => {
  const { token } = req.query;
  const decoded = jwt_decode(token);
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      res.json({ error: true, message: "token expires" });
    } else {
      res.json({ error: false, message: "Token verified" });
    }
  });
});

// router.put("/registerUser", async (user) => {
//   let res;
//   const {email, password, status}=user
//   const findUser = await User.findOne({ email });
//   if (!findUser) {
//     res.status(404);
//      res.json({ message: "the email provided was not found"});
//   }
//     else if(findUser){
//       findUser.password = findUser.encryptPassword(password);
//       findUser.status = status

//       res = await User.findByIdAndUpdate(findUser._id, findUser);
//     }
//    else {
//     res = await User.findByIdAndUpdate(user._id, user);
//   }
//   return res;
// });

export default router;
