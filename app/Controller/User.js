var exports = module.exports;
const UserModel = require('../Model/User.js')
const User = UserModel.model;

//GET
exports.get = function(id, done){
  User.findOne({"SteamID": id}).exec(function(err, user){
    if(err) console.log(err)
    return done(user)
  })
}
//SAVE
exports.save = function(data){
  let entry = new User(data)
  entry.save(function(err, ret){
    if(err) console.log(err)
    return ret;
  })
}
exports.update = function(id, key, val){
  let query
  if(key == "Team") {
    query = User.findOneAndUpdate({"SteamID": id}, {$set: { Team: val } })
  }
  query.exec()
}
