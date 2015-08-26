var express = require('express');
var router = express.Router();
var github = require('octonode');
var client = github.client({
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});

/* GET users listing. */

router.get('/user/:id', function(req, res, next) {
  var gitUser = req.params.id;
  client.get('/users/' + gitUser, {}, function (err, status, user, headers) {
    console.log(user); //json object
    res.json(user);
  });
});

module.exports = router;
