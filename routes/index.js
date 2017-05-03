var express = require('express');
var router = express.Router();

// Memebers
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', {flag: 'Members'});
});

// Authentication function
function ensureAuthenticated(req, res, next) {

  if (req.isAuthenticated)
    return next();

  else
    res.redirect('/users/login');

}

module.exports = router;
