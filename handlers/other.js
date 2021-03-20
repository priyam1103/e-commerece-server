const User = require("../model/user");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
exports.addtocart = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { pid } = req.body;
    const user = await User.findOne({ _id: curr_id });
    var user_cart_prod;
    for (var i = 0; i < user.cart.length; i++) {
      if (user.cart[i].id === parseInt(pid)) {
        user_cart_prod = user.cart[i];
        break;
      }
    }
    if (user_cart_prod) {
      var cart = user.cart;
      user.cart = null;
      cart[i].quantity = parseInt(cart[i].quantity) + 1;
      console.log(cart);
      user.cart = [...cart];
      await user.save();
      res.status(200).json({ user: user });
    } else {
      axios
        .get(`https://dusky-ecommerce.herokuapp.com/api/products/mobile/${pid}`)
        .then(async (response) => {
          user.cart = [...user.cart, { ...response.data, quantity: 1 }];
          user.cartprodids = [...user.cartprodids, response.data.id];
          await user.save();
          res.status(200).json({ user: user });
        });
    }
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.updatequantity = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { index, quantity } = req.body;
    const user = await User.findOne({ _id: curr_id });

    var cart = user.cart;
    user.cart = null;
    cart[index].quantity = quantity;
    user.cart = [...cart];
    await user.save();
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.deleteproductfromcart = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { index, pid } = req.body;
    const user = await User.findOne({ _id: curr_id });
    var cart = user.cart;
    user.cart = null;
    cart.splice(index, 1);
    user.cart = [...cart];

    var cartids = user.cartprodids;
    user.cartprodids = null;

    cartids.splice(cartids.indexOf(parseInt(pid)), 1);
    user.cartprodids = cartids;
    await user.save();
    console.log(user);
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.getcartitems = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const user = await User.findOne({ _id: curr_id });
    if (user) {
      res.status(200);
    }
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.addtowishlist = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { pid } = req.body;
    const user = await User.findOne({ _id: curr_id });
    var user_wishlist_prod;
    for (var i = 0; i < user.wishlist.length; i++) {
      if (user.wishlist[i].id === pid) {
        user_wishlist_prod = user.wishlist[i];
        break;
      }
    }
    if (user_wishlist_prod) {
      res.status(200).json({ user: user });
    } else {
      axios
        .get(`https://dusky-ecommerce.herokuapp.com/api/products/mobile/${pid}`)
        .then(async (response) => {
          user.wishlist = [...user.wishlist, { ...response.data }];
          user.wishlistprodids = [...user.wishlistprodids, response.data.id];
          await user.save();
          res.status(200).json({ user: user });
        });
    }
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.addtocartfromwishlist = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { pid, index } = req.body;
    const user = await User.findOne({ _id: curr_id });
    var user_cart_prod;
    for (var i = 0; i < user.cart.length; i++) {
      if (user.cart[i].id === pid) {
        user_cart_prod = user.cart[i];
        break;
      }
    }
    if (user_cart_prod) {
      var cart = user.cart;
      var wishlist = user.wishlist;

      user.cart = null;
      cart[i].quantity = parseInt(cart[i].quantity) + 1;
      user.cart = [...cart];

      user.wishlist = null;
      wishlist.splice(index, 1);
      user.wishlist = [...wishlist];

      var wishlistids = user.wishlistprodids;
      user.wishlistprodids = null;
      wishlistids.splice(wishlistids.indexOf(parseInt(pid)), 1);
      user.wishlistprodids = wishlistids;
      await user.save();

      res.status(200).json({ user: user });
    } else {
      axios
        .get(`https://dusky-ecommerce.herokuapp.com/api/products/mobile/${pid}`)
        .then(async (response) => {
          user.cart = [...user.cart, { ...response.data, quantity: 1 }];
          var wishlist = user.wishlist;
          user.wishlist = null;
          wishlist.splice(index, 1);
          user.wishlist = [...wishlist];
          user.cartprodids = [...user.cartprodids, response.data.id];
          var wishlistids = user.wishlistprodids;
          user.wishlistprodids = null;
          wishlistids.splice(wishlistids.indexOf(parseInt(pid)), 1);
          user.wishlistprodids = wishlistids;
          await user.save();
          res.status(200).json({ user: user });
        });
    }
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.removefromwishlist = async function (req, res) {
  try {
    const curr_id = res.locals._id;
    const { index, pid } = req.body;
    const user = await User.findOne({ _id: curr_id });
    var wishlist = user.wishlist;
    user.wishlist = null;
    wishlist.splice(index, 1);
    user.wishlist = [...wishlist];

    var wishlistids = user.wishlistprodids;
    user.wishlistprodids = null;

    wishlistids.splice(wishlistids.indexOf(parseInt(pid)), 1);
    user.wishlistprodids = wishlistids;
    await user.save();
    
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(400).json({ message: "Please try again later." });
  }
};

exports.buycart = async function (req, res) {
    try {
        const curr_id = res.locals._id;
        const {totalamount} = req.body;
        const user = await User.findOne({ _id: curr_id });
        const data = {
            orderid: uuidv4(),
            totalamount:totalamount,
            order: [
                ...user.cart
            ]
        }
        user.cart = [];
        user.cartprodids = [];
        user.orders = [...user.orders, data]
        await user.save();
        res.status(200).json({ user: user });
    } catch (err) {
        res.status(400).json({message:"Please try again later"})
    }
}