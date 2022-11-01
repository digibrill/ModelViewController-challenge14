const router = require('express').Router();
const { Devnote, User } = require('../models');
const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../utils/fsUtils');
const uuid = require('../utils/uuid');
const withAuth = require('../utils/auth');

//HOME PAGE
router.get('/dashboard', withAuth, async (req, res) => {
  // Get all devnotes and JOIN with user data
  console.log(req.session.uid);
  const devnoteData = await Devnote.findAll({
    where: {
      user_id: req.session.uid,
    },
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  })
  //const uid = req.session.user_id;
  // Serialize data so the template can read it
  const devnotes = devnoteData.map((devnote) => devnote.get({ plain: true }));
  //console.log(devnotes);
  // Pass serialized data and session flag into template
  res.render('dashboard', {
    devnotes
    //logged_in: req.session.logged_in
  });
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
  //logged_in: req.session.logged_in;
});

module.exports = router;

