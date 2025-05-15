const { Router } = require("express");
const { User, Food } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");
const { userMiddleware } = require("../middlewares/user");
const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.json({
        msg: "User already exists!!",
      });
    }
    const hashedPAssword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPAssword,
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
userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.json({
        msg: "Incorrect email!!!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        mmsg: "Incorrect password!!",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_SECRET
    );
    res.status(200).json({
      msg: "You are signed in!!",
      token: token,
    });
  } catch (error) {
    res.json({
      msg: "Try again",
      error: error.message,
    });
  }
});
userRouter.get("/dishes", async function (req, res) {
  try {
    const allDishes = await Food.find({});
    if (allDishes.length < 1) {
      return res.json({
        msg: "No meals available",
      });
    }
    res.json({
      msg: "All available meals!!",
      meals: allDishes,
    });
  } catch (error) {
    res.json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
});
userRouter.post("/orders/:dishId", userMiddleware, async function (req, res) {
  const dishId = req.params.dishId;
  try {
    const meal = await Food.findOne({
      _id: dishId,
    });
    if (!meal) {
      return res.json({
        msg: "Enter valid id",
      });
    }
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $push: {
          orders: dishId,
        },
      }
    );
    res.status(200).json({
      msg: "Order placed successfully!!",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      err: error.message,
    });
  }
});
userRouter.get("/orders", userMiddleware, async function (req, res) {
  const id = req.user._id;
  try {
    const user = await User.findOne({
      _id: id,
    });
    const order = user.orders.map((dish)=>({
        title : dish.title,
        description : dish.description,
        price : dish.price,
        imageURL : dish.imageURL
    }));
    res.json({
      orders: order,
    });
  } catch (error) {
    res.status(500).json({
        msg : "Something went wrong"
    })
  }
});
module.exports = { userRouter };