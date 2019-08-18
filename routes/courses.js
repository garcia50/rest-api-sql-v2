const express = require('express');
const router  = express.Router();
const { check, validationResult } = require('express-validator');
const { Course } = require('../db/models');
const authenticateUser = require('./authenticate');
const { sequelize } = require('../db/models');


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
  console.log('woooorokrokrokrrk');
  Course.findAll()
  .then(function(courses) {
    res.status(200).json(courses)
  });
}));


router.get('/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  Course.findByPk(id)
  .then(function(course){
    if(course == null) {
      return res.status(400).json({ errors: 'That course does not exist' });
    } else {
      res.status(200).json(course)
    }
  });
}));


router.post('/', [
  check('title')
    .exists()
    .withMessage('Please provide a value for "Title"'),
  check('description')
    .exists()
    .withMessage('Please provide a value for "Description"')
  ],
  asyncHandler( async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    } else if (req.body.title && req.body.description) {
      const course = await Course.create(req.body) 
      // .then(function(course) {
        res.location(`/api/courses/${course.id}`).status(201).json(course);
      // })
    } else {
      res.status(400).json({message: "Title and description is required."});
    }
  })
);


router.put('/:id', [
  check('title')
    .exists()
    .withMessage('Please provide a value for "Title"'),
  check('description')
    .exists()
    .withMessage('Please provide a value for "Description"')
  ],
  asyncHandler( async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    } else if (req.body.title && req.body.description) {
      const { id } = req.params;
      Course.findByPk(id)
      .then(function(course){
        if(course == null) {
          return res.status(400).json({ errors: 'That course does not exist' });
        } else {
          course.update(req.body)
          .then(
            res.status(204).json(course)
          )
        }
      });
    }
  })
);


// {
//   "userId": 15,
//   "title": "sports1",
//   "description": "swim"
// }

// {
//   "firstName": "Tony",
//   "lastName": "Starks",
//   "emailAddress": "tony@aol.com",
//   "password": "ironman"
// }

module.exports = router;
