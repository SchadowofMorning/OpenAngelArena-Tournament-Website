var exports = module.exports;
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = new Schema({
  SteamID: {
    type: String,
    required: true,
    unique: true
  },
  Team: {
    type: String,
    default: ""
  }
})

exports.model = mongoose.model('User', UserSchema)
