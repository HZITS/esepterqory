const express = require('express')
const router = express.Router()
const prpl = require('prpl-server')

router.use('/', isAdmin)
router.use('/',prpl.makeHandler('.', {
	builds: [
		{name: process.env.MONGODB_URI ? 'admin/build/es5': 'admin'}
	]
}))

function isAdmin(req,res,next) {

	if(req.get('authorization') == 'Basic YWRtaW46YWRtaW5Sb290MTch'){
		next()
	} else {
		res.set({
			"WWW-Authenticate": "Basic realm='Access to admin panel'"
		})
		res.sendStatus(401)
	}
}

module.exports = router
