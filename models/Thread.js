const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  created_on: {
    type: Date,
    default: Date.now
  }
});

const ThreadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  bumped_on: {
    type: Date,
    default: Date.now
  },
  replies: {
    type: [ReplySchema],
    default: []
  }
});

module.exports = mongoose.model("Thread", ThreadSchema);