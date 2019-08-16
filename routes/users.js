const express = require('express');
const router = express.Router();
const { User } = require('../db/models');
const { check, validationResult } = require('express-validator');

// const nameValidator = check('name')
//   .exists({ checkNull: true, checkFalsy: true })
//   .withMessage('Please provide a value for "name"');


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
  User.findAll()
  .then(function(users) {
    res.status(200).json(users)
  });
}));


router.post('/', [
  check('firstName')
    .exists()
    .withMessage('Please provide a value for "First Name"'),
  check('lastName')
    .exists()
    .withMessage('Please provide a value for "Last Name"'),
  check('emailAddress')
    .exists()
    .withMessage('Please provide a value for "Email Address"'),
  check('password')
    .exists()
    .withMessage('Please provide a value for "Password"')
], asyncHandler( async (req, res) => {

  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });

  } else if (req.body.firstName && req.body.lastName 
      && req.body.emailAddress && req.body.password) {
    const user = await User.create(req.body);
    res.location('/').status(201).json(user);
  } else {
    res.status(400).json({message: "First name, last name, email address, password is required."});
  }

}));



module.exports = router;





























