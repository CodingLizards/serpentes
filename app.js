/**
 * Module dependencies.
 */

var express = require('express')
var session = require('express-session')
var https = require('https')
var path = require('path')
var fs = require('fs')
var expless = require('less-middleware')
var locale = require('locale')
var childprocess = require('child_process')
var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var localizer = require('./localizer.js')
var settings = require('./routes/settings.js')
var dbsetup = require('./persistence/databaseSetup.js')
var WorkerProvider = require('./persistence/workerProvider.js').WorkerProvider
var routesetup = require('./routes/routesSetup.js')
var handlebarssetup = require('./handlebarsSetup.js')

var supported = ["de", "de_DE", "en"]

var app = express()
var hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: handlebarssetup.nonRequestHelper
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
app.use(expless(__dirname + "/public", {
    preprocess: {
        less: function (src, req) {
            var vars = ""
            for (item in settings.designvalues) {
                vars += "@" + item + ":" + settings.designvalues[item] + ";"
            }
            return vars + src
        }
    }, force: true
}, { compress: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(locale(supported))
app.use(function (req, res, next) {
    io.on('connection', function (socket) {
        socket.on('start', function (data) {
            if (req.session['isAdmin']) {
                socket.emit('log', { message: req.localize('updating serpentes') })
                var process = childprocess.spawn('git' , ['pull', 'origin', 'feature/master'])
                process.stdout.on('data', function (data) {
                    console.log(data.toString())
                    socket.emit('log', { message: data.toString('UTF-8') });
                })
                process.stderr.on('data', function (data) {
                    console.log(data.toString())
                    socket.emit('log', { message: data.toString('UTF-8') });
                })
                process.on('exit', function (code, signal) {
                    console.log('exited with code ' + code)
                    socket.emit('log', { message: 'exit with code ' + code })
                    process.kill()
                })
            } else {
                socket.emit('log', req.localize('only admins can update'))
            }
        })
    })
    
    req.localize = function (key) { return __localize(key, req) }
    next()
})
app.use(handlebarssetup.setup(hbs))
if ('development' == app.get('env')) {
    app.use(function (req, res, next) {
        req.session['isAdmin'] = true
        req.session['fullname'] = 'Theo Test'
        req.session['username'] = 'theo'
        next()
    })
} else {
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
}
app.use(app.router)
routesetup.setup(app)

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var options = { pfx: fs.readFileSync('server.p12') }

var server = https.createServer(options, app)
var io = require('socket.io')(server)
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})

dbsetup.setup()
settings.initializedesign(function () { })
var workerprovider = new WorkerProvider()
