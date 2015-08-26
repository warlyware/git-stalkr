var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/data', function(req, res, next) {

  if (!req.user) {
    console.log('there is no user data');
    res.status(404).send('no user');
    // res.json('/#/');
  } else {
    var user = req.user;
    res.json(user);
  }



});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
