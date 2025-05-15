const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const adminSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: { type: String },
});
const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: { type: String },
  orders : [{
    type : ObjectId,
    ref  : 'Food'
  }]
});
const foodSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    imageURL : String
})

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Food = mongoose.model('Food', foodSchema);

module.exports={
    User,
    Admin,
    Food
}