var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/data', function(req, res, next) {
  res.json({"msg": "here is a msg"});
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
