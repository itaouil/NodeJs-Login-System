var express = require('express');
var router  = express.Router();
var multer  = require('multer');
var upload  = multer({dest: "../uploads"});

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
router.post('/register', upload.single(),function(req, res, next) {

  // Get fields values
  var name      = req.body.name;
  var email     = req.body.email;
  var username  = req.body.username;
  var password  = req.body.password;
  var password2 = req.body.password2;

  // Check if file uploaded
  if (req.file) {
    var profileImage = req.file.filename;
  }

  else {
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
    console.log("No errors");
  }

});

module.exports = router;
