
// Dependencies
var express = require('express');
var router = express.Router();

const topics = require('./api.topics')
const problems = require('./api.problems')
const auth = require('./api.auth')
const download = require('./api.download')
const articles = require('./api.articles')

// Routes
router.use('/topics', topics)
router.use('/download', download)
router.use('/articles', articles)
router.use('/problems', problems)
router.use('/auth', auth)

// Return router
module.exports = router;
