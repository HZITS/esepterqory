const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const prpl = require('prpl-server')
const subdomain = require('express-subdomain')
const rendertron = require('rendertron-middleware')
const useragent = require('express-useragent')
 
// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test6')

// Express
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(useragent.express())

//For search bots 
app.use(rendertron.makeMiddleware({
  proxyUrl: 'https://render-tron.appspot.com',
  injectShadyDom: true
}))


app.post('/api/topics', isAdmin)
app.post('/api/problems', isAdmin)

app.use((req,res,next) => {
	res.set({
		"Cache-Control":  'no-cache, no-store, must-revalidate'
	})
	if(req.get('authorization') == 'Basic YWRtaW46YWRtaW5Sb290MTch'){
		res.locals.admin = true
	} 
	next()
})

app.use((req, res, next) => {

	if(req.useragent.isMobile && req.subdomains[0] != 'm') {

		res.redirect(req.protocol + '://m.' + req.get('host') + req.originalUrl)
	} else {
		next()
	}
})

app.use('/api', require('./routes/api'))
app.use(subdomain('m', require('./routes/mobile')))
app.use(subdomain('admin', require('./routes/admin')))


app.get('/*', prpl.makeHandler('.', {
	builds: [
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
