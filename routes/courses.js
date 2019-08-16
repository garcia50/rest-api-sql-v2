const express = require('express');
const router  = express.Router();
const { Course } = require('../db/models');


function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}


router.get('/', asyncHandler( async (req, res) => {
  Course.findAll()
  .then(function(courses) {
    res.status(200).json(courses)
  });
}));

// router.get('/', function(req, res) {
//   // Course.findAll()
//   // .then(function(courses) {
//   //   res.render('index', { courses: courses });
//   // });
//   res.json({
//     message: 'Coursesesesesesesees!',
//   });
// });

module.exports = router;
