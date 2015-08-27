var express = require('express');
var router = express.Router();

// request user data from our db
router.get('/data', function(req, res, next) {

  // if no user
  if (!req.user) {
    console.log('there is no user data');
    res.status(404).send('no user');
  // if user, build user object for response
  } else {
    var user = req.user;
    console.log(user._id);
    user.id = user._id;
    user.image = req.user.github.image || '/images/identicon.png';
    user.name = req.user.github.name || req.user.google.name;
    user.email = req.user.github.email || req.user.google.email;
    user.location = req.user.github.location || 'unlisted';
    res.json(user);
  }

});




module.exports = router;
