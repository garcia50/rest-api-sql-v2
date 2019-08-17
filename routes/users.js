const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const router = express.Router();
const { User } = require('../db/models');
const { check, validationResult } = require('express-validator');

const authenticateUser = (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  if (credentials) {
    User.findOne({ where: {emailAddress: credentials.name} })
    .then((user) => {
      if (user) {
        const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
          req.currentUser = user;
          next();
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
          res.status(401).json({ message: message });
        }
      } else {
        message = 'Please enter user credentials';
        res.status(401).json({ message: message });
      }
    });
  } else {
    message = 'Auth header not found';
    res.status(401).json({ message: message });
  }
}


function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}


router.get('/', authenticateUser, (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    name: user.firstName,
    username: user.emailAddress
  });
});


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

    } else if (req.body.firstName && req.body.lastName 
        && req.body.emailAddress && req.body.password) {

      req.body.password = bcryptjs.hashSync(req.body.password);
      
      const user = await User.create(req.body);

      res.location('/').status(201).json(user);

    } else {
      res.status(400).json({message: "First name, last name, email address, password is required."});
    }
  })
);



module.exports = router;





