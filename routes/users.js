const express = require('express');
const router  = express.Router();
const User = require('../db/models').User;

router.get('/', function(req, res) {
  // User.findAll()
  // .then(function(users) {
  //   res.render('index', { users: users });
  // });
  res.json({
    message: 'USEEEEERRRRRRRSSS!',
  });
});




module.exports = router;
