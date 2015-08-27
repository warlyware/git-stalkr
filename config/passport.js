var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GithubStrategy = require('passport-github').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport) {


  // PASSPORT SESSION SETUP
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log(profile);
      if (!req.user) {

        User.findOne({ 'google.id': profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {

            // if user id but no token (previously linked, then removed)
            // just add token and profile info

            if(!user.google.token) {
              user.google.token = token;
              user.google.name = profile.displayName;
              user.google.email = profile.emails[0].value;

              user.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, user);
              });
            }

            return done(null, user);
          } else {
            var newUser = new User();

            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            // newUser.image = profile.photos[0].value;
            newUser.watched = [];

            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });

      } else {
        var user = req.user;
        user.google.id = profile.id;
        user.google.token = token;
        user.google.name = profile.displayName;
        user.google.email = profile.emails[0].value;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });

      }

    });
  }));

  // GITHUB
  passport.use(new GithubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {

        User.findOne({ 'github.id': profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {

            // if user id but no token (previously linked, then removed)
            // just add token and profile info

            if(!user.github.token) {
              user.github.token = token;
              user.github.name = profile.displayName;
              user.github.email = profile.emails[0].value;


              user.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, user);
              });
            }

            return done(null, user);
          } else {
            var gitUserData = profile._json;

            var newUser = new User();
            newUser.github = {
                id: profile.id,
                token: token,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: gitUserData.avatar_url,
                url: gitUserData.html_url,
                followers_url: gitUserData.followers_url,
                repos: gitUserData.repos_url,
                site_admin: gitUserData.site_admin,
                blog: gitUserData.blog,
                location: gitUserData.location,
                public_repos: gitUserData.public_repos,
                public_gists: gitUserData.public_gists,
                followers: gitUserData.followers,
                following: gitUserData.following
            };
            newUser.watched = [];

            console.log(newUser);

            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });

      } else {
        // update credentials
        var user = req.user;
        user.github.id = profile.id;
        user.github.token = token;
        user.github.name = profile.displayName;
        user.github.email = profile.emails[0].value;
        user.github.location = profile._json.location;
        user.github.image = profile._json.avatar_url;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });

      }

    });
  }));
};
