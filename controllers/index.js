/* ROUTES */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

const withAuth = require('../helpers/auth');

const {
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'Secret secret secrettttt',
  SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';
const users =[
  {id:1, name:'J.C.', email: 'jchalresberry@gmail.com', password: 'secret'},
  {id:2, name:'jen', email: 'jenberry@mac.com', password: 'secret'},
  {id:3, name:'jussara', email: 'jusberry1@gmail.com', password: 'secret'}
];

const { Devnote, User } = require('../models');
//const withAuth = require('../helpers/utils');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUnitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
})

const redirectLogin = (req, res, next) => {
  if(!req.session.userId){
    res.redirect('/login')
  } else{
    next()
  }
}
const redirectHome = (req, res, next) => {
  if(req.session.userId){
    res.redirect('/home')
  } else{
    next()
  }
}

app.use((req, res, next) => {
  const { userId } = req.session;
  if(userId){
    res.locals.user = users.find(
      user => user.id === userId
    )
  }
  next();
})

// home - with devnotes

app.get('/devnotes', async (req, res) => {
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

// Post devnote
app.post('/devnotes', (req, res) => {
    
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

  // dashboard - user admin
app.get('/dashboard', withAuth, async (req, res) => {
    console.log(req.session);
    //res.send('test');
    /*const userData = await User.findOne({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });*/
    //console.log(userId);
    // Serialize data so the template can read it
    //const dashboard = await userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      //dashboard,
      //logged_in: req.session.logged_in
    });
});

// POST Route for new user
app.post('/dashboard', withAuth, (req, res) => {

  const { name, email, password } = req.body;
  
    // If all the required properties are present
  if (name && email && password) {

      //sqlize DB create
      const newUser = User.create({
        name,
        email,
        password
      });
  
      const response = {
        status: 'success',
        body: newUser,
      };

    res.json(`User added successfully`);
  } else {
    //res.error('Error in adding user');
  }
});
















//LANDING PAGE
app.get('/', withAuth, (req, res) => {
  //const { userId } = req.session;
  //console.log(userId);
  const userId = 1;
  res.send(`
  <h1>Welcome</h1>
  ${userId ? `<a href='/home'>Home</a>
  <a href='/logout'>Logout</a>` : `
  <a href='/login'>Login</a>
  <a href='/register'>Register</a>
  `}`);
  //const { userId } = req.session;
  console.log(req.session);

});
//HOME
app.get('/home' withAuth, redirectLogin, (req, res) => {
  const { user } = res.locals;
  res.send(`
  <h1>Home</h1>
  <a href='/'>Main</a>
  <ul>
  <li>Name: ${user.name}</li>
  <li>Email: ${user.email}</li>
  </ul>`);
});

/*app.get('/profile', redirectLogin, (req.res) => {
  const { user } = res.locals;
})*/

//DASHBOARD
/*app.get('/dashboard', (req, res) => {
  console.info(`${req.method} request received for feedback`);
  res.render('login');
  console.log(req.session);
});*/

//Login and register GET
//USER CAN LOG IN HERE -FORM AND INPUTS
app.get('/login', redirectHome, (req, res) => {
  res.send(`
  <h1>Login</h1>
  <form method='post' action='/login'>
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='Password' required />
    <input type='submit' />
  </form>
  <a href='/register'>Register</a>
  `);
});
//USE CAN REGISTER HERE
app.get('/register', withAuth, redirectHome, (req, res) => {
  res.send(`
  <h1>Register</h1>
  <form method='post' action='/register'>
    <input name='name' placeholder='Name' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='Password' required />
    <input type='submit' />
  </form>
  <a href='/login'>Login</a>
  `);
});

//Login and register POST
//POST EMAIL AND PW
app.post('/login', redirectHome, (req, res) => {
  const { email, password } = req.body;
  if(email && password){//VALIDATE
    const user = users.find(
      user => user.email === email && user.password
    )
    if(user){
      req.session.userId = user.id
      return res.redirect('/home')
    }
  }
  res.redirect('/login');
});

//POST NEW USER
app.post('/register', redirectHome, (req, res) => {
  const { name, email, password } = req.body;
  if(name && email && password){//VALIDATE
    const exists = users.some(
      user => user.email === email
    )
    if(!exists){
      const user = {
        id: users.length + 1,
        name,
        email,
        password
      }
      users.push(user)

      req.session.userId = user.id;

      return res.redirect('/home')
    }
  }
  res.redirect('/register') //Todo qs for errors
});

//Login and Logout
app.post('/user', redirectLogin, (req, res) => {
  console.log(req.session);
  res.send('test');
  /*const userData = await User.findOne({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
  });*/
    //console.log(userId);
    // Serialize data so the template can read it
    //const dashboard = await userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    //res.render('dashboard', {
      //session,
      //logged_in: req.session.logged_in
    //});
  //readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if(err){
        return res.redirect('/home')
      }
      res.clearCookie(SESS_NAME);
      res.redirect('/login');
});

module.exports = app;
