const bcrypt = require('bcrypt');
let { customers } = require('/customers');
let { quizzes } = require('/data');

let store = {
  addCustomer: (name, email, password) => {
    const hash = bcrypt.hashSync(password, 10);
    customer.push({id: 1,name: name, email: email, password: hash});
  },

  login(email,password) => {
    let customer = customer.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(customer) {
      let valid = bcrypt.compareSync(password, customer.password);
      if(valid){
        return{valid: true};
      } else {
        return{valid: false, message: 'Credemtials invalid'}
      }
    } else {
      return{valid: false, message: 'Email invalid'}
    }
  },

  getQuiz: (id) => {
    let quiz = quizzes.find(x = x.name.toLowerCase() === id.toLowerCase());
    if(quiz){
      return {done:true, quiz};
    } else {
      return(done:false, message: 'Quiz not found')
    }
  }
}
module.exports = {store};
