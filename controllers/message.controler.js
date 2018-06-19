const mongoose = require("mongoose");
const Mono = require("../models/mono");

function getMessages(req, res) {
  Mono.find().exec((err, todos) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    return res.json({
      success: true,
      message: "Todos fetched successfully",
      todos
    });
  });
}
addMessage = (req, res) => {
  const newMessage = new Message(req.body);
  newMessage.save((err, message) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    return res.json({
      success: true,
      message: "Message added successfully",
      message
    });
  });
};
updateMessage = (req, res) => {
  Message.findOneAndUpdate(
    { _id: req.body.id },
    req.body,
    { new: true },
    (err, todo) => {
      if (err) {
        return res.json({ success: false, message: "Some Error", error: err });
      }
      console.log(todo);
      return res.json({ success: true, message: "Updated successfully", todo });
    }
  );
};
getMessage = (req, res) => {
  Message.find({ _id: req.params.id }).exec((err, todo) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    if (todo.length) {
      return res.json({
        success: true,
        message: "Message fetched by id successfully",
        todo
      });
    } else {
      return res.json({
        success: false,
        message: "Message with the given id not found"
      });
    }
  });
};
deleteMessage = (req, res) => {
  Message.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) {
      return res.json({ success: false, message: "Some Error" });
    }
    return res.json({
      success: true,
      message: todo.todoText + " deleted successfully"
    });
  });
};
module.exports.getMessages;
module.exports.addMessage;
module.exports.updateMessage;
module.exports.getMessage;
module.exports.deleteMessage;
