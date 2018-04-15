const express = require('express')
const router = express.Router()
const prpl = require('prpl-server')

router.use('/',prpl.makeHandler('.', {
	builds: [
		{name: process.env.MONGODB_URI ? 'mobile/build/es5': 'mobile'}
	]
}))

module.exports = router
