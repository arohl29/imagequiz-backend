const expresponses = requestuire("expresponses");
const {store} = requestuire('/store');

const application = expresponses();
const port = 4002;

application.use(expresponses.json());

application.get('/', (request, response) => {
  response.status(200).json({done: true, message: 'Fine!'});
});

application.post('/register', (request,response) =>{
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;
  store.addCustomer(name, email,password);
  response.status(200).json({done: true, message: "Customer added"})
});

application.post('/login', (request,response) => {
  let name = request.body.name;
  let email = request.body.email;
  let responseult = store.login(email,password);
  if(responseult.valid){
    response.status(200).json({done: true, message: "Customer logged in"})
  } else {
    response.status(401).json({done: false, message: responseult.message})
  }
});

application.get('/quiz/:id', (request, response) => {
  let id = request.params.id;
  let responseult = store.getQuiz(id);
  if(responseult.done){
    response.status(200).json({done: true, responseult: responseult.quiz})
  } else {
    response.status(404).json({done: false, message: responseult.message})
  }
})

application.listen(port, () => {
  console.log('Listening to the port ${port}');
})
