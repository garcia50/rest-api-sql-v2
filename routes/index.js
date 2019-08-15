//Set dependencies and add them to variables
const express = require('express');
const router  = express.Router();

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


//Expose router as a module
module.exports = router;
