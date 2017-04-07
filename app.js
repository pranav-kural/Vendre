var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport dependencies
let passport = require('passport');
let session = require('express-session'); // use express session for session management
let localStrategy = require('passport-local').Strategy;

// Index routes
var index = require('./controllers/index');
// reference the products controller
var products = require('./controllers/products');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
// link to config file
var globals = require('./config/globals');
// Connect to MLab
mongoose.connect(globals.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Node favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport and sessions
app.use(session({
    secret: 'some salt value here',
    resave: true,
    saveUninitialized: false
}));

// Initialize passport service and session
app.use(passport.initialize());
app.use(passport.session());

// link to the new Account model
let Account = require('./models/account');
passport.use(Account.createStrategy());

// Setting up Facebook auth
let FacebookStrategy = require('passport-facebook');

passport.use(new FacebookStrategy({
    clientID: globals.facebook.clientID,
    clientSecret: globals.facebook.clientSecret,
    callbackURL: globals.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Setting up Google+ auth

// import the required module for google auth
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
 // instantiate and use the GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: globals.google.clientID,
    clientSecret: globals.google.clientSecret,
    callbackURL: globals.google.callbackURL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
      return done(err, user);
    });
  }
));

// Serialize and seserialize users for authentication through the DB
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// App routing
app.use('/', index);
app.use('/products', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'COMP2068 - Book Store',
    user: req.user
  });
});

module.exports = app;