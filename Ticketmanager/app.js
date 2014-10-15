/**
 * Module dependencies.
 */

var express = require('express')
var session = require('express-session')
var routes = require('./routes')
var account = require('./routes/account.js')
var https = require('https')
var path = require('path')
var fs = require('fs')

var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var app = express()
var hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: {}
})

hbshelper.register(hbs.handlebars, { marked: undefined })

// all environments
app.engine('.hbs', hbs.engine)
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(session({ secret: '{18165D59-08BB-40EF-BBA4-1220B623282B}' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
    hbs.helpers.isAdmin = function (opts) {
        return opts.fn(this)
    }
    hbs.helpers.username = function () {
        return req.session['username']
    }
    next()
})
app.use(function (req, res, next) {
    if (req.url != '/login') {
        if (req.session['authenticated'] == true) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        next()
    }
})
app.use(app.router)

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index)
app.get('/login', account.login)
app.post('/login', account.loginPost)

var options = { pfx: fs.readFileSync('localhost.pfx') }

https.createServer(options, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})