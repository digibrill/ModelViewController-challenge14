const router = require('express').Router();
const { Devnote, User, Comment } = require('../models');
const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../utils/fsUtils');
const uuid = require('../utils/uuid');
const withAuth = require('../utils/auth');

//HOME PAGE
router.get('/homepage', withAuth, async (req, res) => {
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
  const devnoteData = await Devnote.findAll({
    where: {
      user_id: req.session.uid,
    },
    include: [
      {
        model: Comment,
        //as: "comment"
      },
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  })
  
  const devnotes = devnoteData.map((devnote) => devnote.get({ plain: true }));

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

    req.session.save(() => {
      req.session.logged_in = true;
      res.status(200)
        .json({ dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


//Devnote post page
router.get('/devnotes/:id', async (req, res) => {
  const devnote = await Devnote.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Comment,
        include: [
          {
            model: User,
          }
        ]
      },
      {
        model: User,
      }
    ]
  });
  if(devnote){
    const devnote_plain = devnote.get({plain:true});
    res.render('post', { 
      devnote_plain, 
      logged_in: req.session.logged_in
    });
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/login')
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

module.exports = router;

