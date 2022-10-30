const router = require('express').Router();
const { User } = require('../../models');
//const bodyParser = require('body-parser');

router.get('/users',  (req, res) => {
  console.log('runs!');
  const userData = User.findAll({
    /*include: [
      {
        model: Devnote,
        attributes: ['devnote_body'],
      },
    ],*/
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

// CREATE new user
router.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = User.create({
      name,
      email,
      password,
    });

    const response = {
      status: 'success',
      body: newUser,
    };
    // Set up sessions with a 'loggedIn' variable set to `true`
    /*req.session.save(() => {
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });*/
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
