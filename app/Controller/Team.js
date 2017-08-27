var exports = module.exports;
const TeamModel = require('../Model/Team.js')
const Team = TeamModel.model;
const Token = require('rand-token')


//GET function
exports.get = function(name, done){
  let query = Team.findOne({"Name": name})
  query.exec(function(err, res){
    if(err) return err;
    return done(res)
  })
}
exports.getAll = function(done){
  Team.find({}).exec(function(err, res){
    if(err) throw err;
    return done(res)
  })
}
//SAVE function
exports.save = function(data){
  let token = Token.generate(16)
  data.INV_TOKEN = token;
  let entry = new Team(data)
  entry.save(function(err, ret){
    if(err) console.log(err);
  })
}
//ADD Player function
exports.addPlayer = function(team, player){
  Team.findOne({"Name": team}).exec(function(err, res){
    if(err) console.log(err)
    if(res.Players.includes(id)){
      return 0;
    } else {
      if(res.Players.length >= 5){
        return 1;
      } else {
        Team.findOneAndUpdate({Name: team},  {$push: {Players: player}}).exec(function(err, ret){
          return 2;
        })
      }
    }
  })
}
//REMOVE Player function
exports.removePlayer = function(team, player){
  Team.findOneAndUpdate({Name: team}, {$pull: {Players: player}}).exec(function(err, doc){
    if(doc.Players.length == 0){
      Team.remove({_id: doc._id}).exec()
    }
  })
}
