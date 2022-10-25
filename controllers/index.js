/* ROUTES */

const express = require('express');
const app = express();

const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

//ADDED
const { Devnote, User } = require('../models');
//const withAuth = require('../helpers/utils');

// home - with devnotes
app.get('/devnotes', async (req, res) => {
    // Get all devnotes and JOIN with user data
    const devnoteData = await Devnote.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
      // Serialize data so the template can read it
      const devnotes = devnoteData.map((devnote) => devnote.get({ plain: true }));

      // Pass serialized data and session flag into template
      res.render('devnotes', { 
        devnotes, 
        //logged_in: req.session.logged_in
      });
});

// Post devnote
app.post('/devnotes', (req, res) => {
    
    console.info(`${req.method} request received to submit feedback`);
  
    const { name, email, devnote_body, user_id} = req.body;
  
    // If all the required properties are present
    if (name && email && devnote_body && user_id) {

      //sqlize DB create
      const newDevnote = Devnote.create({
        name,
        email,
        devnote_body,
        user_id: req.user_id,
        //user_id: req.session.user_id,
      });
  
      const response = {
        status: 'success',
        body: newDevnote,
      };
  
      res.json(response);
      console.log(response);
    } else {
      res.json('Error in posting feedback');
    }
  });

  // dashboard - user admin
app.get('/dashboard', async (req, res) => {
    const userData = await User.findOne({ where: { id: 1 } });
    console.log(userData);
    // Serialize data so the template can read it
    //const user = await userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('dashboard', { 
      dashboard, 
      //logged_in: req.session.logged_in
    });
});

// POST Route for new user
app.post('/dashboard', (req, res) => {

  const { name, email, password } = req.body;
  
    // If all the required properties are present
  if (name && email && password) {

      //sqlize DB create
      const newUser = User.create({
        name,
        email,
        password
      });
  
      const response = {
        status: 'success',
        body: newUser,
      };

    res.json(`User added successfully`);
  } else {
    res.error('Error in adding user');
  }
});

//Login and Logout
app.get('/login', (req, res) => {
  console.info(`${req.method} request received for feedback`);
  //handlebars call
  res.render('login');
  //readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


module.exports = app;
