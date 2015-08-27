var express = require('express');
var router = express.Router();
var github = require('octonode');

var User = require('../app/models/user');

var client = github.client({
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});

router.post('/', function(req, res, next) {
  var currentUserID = req.body.currentUserID;
  var gitUser = req.body.gitUser;

  client.get('/users/' + gitUser, {}, function (err, status, gitUserData, headers) {
    if (err) {
      console.log(err);
    }
    console.log('hitting post');

    if (gitUserData) {
      User.findOne({'_id': currentUserID}, function(err, currentUser) {
        currentUser.watched = currentUser.watched || [];
        var watchedUser = {
          id: gitUserData.id,
          name: gitUserData.name,
          image: gitUserData.avatar_url,
          url: gitUserData.html_url,
          followers_url: gitUserData.followers_url,
          repos: gitUserData.repos_url,
          type: gitUserData.type,
          site_admin: gitUserData.site_admin,
          blog: gitUserData.blog,
          location: gitUserData.location,
          public_repos: gitUserData.public_repos,
          public_gists: gitUserData.public_gists,
          followers: gitUserData.followers,
          following: gitUserData.following
        };

        currentUser.watched.push(watchedUser);
        currentUser.save(function(err, savedUser) {
          if (err) {
            console.log(err);
            res.status(400).json({ error: "Validation Failed" });
          }
          console.log("User Saved:", savedUser);
          res.json(savedUser);
        });
      });
    }

  });

});


module.exports = router;
