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
router.get("/message/:id", (req, res) => {
  console.log(req.params.id + "wow");
  Mono.find({ _id: req.params.id }).exec((err, mono) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    if (mono.length) {
      return res.json({
        success: true,
        message: "Message fetched by id successfully",
        mono
      });
    } else {
      return res.json({
        success: false,
        message: "Message with the given id not found"
      });
    }
  });
});

router.post("/message", (req, res) => {
  // body parser lets us use the req.body
  const stat = new Mono();
  const { mono, date } = req.body;

  stat.mono = mono;
  stat.date = date;

  stat.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.put("/message/:id", (req, res) => {
  Mono.findByIdAndUpdate(req.params.id, req.body, { new: true }, err => {
    if (err) {
      return res.json({
        success: false,
        message: "Some Error" + err,
        error: err
      });
    }

    return res.json({ success: true, message: "Updated successfully" });
  });
});

router.delete("/message/:id", function(req, res, next) {
  Mono.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    return res.json({
      success: true,
      message: req.params.id + " deleted successfully"
    });
  });
});
app.use("/", router);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
