const express = require('express');
const app = express();

const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

//ADDED
const { Devnote, User } = require('../models');
//const withAuth = require('../helpers/utils');

// home - with devnotes
app.get('/', async (req, res) => {
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

// Post devnote
app.post('/', (req, res) => {
    
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
