const mongoose = require('mongoose');

// Embedded schema for a single pantry item
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

// Parent User schema with embedded pantry array
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [foodSchema],
});

module.exports = mongoose.model('User', userSchema);