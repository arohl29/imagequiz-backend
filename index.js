const express = require("express");
//const {store} = require("./temp/store");
const {flowers} = require("./temp/flowers");
const cors = require('cors');
const {store} = require("./data_access/store");
require('dotenv').config();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oidc');

const application = express();
const port = process.env.PORT || 4002;

application.use(express.json());
application.use(cors());

application.get('/', (request, response) => {
  response.status(200).json({done: true, message: 'Fine!'});
});

passport.use(new GoogleStrategy({
    clientID: process.env['878154857984-f700tdukle79k71modlpunnrfv22c7al.apps.googleusercontent.com'],
    clientSecret: process.env['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'],
    callbackURL: 'https://www.example.com/oauth2/redirect/google'
  },
  function(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      if (!cred) {
        // The Google account has not logged in to this app before.  Create a
        // new user record and link it to the Google account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }

          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id.toString(),
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The Google account has previously logged in to the app.  Get the
        // user record linked to the Google account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    };
  }
));

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
