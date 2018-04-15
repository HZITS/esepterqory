const express = require('express')
const router = express.Router()
const prpl = require('prpl-server')

router.use('/',prpl.makeHandler('.', {
	builds: [
		// {name: 'admin/build/es6', browserCapabilities: ['es2015', 'push']},
		{name: 'mobile'}
	]
}))

module.exports = router
