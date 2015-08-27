var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  image: String,
  id: String,
  name: String,
  email: String,
  occ: String,
  watching: [],
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
    type: String,
    blog: String,
    public_repos: String,
    public_gists: String,
    followers: String,
    following: String

  },
  watched: {
    id: String,
    image: String,
    url: String,
    followers_url: String,
    repos: String,
    type: String,
    name: String,
    username: String,
    blog: String,
    location: String,
    email: String,
    public_repos: String,
    public_gists: String,
    followers: String,
    following: String
  }
});

module.exports = mongoose.model('User', userSchema);
