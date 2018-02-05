const express = require('express')
const prpl = require('prpl-server')
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test4')

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
app.use(express.static(path.join(__dirname, 'client/build/es5-bundled')))

var User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.post('/api/topics', isAdmin)
app.post('/api/problems', isAdmin)

// Routes
app.use('/api', require('./routes/api'))

app.get('/*', prpl.makeHandler('.', {
  builds: [
    {name: 'client/build/es5-bundled', browserCapabilities: ['es2015', 'push']}
  ],
}));


function isAdmin(req,res,next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.sendStatus(401)
    }
}

// Start server
app.listen(process.env.PORT || 3000)
console.log('listening on port ' + (process.env.PORT || 3000))
