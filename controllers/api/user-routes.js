const router = require('express').Router();
const { User, Devnote } = require('../../models');
//const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../../utils/fsUtils');
const uuid = require('../../utils/uuid');
const withAuth = require('../../utils/auth');

// POST one devnote
router.post('/devnotes', (req, res) => {
    
  console.info(`${req.method} request received to submit feedback`);

  const { name, devnote_body} = req.body;

  // If all the required properties are present
  if (name && devnote_body) {

    //sqlize DB create
    const newDevnote = Devnote.create({
      name,
      devnote_body,
      user_id: req.session.uid,
      //user_id: req.body.user_id
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


// CREATE new user
router.post('/', async (req, res) => {
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
    // Set up sessions with a 'logged_in' variable set to `true`
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// Login
router.post('/changePassword', async (req, res) => {
  try {
    const dbUserUpdate = await User.update({
      password: req.body.password
    },{
      where: {
        id: req.body.user_id//req.session.uid,
      },
    });
  }catch(err){
    console.log('ERROR: ', err);
  }
});

module.exports = router;
