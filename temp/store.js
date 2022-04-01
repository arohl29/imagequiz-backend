const bcrypt = require('bcrypt');
let { customers } = require('../temp/customers.js');
let { quizzes } = require('../temp/data.js');

let store = {
  addCustomer: (name, email, password) => {
    customers.push({id: 1,name: name, email: email, password: password});
  },

  login: (email,password) => {
    let customer = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(customer) {
      let valid = password, customer.password;
      if(valid){
        return{valid: true};
      } else {
        return{valid: false, message: 'Credemtials invalid'};
      }
    } else {
      return{valid: false, message: 'Email invalid'}
    }
  },

  getQuiz: (id) => {
    let quiz = quizzes.find(x => x.name.toLowerCase() === id.toLowerCase());
    if(quiz){
      return {done:true, quiz};
    } else {
      return{done:false, message: 'Quiz not found'};
    }
  }
}
module.exports = {store};
