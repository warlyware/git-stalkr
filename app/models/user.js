var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  image: String,
  name: String,
  email: String,
  occ: String,
  location: String,
  local: {
    email: String,
    password: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
  },
  github: {
    id: String,
    token: String,
    email: String,
    name: String,
    location: String,
    image: String,
    url: String,
    followers_url: String,
    repos: String,
    blog: String,
    public_repos: String,
    public_gists: String,
    followers: String,
    following: String
  },
  watched: []
});

module.exports = mongoose.model('User', userSchema);
