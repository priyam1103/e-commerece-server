const bodyParser = require("body-parser");
module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api/user", require("../routes/auth"));
  app.use("/api/user/work", require("../routes/other"));
};
