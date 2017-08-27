const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const SteamStrategy = require('passport-steam')
const passport = require('passport')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
//Import Project Files
const ctrl = require('./Controller/index.js')
//Express middleware
app.use(express.static('public'))
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({
  extended: true
}))
//MongoStore
var mongostore = new MongoStore({
  mongooseConnection: ctrl.msconnector,
  url: process.env.MONGOURL
})
//Session
app.use(session({
  store: mongostore,
  secret: '30 Pieces of Silver',
  resave: true,
  saveUninitialized: true
}))
//Passport init
app.use(passport.initialize())
app.use(passport.session())
//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + "/View/home.html")
})
app.post('/user/this', function(req, res){
  if(req.user){
    ctrl.User.get(req.user, function(user){
      res.send(user)
    })
  } else {
    res.send(false)
  }
})
app.post('/user', function(req, res){
  let profile = ctrl.User.get(req.body.steamid)
  res.send(profile)
})
app.get('/model/get/teams', function(req, res){
  ctrl.Team.getAll(function(teams){
    res.send(teams)
  })
})
app.post('/model/get/team', function(req, res){
  ctrl.Team.get(req.body.Name, function(team){
    res.send(team)
  })
})
app.post('/model/create/team', function(req, res){
  ctrl.User.get(req.user, function(user){
    if(user.Team){
      res.send(false)
    } else {
      var writedata = {
        "Name": req.body.Name,
        "Leader": req.body.Leader,
        "Players": [req.body.Leader]
      };
      ctrl.Team.save(writedata)
      res.send(true)
    }
  })
})
app.post('/model/update/user/team', function(req, res){
  if(req.user){
    ctrl.User.update(req.user, "Team" , req.body.Team)
    res.send(true)
  } else {
    res.send(false)
  }
})
app.post('/model/remove/team/player', function(req, res){
  if(req.user){
    ctrl.removePlayer(req.body.Team, req.body.Name)
  }
})
app.get('/invite/:team/:token', function(req, res){
  if(req.user){
    ctrl.Team.get(req.params.team, function(team){
      if(req.params.token == team.INV_TOKEN){
        ctrl.Team.addPlayer(team.Name, req.user)
        res.redirect('/')
      } else {
        res.send("sorry wrong token")
      }
    })
  }
})
//Passport Routes
app.get('/login/steam', passport.authenticate('steam'),function(req, res){})
app.get('/login/steam/return',
  passport.authenticate('steam', { failureRedirect: process.env.HOSTURL + '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});
//SteamStrategy
var strategy = new SteamStrategy({
  "returnURL": process.env.HOSTURL + "/login/steam/return",
  "realm": process.env.HOSTURL,
  "apiKey": process.env.API_KEY,
  "profile": true
    },
  function(identifier, profile, done) {
    ctrl.User.get(profile._json.steamid, function(user){
      if(user == null){
        ctrl.User.save({"SteamID": profile._json.steamid})
        return done(null, profile._json.steamid)
      } else {
        return done(null, user)
      }
    })
})
passport.use(strategy)
//Passport Serialization
passport.serializeUser(function(user, done){
  if(user.SteamID) {
      done(null, user.SteamID)
    } else {
      done(null, user)
    }
})
passport.deserializeUser(function(id, done){
  done(null, id)
})

app.listen(process.env.PORT, function(){
  console.log(process.env.PORT)
  console.log('OAA-GT is running')
})
