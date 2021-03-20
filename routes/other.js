const express = require("express");
const route = express.Router();
const {addtocart,updatequantity,deleteproductfromcart,addtowishlist,addtocartfromwishlist,removefromwishlist,buycart} = require("../handlers/other");
const auth = require("../middleware/auth");

route.post("/addtocart", auth, addtocart);
route.post("/updatequantity", auth, updatequantity);
route.post("/deleteproductfromcart", auth, deleteproductfromcart);
route.post("/addtowishlist", auth, addtowishlist);
route.post("/addtocartfromwishlist", auth, addtocartfromwishlist);
route.post("/removefromwishlist",auth,removefromwishlist)
route.post("/buycart",auth,buycart)

module.exports = route;
