var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/data', function(req, res, next) {

  if (!req.user) {
    console.log('there is no user data');
    res.status(404).send('no user');
  } else {
    var user = req.user;
    user.image = req.user.github.image || '/images/identicon.png';
    user.name = req.user.github.name || req.user.google.name;
    user.email = req.user.github.email || req.user.google.email;
    user.location = req.user.github.location || 'unlisted';
    res.json(user);
  }

});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
