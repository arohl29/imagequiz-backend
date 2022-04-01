const express = require("express");
const {store} = require('/store');

const application = express();
const port = 4002;

application.use(express.json());

application.get('/', (req, res) => {
  res.status(200).json({done: true, message: 'Fine!'});
});

application.post('/register', (req,res) =>{
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  store.addCustomer(name, email,password);
  res.status(200).json({done: true, message: "Customer added"})
});

application.post('/login', (req,res) => {
  let name = req.body.name;
  let email = req.body.email;
  let result = store.login(email,password);
  if(result.valid){
    res.status(200).json({done: true, message: "Customer logged in"})
  } else {
    res.status(401).json({done: false, message: result.message})
  }
});

application.get('/quiz/:id', (req, res) => {
  let id = req.params.id;
  let result = store.getQuiz(id);
  if(result.done){
    res.status(200).json({done: true, result: result.quiz})
  } else {
    res.status(404).json({done: false, message: result.message})
  }
})

application.listen(port, () => {
  console.log('Listening to the port ${port}');
})
