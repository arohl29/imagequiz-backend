const bcrypt = require('bcrypt');
let { customers } = require('../temp/customers.js');
let { quizzes } = require('../temp/data.js');
let { scores } = require('../temp/scores.js');

let store = {
  addCustomer: (name, email, password) => {
    customers.push({id: 1,name: name, email: email, password: password});
  },

  login: (email,password) => {
    let customer = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(customer) {
      let valid = password === customer.password;
      if(valid){
        return{valid: true};
      } else {
        return{valid: false, message: 'Credentials invalid'};
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
  },

  addScores: (quizTaker, quizName, score) => {
    scores.push({quizTaker: quizTaker, quizName: quizName, score: score});
  },

  getScore: (quiztaker, quizname) => {
    let player = scores.find(x => x.quizTaker.toLowerCase() === quiztaker.toLowerCase());
    if(player) {
      let valid = quizname.toLowerCase() === player.quizName.toLowerCase();
      console.log(valid);
      if(valid){
        return{valid: true, player};
      } else {
        return{valid: false, message: 'quizname invalid'};
      }
    } else {
      return{valid: false, message: 'quiztaker invalid'}
    }
  }
}
module.exports = {store};
