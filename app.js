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
var childprocess = require('child_process')
var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var localizer = require('./localizer.js')
var settings = require('./routes/settings.js')
var dbsetup = require('./persistence/databaseSetup.js')
var WorkerProvider = require('./persistence/workerProvider.js').WorkerProvider
var routesetup = require('./routes/routesSetup.js')

var supported = ["de", "de_DE", "en"]

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
    hbs.helpers.isAdmin = function (opts) {
        if (req.session['isAdmin'])
            return opts.fn(this)
        else
            return opts.inverse(this)
    }
    hbs.helpers.loggedonuser = function () {
        return req.session['username']
    }
    hbs.helpers.currentusername = function () {
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
    hbs.helpers.uriencode = function (item) {
        return encodeURIComponent(item)
    }
    hbs.helpers.lastElement = function (array) {
        return array.reverse()[0]
    }
    hbs.helpers.withLastElement = function (array, opts) {
        if (array)
            return opts.fn(array.reverse()[0])
        else
            return opts.inverse(this)
    }
    hbs.helpers.inArrayId = function (array, id, opts) {
        var lookup = {}
        if (array) {
            for (var i = 0; i < array.length; i++) {
                lookup[array[i]._id] = array[i]
            }
        }
        if (lookup[id])
            return opts.fn(this)
        else
            return opts.inverse(this)
    }
    hbs.helpers.formatWorker = function (worker) {
        if (worker) {
            if (worker.firstname && worker.lastname) {
                return worker.firstname + '\u00A0' + worker.lastname
            } else {
                return worker
            }
        }
    }
    hbs.helpers.workerIsNotAssigneeOption = function (worker, assignee, opts) {
        var res = '<option value="' + worker._id + '">' + worker.firstname + ' ' + worker.lastname + (worker.department ? ' (' + req.localize(worker.department) + ')' : '') + '</option>'
        if (assignee) {
            if (!(worker != assignee && worker._id != assignee._id)) {
                res = ''
            }
        }
        return new hbs.handlebars.SafeString(res)

    }
    hbs.helpers.commentList = function (input) {
        var res = '<ul class="list-unstyled">'
        for (item in input) {
            res +=
            '<li><blockquote>' + input[item].commentvalue + 
                '<footer>' + hbs.helpers.formatWorker(input[item].creator) + ' &mdash; ' + hbs.handlebars.helpers.formatDate(input[item].created, '%d.%m.%y %H:%M') + '</footer></blockquote></li>'
        }
        res += '</ul>'
        return new hbs.handlebars.SafeString(res)
    }
    hbs.helpers.currentUserIsAssignee = function (assignee, opts) {
        if (assignee && (assignee == req.session['username'] || assignee._id && assignee._id == req.session['username'])) {
            return opts.inverse(this)
        } else {
            return opts.fn(this)
        }
    }
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

var options = { pfx: fs.readFileSync('localhost.pfx') }

var server = https.createServer(options, app)
var io = require('socket.io')(server)
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})

dbsetup.setup()
settings.initializedesign(function () { })
var workerprovider = new WorkerProvider()