const { Router } = require("express");
const { Admin, Food } = require("../db");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middlewares/admin");
const bcrypt = require("bcrypt");
const { JWT_ADMIN_SECRET } = require("../config");
const adminRouter = Router();
adminRouter.post("/signup", async function (req, res) {
  const { username, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({
      email,
    });
    if (existingAdmin) {
      res.json({
        msg: "User already exists!!!!!!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({
      msg: "You are signed up as admin!!!!!",
    });
  } catch (error) {
    res.json({
      msg: "Something went wrong",
      err: error.message,
    });
  }
});
adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      email: email,
    });
    if (!admin) {
      return res.json({
        msg: "Incorrect email",
      });
    }
     const isMatch = await bcrypt.compare(password, admin.password);
     if(!isMatch){
        return res.json({
            msg : "Incorrect password!!"
        })
     }
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_SECRET
    );
    res.status(200).json({
      msg: "You are signed in as admin!!!",
      token: token,
    });
  } catch (error) {
    res.json({
      msg: "Try again",
      error: error.message,
    });
  }
});
adminRouter.post("/dishes", adminMiddleware, async function (req, res) {
  const { title, description, price, imageURL } = req.body;
  try {
    const existingDish = await Food.findOne({
      title,
    });
    if (existingDish) {
      return res.json({
        msg: "This meal already exists!!",
      });
    }
    const dish = await Food.create({
      title,
      description,
      price,
      imageURL,
    });

    res.status(200).json({
      msg: "Meal added!!",
      meal: dish,
    });
  } catch (error) {
    res.status(403).json({
      msg: "TRy again!!",
      err: error.message,
    });
  }
});
adminRouter.get("/dishes", adminMiddleware, async function (req, res) {
  try {
    const dishes = await Food.find({});
    res.status(200).json({
      msg: "Listed all the dishes",
      meals: dishes,
    });
  } catch (error) {
    res.json({
      msg: "Try again",
      err: error.message,
    });
  }
});
module.exports = {
  adminRouter,
};