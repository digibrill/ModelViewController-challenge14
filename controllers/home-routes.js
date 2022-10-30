const router = require('express').Router();
const { Devnote, User } = require('../models');
const bodyParser = require('body-parser');
//const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
//const uuid = require('../helpers/uuid');
//const withAuth = require('../helpers/auth');

router.get('/', async (req, res) => {
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
  console.log(devnotes);
  // Pass serialized data and session flag into template
  res.render('devnotes', { 
    devnotes, 
    //logged_in: req.session.logged_in
  });
});

// POST one devnote
router.post('/devnotes', (req, res) => {
    
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

// Login route
router.get('/login', (req, res) => {
  console.log('ran');
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // Otherwise, render the 'login' template
  res.render('login');//loggedIn: req.session.loggedIn,
});

/* TESTED THIS OUT BECAUSE API FOLDER NOT WORKING!
router.get('/users',  (req, res) => {
  console.log('runs!');
  const userData = User.findAll({
    /*include: [
      {
        model: Devnote,
        attributes: ['devnote_body'],
      },
    ],
  });
  // Serialize data so the template can read it
  const users = userData.map((user) => user.get({ plain: true }));
  console.log(users);
  // Pass serialized data and session flag into template
  res.render('users', { 
    users, 
    //logged_in: req.session.logged_in
  });
});
*/

module.exports = router;
