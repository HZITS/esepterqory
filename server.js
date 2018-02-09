const express = require('express')
const prpl = require('prpl-server')
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test6')

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('express-session')({
    secret: 'octopus',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(express.static(path.join(__dirname, 'client/build/es6')))
// app.use(express.static(path.join(__dirname, 'client')))
app.use(express.static(path.join(__dirname, './admin')))

var User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.post('/api/topics', isAdmin)
// app.post('/api/problems', isAdmin)

// Routes

app.use('/api', require('./routes/api'))

app.use('/admin*', isAdmin)
app.get('/admin*', prpl.makeHandler('.', {
  builds: [
    // {name: 'client/build/es6', "browserCapabilities": ["es2015", "push","serviceworker"]},
    {name: 'admin'}
  ],
}));



// app.get('/*', prpl.makeHandler('.', {
//   builds: [
//     // {name: 'client/build/es6', "browserCapabilities": ["es2015", "push","serviceworker"]},
//     {name: 'client'}
//   ],
// }));


function isAdmin(req,res,next) {
	console.log(req.get('authorization'))
	if(req.get('authorization') == 'Basic YWRtaW46YWRtaW5Sb290MTch'){
		res.set({
			"Cache-Control": "no-cache"
		})
		next()
	} else {
		res.set({
			"WWW-Authenticate": 'Basic realm="Access to admin panel"'
		})
		res.sendStatus(401)
	}
}

// Start server
app.listen(process.env.PORT || 3000)
console.log('listening on port ' + (process.env.PORT || 3000))
