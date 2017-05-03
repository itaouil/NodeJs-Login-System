// Modules
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

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

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
}

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
};
