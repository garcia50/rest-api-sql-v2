const express = require('express');
const router  = express.Router();
const Course = require('../db/models').Course;

router.get('/', function(req, res) {
  // Course.findAll()
  // .then(function(courses) {
  //   res.render('index', { courses: courses });
  // });
  res.json({
    message: 'Coursesesesesesesees!',
  });
});

module.exports = router;
