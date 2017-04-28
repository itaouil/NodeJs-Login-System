// Modules
var mongoose = require('mongoose');

// Mongoose ORM connection
mongoose.connect('mongodb://localhost/nodeauth');

// Database connection
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({

  name: {
    type : String,
    index: true
  },

  email: {
    type: String
  },

  username: {
    type: String
  },

  password: {
    type: String
  },

  profileImage: {
    type: String
  }

});

// Export
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callaback) {
  newUser.save(callaback);
};
