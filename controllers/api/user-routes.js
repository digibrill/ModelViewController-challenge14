const router = require('express').Router();
const { User, Devnote } = require('../../models');
//const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../../utils/fsUtils');
const uuid = require('../../utils/uuid');
const withAuth = require('../../utils/auth');

//USER HOME
router.get('/', withAuth, async (req, res) => {
  //console.log('test');
  const userData = await User.findOne({
    where: [
      {
        user_id: req.session.user_id,
      },
    ],
  });
  //console.log(userData);
  // Serialize data so the template can read it
  const users = userData.map((user) => user.get({ plain: true }));
  //console.log(users);
  // Pass serialized data and session flag into template
  res.render('users', { 
    users, 
    logged_in: req.session.logged_in
  });
});

// CREATE new user
router.post('/', withAuth, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });

    const response = {
      status: 'success',
      body: newUser,
    };
    // Set up sessions with a 'loggedIn' variable set to `true`
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

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

    // Once the user successfully logs in, set up the sessions variable 'loggedIn'
    req.session.save(() => {
      req.session.loggedIn = true;

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  // When the user logs out, destroy the session
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
