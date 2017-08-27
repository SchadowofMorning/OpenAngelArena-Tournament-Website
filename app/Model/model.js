var model = module.exports;
const mongoose = require('mongoose')
const TeamModel = require('./Team.js')
const UserModel = require('./User.js')
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
}
const Schema = mongoose.Schema

var Team = TeamModel.model;
var User = UserModel.model;


model.connection = mongoose.connect(process.env.MONGOURL, options)
model.msconnector = mongoose.createConnection(process.env.MONGOURL, options)
model.get = function(type, ident, done){
  let query
  var result
  if(type == "User"){
    query = User.findOne({"SteamID": ident})
  }
  if(type == "Teams"){
    query = Team.find({})
  }
  if(type == "Team"){
    query = Team.findOne({"Name": ident})
  }
  query.exec(function(err, res){
    if(err) throw err;
    done(res)
  })
}
model.save = function(type, data){
  let entry
  if(type == "User"){
    entry = new User(data)
  }
  if(type == "Team"){
    let token = Token.generate(16)
    data.INV_TOKEN = token;
    entry = new Team(data)
  }
  entry.save(function(err, ret){
    if(err) {
      console.log(err)
    }
  })
}
model.updateTeam = function(id, name){
  User.findOneAndUpdate({SteamID: id},  {$set: { Team: name } }).exec(function(err, res){
    console.log(res)
  })
}

model.addPlayer = function(name, id){
  model.get('Team', name, function(res){
    if(res.Players.includes(id)){
      console.log("player already in the team")
    } else {
      if(res.Players.length >= 5){
        console.log("Team already full")
      } else {
        Team.findOneAndUpdate({Name: name},  {$push: {Players: id}}).exec(function(err, doc){
        })
      }
    }
  })
}
model.removePlayer = function(team, id){
  Team.findOneAndUpdate({Name: team}, {$pull: {Players: id}}).exec(function(err, doc){
    console.log(doc)
    if(doc.Players.length == 0){
      Team.remove({_id: doc._id}).exec()
    }
  })
  User.findOneAndUpdate({SteamID: id}, {$set: {Team: ""}}).exec()

}
