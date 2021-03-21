const User = require("../model/user");

const config = require("../service/config");
const { SMTPClient } = require("emailjs");

const client = new SMTPClient({
  user: config.TRANSPORT_AUTH_USER,
  password: config.TRANSPORT_AUTH_PASS,
  host: "smtp.gmail.com",
  ssl: true,
});

exports.me = async function (req, res) {
  try {
    const id = res.locals._id;
    const user = await User.findOne({ _id: id });
    const token = await user.generateAuthToken();
    if (user) {
      res.status(200).json({ user: user, token: token });
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Please try again" });
  }
};
exports.authenticate = async function (req, res) {
  try {
    const { googleId, imageUrl, email, name } = req.body.response.profileObj;
console.log(req.body)
    const user_ = await User.findOne({ googleId: googleId });
    if (user_) {
      const token = await user_.generateAuthToken();
      res
        .status(200)
        .json({ message: "Auth Successfull", user: user_, token: token });
    } else {
      const user = new User({
        username: name,
        googleId: googleId,
        avatarUrl: imageUrl,
        emailId: email,
      });
      await user.save();
      const token = await user.generateAuthToken();
      res
        .status(200)
        .json({ message: "Auth Successfull", user: user, token: token });
    }
  } catch (err) {
    res.status(400).json({ message: "Please try again" });
  }
};
