
// Dependencies
var express = require('express');
var router = express.Router();

const topics = require('./api.topics')
const problems = require('./api.problems')
// Routes
router.use('/topics', topics)
router.use('/problems', problems)

router.route

// Return router
module.exports = router;
