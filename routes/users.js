const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const router = express.Router();
const { User } = require('../db/models');
const { check, validationResult } = require('express-validator');

const authenticateUser = (req, res, next) => {
  let message = null;
  const credentials = auth(req);
//creeddddddnntials Credentials { name: 'jake@sully.com', pass: 'jakepassword' }
  if (credentials) {
    console.log('credentials0000000', credentials);
    console.log('credentials.nameeeeeeeeeeee111111111', credentials.name);
    User.findOne({ where: {emailAddress: credentials.name} })
      .then(function(u) {
        const user = u.dataValues;

        if (user) {
          const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);


          console.log('authenticatededededede', authenticated);
          console.log('credentials.nameeeeeeeeeeee3333333', credentials.name);
          console.log('credentials.pasasssssss', credentials.pass);
          console.log('userpasss', user.password);

          if (authenticated) {
            console.log('credentials.nameeeeeeeeeeee44444444', credentials.name);
            console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
            req.currentUser = user;
          } else {
            message = `Authentication failure for username: ${user.emailAddress}`;
          }
        } else {
            console.log('credentials.nameeeeeeeeeeee22222', credentials.name);
          message = `User not found for username: ${credentials.name}`;
        }
      })


    // If a user was successfully retrieved from the data store...
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
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


router.get('/', authenticateUser, asyncHandler( async (req, res) => {
  console.log('cuuurent uuusserererere', req.currentUser);
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username,
  });
  // User.findAll()
  // .then(function(users) {
  //   res.status(200).json(users)
  // });
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

    req.body.password = bcryptjs.hashSync(req.body.password);
    
    const user = await User.create(req.body);

    res.location('/').status(201).json(user);

  } else {
    res.status(400).json({message: "First name, last name, email address, password is required."});
  }

}));



module.exports = router;





























