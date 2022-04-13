const express = require("express");
//const {store} = require("./temp/store");
const {flowers} = require("./temp/flowers");
const cors = require('cors');
const {store} = require("./data_access/store");
require('dotenv').config();

const application = express();
const port = process.env.PORT || 4002;

application.use(express.json());
application.use(cors());

application.get('/', (request, response) => {
  response.status(200).json({done: true, message: 'Fine!'});
});

application.get('/register', (request,response) =>{
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;
  store.addCustomer(name,email,password)
  .then(x=> response.status(200).json({ done: true, message: 'customer added'}))
  .catch(e => {
    console.log(e);
    response.status(500).json({done: false, message: "Customer not added"})
  });
  response.status(200).json({ done: true, message: 'customer added'})
});

application.post('/login', (request,response) => {
  let password = request.body.password;
  let email = request.body.email;
  store.login(email,password)
  .then(x => {
    if(x.valid){
        response.status(200).json({ done: true, message: 'customer logged in'});
    } else {
      response.status(401).json({done: false, message: 'Something went wrong'});
    }
  })
  .catch(e => {
    console.log(e);
    response.status(500).json({done: false, message: "Customer not added"})
  });
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
