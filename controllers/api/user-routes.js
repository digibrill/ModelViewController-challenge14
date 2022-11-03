const router = require('express').Router();
const { User, Devnote } = require('../../models');
const { readFromFile, readAndAppend } = require('../../utils/fsUtils');
const uuid = require('../../utils/uuid');
const withAuth = require('../../utils/auth');

// POST one devnote
router.post('/devnotes', (req, res) => {
    
  console.info(`${req.method} request received to submit feedback`);

  const { name, devnote_body } = req.body;

  // If all the required properties are present
  if (name && devnote_body) {

    //sqlize DB create
    const newDevnote = Devnote.create({
      name,
      devnote_body,
      user_id: req.session.uid,
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

//UPDATE NOTE
router.put('/devnotes/:id', async (req, res) => {
    const [updated] = await Devnote.update({
      name: req.body.devnotetitle,
      devnote_body: req.body.devnotebody},
      { where: { id: req.body.id }},
    );
    return res.status(200).json({});
});

//DELETE NOTE
router.delete('/devnotes/:id', async (req, res) => {
  try {
    const deleted = await Devnote.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send("Your note has been deleted");
      res.redirect('/dashboard');
    }
    throw new Error("Your note was not found");
  } catch (error) {
    console.log('not deleted');
    return res.status(500).send(error.message);
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
        id: req.body.user_id
      },
    });
  }catch(err){
    console.log('ERROR: ', err);
  }
});

module.exports = router;
