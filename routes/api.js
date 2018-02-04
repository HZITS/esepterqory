
// Dependencies
var express = require('express');
var router = express.Router();

const topics = require('./api.topics')
const problems = require('./api.problems')
const auth = require('./api.auth')

// Routes
router.use('/topics', topics)
router.use('/problems', problems)
router.use('/auth', auth)

// Return router
module.exports = router;
