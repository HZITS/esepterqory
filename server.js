const express = require('express')
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

var User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
    res.set({
            'Access-Control-Allow-Origin': 'http://localhost:8081',
            'Access-Control-Allow-Credentials': true
        })
    next()
});

app.post('/api/topics', isAdmin)
app.post('/api/problems', isAdmin)

// Routes
app.use('/api', require('./routes/api'))


function isAdmin(req,res,next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.set({
            "WWW-Authenticate": 'Basic',
            "Content-Length": "0"
        })
        res.sendStatus(401)
    }
}

// Start server
app.listen(process.env.PORT || 3000)
console.log('listening on port ' + (process.env.PORT || 3000))
