'use strict'
//Set dependencies and add them to variables, and acquire our models 
const { User } = require('../db/models');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

 module.exports = (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    User.findOne({ where: {emailAddress: credentials.name} })
    .then((user) => {
      // If a user was successfully retrieved from the database...
      if (user) {
        // Use the bcryptjs npm package to compare the user's password
        // (from the Authorization header) to the user's password
        // that was retrieved from the database.
        const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
        // If the passwords match...
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
          // Then store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
          next();
        } else {
          // If user authentication failed...
          message = `Authentication failure for username: ${user.emailAddress}`;
          res.status(401).json({ message: message });
        }
      } else {
        // If user authentication failed...
        message = 'Please enter user credentials';
        res.status(401).json({ message: message });
      }
    });
  } else {
    // If user authentication failed...
    message = 'Auth header not found';
    res.status(401).json({ message: message });
  }
}
