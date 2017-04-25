// Modules
var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer        = require('multer');
var flash         = require('connect-flash');
var mongodb       = require('mongodb');
var mongoose      = require('mongoose');

// Database connection instance
var db = mongoose.connection;

// Routes modules
var index = require('./routes/index');
var users = require('./routes/users');

// Express instance
var app = express();

// Engine's view setup (jade/pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes middlewares usage
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
