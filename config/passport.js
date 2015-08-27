var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
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


  // LOCAL SIGNUP
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({'local.email': email }, function(err, existingUser) {
        if (err) {
          return done(err);
        }
        if (existingUser) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        if (req.user) {
          var user = req.user;
          user.local.email = email;
          user.local.password = user.generateHash(password);
          user.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, user);
          });

        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));


  // LOCAL LOGIN
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, function(req, email, password, done) {
      User.findOne({ 'local.email': email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found'));
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Wrong password'));
        }

        return done(null, user); // return user after successful login
      });

    }));


  // TWITTER
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, tokenSecret, profile, done) {

    process.nextTick(function() {
      console.log(profile);

      // check if the user is already logged in
      if (!req.user) {

        User.findOne({ 'twitter.id': profile.id}, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            // save our user into the database
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });



          }
        });


      } else {

        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session
        // update the current users facebook credentials
        user.twitter.id = profile.id;
        user.twitter.token = token;
        user.twitter.username  = profile.username;
        user.twitter.displayName = profile.displayName;

        // save the user
        user.save(function(err) {
          if (err)
          throw err;
          return done(null, user);
        });

      }

    });

  }));


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
      console.log(profile);
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
            var newUser = new User();

            newUser.github.id = profile.id;
            newUser.github.token = token;
            newUser.github.name = profile.displayName;
            newUser.github.email = profile.emails[0].value;
            newUser.github.location = profile._json.location;
            newUser.github.image = profile._json.avatar_url;
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
