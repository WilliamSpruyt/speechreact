// first we import our dependencies…
var passport = require("passport");
var expressSession = require("express-session");

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// and create our instances
const app = express();
const router = require("./routes/message.routes");
const loginRouter = require("./routes/sign.in");
var cors = require("cors");

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.PORT || 3001;
// db config -- set your URI from mLab in secrets.js

mongoose.connect(process.env.DB_KEY);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
// now we should configure the API to use bodyParser and look for JSON data in the request body

app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

app.use("/", router);
app.use("/", loginRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
