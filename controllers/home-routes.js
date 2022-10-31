const router = require('express').Router();
const { Devnote, User } = require('../models');
const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../utils/fsUtils');
const uuid = require('../utils/uuid');
const withAuth = require('../utils/auth');

//HOME PAGE
router.get('/devnotes', withAuth, async (req, res) => {
  // Get all devnotes and JOIN with user data
  //console.log(req.session.user_id);
  const devnoteData = await Devnote.findAll({
    /*where: {
      user_id: req.session.user_id,
    },*/
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
  });
  // Serialize data so the template can read it
  const devnotes = devnoteData.map((devnote) => devnote.get({ plain: true }));
  // console.log(req.session.user_id);
  // Pass serialized data and session flag into template
  res.render('devnotes', {
    devnotes,
    logged_in: req.session.logged_in
  });
});

// POST one devnote
router.post('/devnotes', withAuth, (req, res) => {
    
  console.info(`${req.method} request received to submit feedback`);

  const { name, devnote_body} = req.body;

  // If all the required properties are present
  if (name && devnote_body) {

    //sqlize DB create
    const newDevnote = Devnote.create({
      name,
      devnote_body,
      user_id: req.session.user_id,
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
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/devnotes');
    return;
  }
  res.render('login');
  //loggedIn: req.session.loggedIn;
});

module.exports = router;
