const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../service/config");
const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
    },
    cart: {
      type: Array,
    },
    wishlist: {
      type: Array,
    },
    orders: {
      type: Array,
    },
    cartprodids: {
      type:Array
    },
    wishlistprodids: {
      type:Array
    }
  },
  { timestamps: true }
);

UserSchema.method("generateAuthToken", async function () {
  const user = this;
  const token = jwt.sign(
    { id: user._id, username: user.username },
    config.JWT_SECRET
  );
  return token;
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
