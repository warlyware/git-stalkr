var express = require('express');
var router = express.Router();
var github = require('octonode');
var async = require('async');

var User = require('../app/models/user');

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

router.get('/following/:user', function(req, res, next) {
  var currentUserID = req.params.user;

  User.findOne({'_id': currentUserID}, function(err, currentUser) {
    if (err) {
      console.log(err);
      return;
    }
    var watchedUsers = currentUser.watched;
    var githubToken = currentUser.github.token;
    var client = github.client(githubToken);
    var ghme = client.me();
    var watchedNames = [];
    var filteredFollowing = [];

    async.series([
      function(cb) {
        watchedUsers.forEach(function(e) {
            watchedNames.push(e.username);
        });
        cb();
      },
      function(cb) {
        ghme.following(function(err, following) {

          for (var i = 0; i < following.length; i++) {
            var username = following[i].login;
            console.log('````````` TO FILTER: ', username);
            console.log(watchedNames.indexOf(username));
            if (watchedNames.indexOf(username) === -1) {
              filteredFollowing.push(following[i]);
            }
          }
          cb();
        });
      }
    ], function(err) {
      if (err) {
        console.log(err);
      }
      console.log(filteredFollowing);
      res.json(filteredFollowing);
    });
  });

});

// router.post('/following', function(req, res, next) {
//
//
//   var client = github.client(req.body.token);
//   var ghme = client.me();
//
//   ghme.following(function(err, following) {
//     // console.log(following);
//
//     var currentUserID = req.body.currentUserID;
//     var gitUser = req.body.gitUser;
//
//
//     User.findOne({'_id': currentUserID}, function(err, currentUser) {
//
//       // console.log('add to', currentUser);
//       // console.log('add', following);
//
//       for (var i = 0; i < following.length; i++) {
//         var username = following[i].login;
//         console.log('````````` TO FOLLOW: ', username);
//         client.get('/users/' + username, {}, function (err, status, gitUserData, headers) {
//             console.log(gitUserData);
//             var watchedUser = {
//               id: gitUserData.id,
//               name: gitUserData.name,
//               username: gitUserData.login,
//               email: gitUserData.email,
//               image: gitUserData.avatar_url,
//               url: gitUserData.html_url,
//               followers_url: gitUserData.followers_url,
//               repos: gitUserData.repos_url,
//               type: gitUserData.type,
//               site_admin: gitUserData.site_admin,
//               blog: gitUserData.blog,
//               location: gitUserData.location,
//               public_repos: gitUserData.public_repos,
//               public_gists: gitUserData.public_gists,
//               followers: gitUserData.followers,
//               following: gitUserData.following
//             };
//
//             currentUser.watched.push(watchedUser);
//
//           });
//
//       }
//
//       currentUser.save(function(err, savedUser) {
//         if (err) {
//           console.log(err);
//           res.status(400).json({ error: "Validation Failed" });
//         }
//         res.json(savedUser);
//       });
//     });
//
//
//
//   });
// });

module.exports = router;
