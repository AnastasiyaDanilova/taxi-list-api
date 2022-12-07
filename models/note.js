const mongoose = require('mongoose');

const noteShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  adress: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    require:true,
  }
}, { versionKey: false });

module.exports = mongoose.model('note', noteShema);