﻿/**
 * Module dependencies.
 */

var express = require('express')
var session = require('express-session')
var https = require('https')
var path = require('path')
var fs = require('fs')
var expless = require('less-middleware')
var locale = require('locale')
var localizer = require('./localizer.js')
var supported = ["de", "de_DE", "en"]

var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var dbsetup = require('./persistence/databaseSetup.js')
var routesetup = require('./routes/routesSetup.js')

var app = express()
var hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: {}
})
var __localize = localizer.localize

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
app.use(expless(__dirname + "/public", { compress: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(locale(supported))
app.use(function (req, res, next) {
    hbs.helpers.isAdmin = function (opts) {
        if (req.session['isAdmin'])
            return opts.fn(this)
        else
            return opts.inverse(thist)
    }
    hbs.helpers.username = function () {
        if (req.session['fullname'])
            return req.session['fullname']
        return req.session['username']
    }
    hbs.helpers.jsonStringify = function (value) {
        return JSON.stringify(value)
    }
    hbs.helpers.localize = function (key) {
        return __localize(key, req)
    }
    req.localize = __localize
    next()
})
app.use(function (req, res, next) {
    if (req.path != '/login') {
        if (req.session['authenticated'] == true) {
            next()
        } else {
            res.redirect('/login?target=' + encodeURIComponent(req.originalUrl))
        }
    } else {
        next()
    }
})
app.use(app.router)
routesetup.setup(app)

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var options = { pfx: fs.readFileSync('localhost.pfx') }

https.createServer(options, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})
dbsetup.setup()