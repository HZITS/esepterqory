const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const prpl = require('prpl-server')
const subdomain = require('express-subdomain')
const rendertron = require('rendertron-middleware')

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test6')

// Express
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(rendertron.makeMiddleware({
  proxyUrl: 'http://render-tron.appspot.com',
  injectShadyDom: true
}));

app.post('/api/topics', isAdmin)
app.post('/api/problems', isAdmin)

app.get((req,res,next) => {
	res.set({
		"Cache-Control": "no-cache"
	})
	next()
})

app.use('/api', require('./routes/api'))
app.use(subdomain('admin', require('./routes/admin')))

app.get('/*', prpl.makeHandler('.', {
	builds: [
		// {name: 'client/build/es6', browserCapabilities: ['es2015', 'push']},
		{name: process.env.MONGODB_URI ? 'client/build/es5': 'client'}
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
// Start server
app.listen(process.env.PORT || 3000)
console.log('listening on port ' + (process.env.PORT || 3000))
