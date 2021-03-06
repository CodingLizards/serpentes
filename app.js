﻿var express = require('express')
var https = require('https')
var http = require('http')
var path = require('path')
var log4js = require('log4js')
var fs = require('fs')

var settings = require('./routes/settings.js')
var dbsetup = require('./persistence/databaseSetup.js')
var WorkerProvider = require('./persistence/workerProvider.js').WorkerProvider
var routesetup = require('./routes/routesSetup.js')
var handlebarssetup = require('./handlebarsSetup.js')

var logger = log4js.getLogger('serpentes');
var app = express()
var hbs = require('express-handlebars').create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: handlebarssetup.nonRequestHelper
})

require('handlebars-helpers').register(hbs.handlebars, { marked: undefined })
log4js.configure(path.join(__dirname, 'log4js.json'), {})

app.engine('.hbs', hbs.engine)
app.use(log4js.connectLogger(logger, {}))
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
app.use(require('serve-favicon')(path.join(__dirname, 'favicon.ico')))
app.use(require('morgan')('tiny'))
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded())
app.use(require('method-override')())
app.use(require('express-session')({ secret: '{18165D59-08BB-40EF-BBA4-1220B623282B}' }))
app.use(require('less-middleware')(__dirname + "/public", {
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
app.use(require('locale')(["de", "de_DE", "en"]))
app.use(require('codinglizards-localizer').localize())
app.use(require('./authentication.js').authentication(app.get('env')))
app.use(handlebarssetup.requestHelpers(hbs))
routesetup.setup(app)

// development only
if ('development' == app.get('env')) {
    app.use(require('errorhandler')())
}

var server = undefined
if (fs.existsSync('server.p12')) {
    var options = { pfx: fs.readFileSync('server.p12') }
    server = https.createServer(options, app)
} else {
    server = http.createServer(app)
}
var io = require('socket.io')(server)
app.use(require('./updates.js').updateSocket(io))

server.listen(app.get('port'), app.get('host'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})

dbsetup.setup()
settings.initializedesign()
require('codinglizards-localizer').initialize({ path: path.join(__dirname, 'languages') })