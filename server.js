// first we import our dependencies…
const express = require("express");
const path = require("path");
require("dotenv").config();

const Mono = require("./models/mono");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// and create our instances
const app = express();
const router = express.Router();
var cors = require("cors");

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.PORT || 3001;
// db config -- set your URI from mLab in secrets.js

mongoose.connect(
  "mongodb://Admin:fuckw1t@ds147190.mlab.com:47190/intereriormonolog"
);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());
// now we can set the route path & initialize the API
router.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});
router.get("/message", (req, res) => {
  Mono.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});

router.post("/message", (req, res) => {
  const stat = new Mono();
  // body parser lets us use the req.body
  const { mono, date } = req.body;

  stat.mono = mono;
  stat.date = date;

  stat.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});
app.use("/", router);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
