const express = require("express");
const route = express.Router();
const {authenticate,me} = require("../handlers/auth");
const auth = require("../middleware/auth");
route.get("/authcheck",auth,me)
route.post("/auth",authenticate)
module.exports = route;
