// Modules
var express       = require('express');
var router        = express.Router();
var multer        = require('multer');
var upload        = multer({dest: '../uploads/'});
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash         = require('connect-flash');

// Mongoose Schema module
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  next();
});

// Register
router.get('/register', function(req, res, next) {
  res.render('register', {flag: "Register"})
});

// Login
router.get('/login', function(req, res, next) {
  res.render('login', {flag: 'Login'})
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: "Invalid username or password" }),
  function(req, res) {
    req.flash('success', 'You are now logged in !');
    res.redirect('/');
  });

// Passport Session handling
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Passport Local Strategy
passport.use(new LocalStrategy(function(username, password, done) {

    User.getUserByUsername(username, function(err, user) {

      if (err) throw err;
      if (!user) return done(null, false, { message: 'Invalid Username.'});

      User.comparePassword(password, user.password, function(err, isMatch) {

        if (err) return done(err);
        if (isMatch) return done(null, user);
        else return done(null, false, { message: 'Invalid Password.'})

      });

    });

  }
));

// Register Post
router.post('/register', upload.single('profileImage'),function(req, res, next) {

  // Get fields values
  var name      = req.body.name;
  var email     = req.body.email;
  var username  = req.body.username;
  var password  = req.body.password;
  var password2 = req.body.password2;

  // Check if file uploaded
  if (req.file) {
    console.log("Got the file" + req.file.filename);
    var profileImage = req.file.filename;
  }

  else {
    console.log("No file uploaded");
    var profileImage = "noimage.jpg";
  }

  // Form validation
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email field is not valid").isEmail();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Password2 does not match").equals(req.body.password);

  // Validation errors
  var errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  }

  else {

    var newUser = new User({

      name          : name,
      email         : email,
      username      : username,
      password      : password,
      profileImage  : profileImage

    });

    User.createUser(newUser, function(err, user){
      if (err) throw err;
      console.log(user);
    });

    res.location('/');
    res.redirect('/');

  }

});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out !');
  res.redirect('/users/login');
});

module.exports = router;
