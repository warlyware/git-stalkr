var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var trending = require('github-trending');

var configDB = require('./config/database.js');

// var routes = require('./routes/index');
var users = require('./routes/users');
var github = require('./routes/github');
var watch = require('./routes/watch');
var cors = require('cors');

var app = express();

app.use(cors());

mongoose.connect(configDB.url);

require('./config/passport')(passport);
//
// trending(function(err, repos) {
//   console.log(repos);
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'thisisabadsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/auth.js')(app, passport);
// require('./routes/users.js');

// app.use('/', routes);
app.use('/users', users);
app.use('/github', github);
app.use('/watch', watch);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
