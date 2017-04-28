// Modules
var express = require('express');
var router  = express.Router();
var multer  = require('multer');
var upload  = multer({dest: '../uploads/'});

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

module.exports = router;
