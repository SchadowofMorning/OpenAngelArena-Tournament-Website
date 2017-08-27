var exports = module.exports;
const mongoose = require('mongoose')
//Controller files
const Team = require('./Team.js')
const User = require('./User.js')
//Mongoose Connection
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
}
exports.connection = mongoose.connect(process.env.MONGOURL, options)

exports.Team = Team;
exports.User = User;

exports.removePlayer = function(team, player){
  Team.removePlayer(team, player)
  User.update(player, "Team", "")
}
