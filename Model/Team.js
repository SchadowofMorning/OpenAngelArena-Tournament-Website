var exports = module.exports;
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TeamSchema = new Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Players: {
    type: [String]
  },
  Leader: {
    type: String,
    required: true
  },
  INV_TOKEN :{
    type: String
  }
})

exports.model = mongoose.model('Team', TeamSchema)
