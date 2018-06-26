const express = require("express");
const Mono = require("../models/mono");
const User = require("../models/user");
const UserSession = require("../models/UserSession");
var passport = require("passport");
require("../config/passport")(passport);
// get an instance of express router
const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function(err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res
      .status(403)
      .send({ success: false, msg: "{fucker:'Unauthorized'}" });
  }
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
/*router.post(
  "/message",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      console.log("thar happened");
      const stat = new Mono();
      const { mono, date, user } = req.body;

      stat.mono = mono;
      stat.date = date;
      stat.user = user;
      stat.save(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
      });
    } else {
      console.log("tharp happened");
      return res
        .status(403)
        .send({ success: false, msg: "{fucker:Unauthorized}" });
    }
  }
);*/
router.post("/message", (req, res) => {
  // body parser lets us use the req.body
  console.log(getToken(req.headers));
  const stat = new Mono();
  const { mono, date, user } = req.body;

  stat.mono = mono;
  stat.date = date;
  stat.user = user;

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
getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
