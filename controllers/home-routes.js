const router = require('express').Router();
const { Devnote, User } = require('../models');
const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../utils/fsUtils');
const uuid = require('../utils/uuid');
const withAuth = require('../utils/auth');

//HOME PAGE
router.get('/homepage', async (req, res) => {
  // Get all devnotes and JOIN with user data
  //console.log(req.session.uid);
  const devnoteData = await Devnote.findAll({
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
  res.render('homepage', {
    devnotes,
    logged_in: req.session.logged_in
  });
});

//DASHBOARD PAGE
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
    devnotes,
    logged_in: req.session.logged_in
  });
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
  logged_in: req.session.logged_in;
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    req.session.uid = dbUserData.id;
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    // Once the user successfully logs in, set up the sessions variable 'logged_in'
    req.session.save(() => {
      req.session.logged_in = true;
      //req.session.uid = 
      res.status(200)
        .json({ dbUserData, message: 'You are now logged in!' });
      //res.redirect('/dashboard');
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


//Devnote post page
router.get('/devnotes/:id', async (req, res) => {
  //console.log('test');
  const devnote = await Devnote.findOne({
    where: {
      id: req.params.id,
    },
  });
  // Serialize data so the template can read it
  //devnote = devnoteArr[0].map((devnote) => devnote.get({ plain: true }));
  
  const devnote_plain = devnote.get({plain:true});
  // Pass serialized data and session flag into template
  res.render('post', { 
    devnote_plain, 
    logged_in: req.session.logged_in
  });
});

// Logout
router.post('/logout', (req, res) => {
  // When the user logs out, destroy the session
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/login')
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;

