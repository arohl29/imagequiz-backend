const express = require("express");
//const {store} = require("./temp/store");
const {flowers} = require("./temp/flowers");
const cors = require('cors');
const {store} = require("./data_access/store");
require('dotenv').config();
var passport = require('passport');
var LocalStrategy = require('passport-local');
const Googlestrategy = require("passport-google-oauth2").Strategy;
const application = express();
const port = process.env.PORT || 4002;
let backendURL = "http://localhost:4002";
let frontendURL = "http://localhost:3000";

application.use(express.json());
application.use(cors({
  origin: frontendURL,
  credentials: true
}));

application.get('/', (request, response) => {
  response.status(200).json({done: true, message: 'Fine!'});
});

passport.use(
  new LocalStrategy({usernameField: 'email' }, function verify(username, password, cb) {
    store.login(username, password)
    .then(x => {
      if (x.valid) {
        return cb(null, x.user);
      } else {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
    })
    .catch(e => {
      console.log(e);
      cb('Something went wrong!');
    });

  }));

  passport.use(new Googlestrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendURL}/auth/google/callback`,
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    console.log('in Google strategy:');
    //console.log(profile);
    store.findOrCreateNonLocalCustomer(profile.displayName, profile.email, profile.id, profile.provider)
    .then(x => done(null,x))
    .catch(e => {
      console.log(e);
      return done('Something went wrong.');
    });
  }));

application.get('/register', (request,response) =>{
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;
  store.addCustomer(name,email,password)
  response.status(200).json({ done: true, message: 'customer added'})
});

application.post('/login', (request,response) => {
  let password = request.body.password;
  let email = request.body.email;
  store.login(email,password)
  response.status(200).json({ done: true, message: 'customer logged in'})
});

application.get('/auth/google',
passport.authenticate('google', {
  scope:
  ['email', 'profile']
}
));

application.get('/auth/googe/callback',
passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));

application.get('/auth/google/success', (request,response) => {
  console.log('/auth/google/success');
  console.log(request.user);
  response.redirect(`${frontend}/#/google/${request.user.username}/${request.user.name}`);
});

application.get('/auth/google/failure', (request,response) => {
  console.log('/auth/google/failure');
  response.redirect(`${frontend}/#/google/failed`);
});


application.get('/quiz/:id', (request, response) => {
  let id = request.params.id;
  let result = store.getQuiz(id);
  if(result.done){
    response.status(200).json({done: true, result: result.quiz})
  } else {
    response.status(404).json({done: false, message: result.message})
  }
});

application.get('/flowers', (request, response) => {
  response.status(200).json({done: true, result: flowers, message: "Done"})
});

application.post('/score', (request, response) => {
  let name = request.body.quizTaker;
  let quiz = request.body.quizName;
  let score = request.body.score;
  store.addScores(name,quiz,score);
  response.status(200).json({done: true, message: "Score added"});
});

application.get('/scores/:quiztaker/:quizname', (request, response) => {
  let name = request.params.quiztaker;
  let quiz = request.params.quizname;
  let result = store.getScore(name,quiz);
  if(result.valid){
    response.status(200).json({done: true, result: result.player.score, message: "scores found"})
  } else {
    response.status(404).json({done: false,message: "scores not found"})
  }
});


application.all('*', (request, response) => response.redirect('/'))

application.listen(port, () => {
  console.log('Listening to the port');
})
