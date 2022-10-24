const express = require('express');
const app = express();

const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// home - with devnotes
app.get('/', (req, res) => {
  console.info(`${req.method} request received for feedback`);
  //handlebars call
  res.render('home');
  //readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
});

// dashboard - user admin
app.get('/dashboard', (req, res) => {
    console.info(`${req.method} request received for feedback`);
    //handlebars call
    res.render('dashboard');
    //readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
  });

//Login
app.get('/login', (req, res) => {
    console.info(`${req.method} request received for feedback`);
    //handlebars call
    res.render('login');
    //readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
  });

// Post blog
/*app.post('/', (req, res) => {
    
    console.info(`${req.method} request received to submit feedback`);
  
    const { email, feedbackType, feedback } = req.body;
  
    // If all the required properties are present
    if (email && feedbackType && feedback) {
      // Variable for the object we will save
      const newFeedback = {
        email,
        feedbackType,
        feedback,
        feedback_id: uuid(),
      };
  
      readAndAppend(newFeedback, './db/feedback.json');
  
      const response = {
        status: 'success',
        body: newFeedback,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting feedback');
    }
  });*/


// POST Route for a new UX/UI tip
/*tips.post('/', (req, res) => {
  console.info(`${req.method} request received to add a tip`);
  console.log(req.body);

  const { username, topic, tip } = req.body;

  if (req.body) {
    const newTip = {
      username,
      tip,
      topic,
      tip_id: uuid(),
    };

    readAndAppend(newTip, './db/tips.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});*/

module.exports = app;
