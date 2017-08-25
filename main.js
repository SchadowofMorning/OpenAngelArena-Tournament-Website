const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const SteamStrategy = require('passport-steam')
const passport = require('passport')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
//Import Project Files
const query = require('./Model/model.js')
//Express middleware
app.use(express.static('public'))
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({
  extended: true
}))
var connection = mongoose.createConnection(process.env.ATLASURL)
app.use(session({
  store: new MongoStore({ mongooseConnection: connection}),
  secret: '30 Pieces of Silver',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + "/View/home.html")
})
app.post('/user/this', function(req, res){
  if(req.user){
    query.get("User", req.user, function(user){
      res.send(user)
    })
  } else {
    res.send(false)
  }
})
app.post('/user', function(req, res){
  let profile = query.get("User", req.body.steamid)
  res.send(profile)
})
app.get('/model/get/teams', function(req, res){
  query.get('Teams', null, function(teams){
    res.send(teams)
  })
})
app.post('/model/get/team', function(req, res){
  query.get('Team', req.body.Name, function(team){
    res.send(team)
  })
})
app.post('/model/create/team', function(req, res){
  query.get("User", req.user, function(user){
    if(user.Team){
      res.send(false)
    } else {
      query.save("Team", req.body)
    }
  })
})
app.post('/model/update/user/team', function(req, res){
  if(req.user){
    query.updateTeam(req.user, req.body.Team)
  } else {
    res.send(false)
  }
})
app.get('/invite/:team/:token', function(req, res){
  if(req.user){
    query.get("Team", req.params.team, function(team){
      if(req.params.token == team.INV_TOKEN){
        query.addPlayer(team.Name, req.user)
        res.redirect('/')
      } else {
        res.send("sorry wrong token")
      }
    })
  }
  res.redirect('/')
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
passport.use(new SteamStrategy({
  "returnURL": process.env.HOSTURL + "/login/steam/return",
  "realm": process.env.HOSTURL,
  "apiKey": process.env.API_KEY,
  "profile": true
    },
  function(identifier, profile, done) {
    query.get("User", profile._json.steamid, function(user){
      if(user == null){
        query.save("User", {SteamID: profile._json.steamid})
        return done(null, profile._json.steamid)
      } else {
        return done(null, user)
      }

    })
}))
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
