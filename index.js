const express = require("express");
const mongoose = require("mongoose");
const {adminRouter} = require('./routes/admin')
const {userRouter} = require('./routes/user')
const app = express();

app.use(express.json())
app.use('/admin',adminRouter);
app.use('/user', userRouter);

async function connectToDB() {
  await mongoose.connect();
  app.listen(3000, () => {
    console.log("Sercer listening to posrt 3000!!");
  });
}
connectToDB();