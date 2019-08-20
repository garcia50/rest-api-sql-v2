'use strict'
//Set dependencies and add them to variables, and acquire our models 
const express = require('express');
const router  = express.Router();
const { check, validationResult } = require('express-validator');
const { Course } = require('../db/models');
const authenticateUser = require('./authenticate');
const { sequelize } = require('../db/models');

/* Middleware function to clean up code */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}

/* Retrieves all courses */
router.get('/', asyncHandler( async (req, res) => {
  console.log('woooorokrokrokrrk');
  Course.findAll()
  .then(function(courses) {
    res.status(200).json(courses).end()
  });
}));

/* Retrieves a course */
router.get('/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  Course.findByPk(id)
  .then(function(course){
    if(course == null) {
      return res.status(400).json({ errors: 'That course does not exist' });
    } else {
      res.status(200).json(course).end()
    }
  });
}));

/* Creates course */
router.post('/', authenticateUser, [
  //Ensure title and decription is present in request
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
        res.location(`/api/courses/${course.id}`).status(201).json(course).end();
      // })
    } else {
      res.status(400).json({message: "Title and description is required."});
    }
  })
);

/* Updates course */
router.put('/:id', authenticateUser, [
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
            res.status(204).json(course).end()
          )
        }
      });
    }
  })
);


/* Delete course */
router.delete('/:id', authenticateUser, 
  asyncHandler( async (req, res) => {
    Course.findByPk(req.params.id)
    .then(function(course) {
      if (course) {
        course.destroy();
        res.status(204).end();
      }
    })
    //catches any error
    .catch(function(err) {
      res.sendStatus(400);
    })
  })
);


//Expose router as a module
module.exports = router;