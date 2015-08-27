var express = require('express');
var router = express.Router();
var github = require('octonode');
var client = github.client({
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});


router.get('/user/:id', function(req, res, next) {
  var gitUser = req.params.id;
  client.get('/users/' + gitUser, {}, function (err, status, user, headers) {
    if (err) {
      if (err.message === 'Not Found') {
        console.log('USER WAS NOT FOUND');
        res.json('user not found');
      } else  {
        console.log(err);
        res.status(500);

      }



    }
    console.log(user);
    res.json(user);
  });
});

module.exports = router;
