const User = require("../models/user");
const UserSession = require("../models/UserSession");
const express = require("express");
const router = express.Router();

/* Sign up
   */
router.post("/accounts/users", (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank."
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank."
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  User.find(
    {
      email: email
    },
    (err, previousUsers) => {
      if (err) {
        console.log(err.message);
        return res.send({
          success: false,
          message: "a Error: Server error"
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Error: Account already exist."
        });
      }
      // Save the new user
      const newUser = new User();

      newUser.email = email;
      newUser.password = newUser.generateHash(password);

      newUser.save(err => {
        if (err) {
          return res.send({
            success: false,
            message: "b Error: Server error " + err
          });
        }
        return res.send({
          success: true,
          message: "Account created successfully!"
        });
      });
    }
  );
}); // end of sign up endpoint
router.post("/account/signin", (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;
  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank."
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank."
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  User.find(
    {
      email: email
    },
    (err, users) => {
      if (err) {
        console.log("err 2:", err);
        return res.send({
          success: false,
          message: "c Error: server error"
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }
      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "d Error: server error"
          });
        }
        return res.send({
          success: true,
          message: "Go Ahead",
          token: doc._id
        });
      });
    }
  );
});
router.get("/account/logout", (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    {
      $set: {
        isDeleted: true
      }
    },
    null,
    (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "e Error: Server error" + err
        });
      }
      return res.send({
        success: true,
        message: "Good"
      });
    }
  );
});
router.get("/account/verify", (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.find(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "f Error: Server error"
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "g Error: Invalid"
        });
      } else {
        // DO ACTION
        return res.send({
          success: true,
          message: "Good"
        });
      }
    }
  );
});
module.exports = router;
