var express = require('express');
var router = express.Router();

// add passport for reg and login
let passport = require('passport');
let Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Welcome to Vendre',
      user: req.user
  });
});

/* GET register */
router.get('/register', function(req, res, next) {
  // load the register.ejs view
  res.render('register', {
    title: 'Please Register',
      user: null
  });
});

/* GET login */
router.get('/login', function(req, res, next) {

  let messages = req.session.messages || [];

  // clear messages from session
  req.session.messages = [];

  res.render('login', {
    title: 'Please Login',
    messages: messages,
      user: null
  });
});

/* POST register */
router.post('/register', function(req, res, next) {
  // use the Account model to create a new user account
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
      if (err) {
        console.log(err);
        res.render('error', { title: 'Create Account Error'});
      }
      res.redirect('/login');
    });
});

/* POST login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.logout();

  res.redirect('/');
});

router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);
 
router.get('/facebook/callback',
  passport.authenticate('facebook', { scope: 'email', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect products. 
    res.redirect('/products');
});

router.get('/google',
  passport.authenticate('google', { scope: 
  	[ 'https://www.googleapis.com/auth/plus.login',
  	, 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
 
router.get( '/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/products',
        failureRedirect: '/login'
}));

module.exports = router;
