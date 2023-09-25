const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModels");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("users Router");
});

userRouter.post("/signup", (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (password == confirmPassword) {
          const user = userModel({
            email,
            password: hash,
            confirmPassword: hash,
          });
          await user.save();
          res
            .status(200)
            .send({ msg: "user registerd Successfully", user: user });
        } else {
          res.send({ err: "password and confirm password should match" });
        }
      }
    });
  } catch (error) {
    res.status.apply(500).send({ err: error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id }, "employeeManagement");
          res.status(200).send({ message: "Login successful", token: token });
        } else {
          res.status(404).send({ message: "Invalid Credentials" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports={
    userRouter
};