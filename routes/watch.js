var express = require('express');
var router = express.Router();
var github = require('octonode');
var client = github.client({
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});

  router.post('/', function(req, res, next) {
    var currentUserID = req.body.currentUserID;
    var gitUser = req.body.gitUser;

    client.get('/users/' + gitUser, {}, function (err, status, user, headers) {
      res.json(user);
    });

  });


module.exports = router;
