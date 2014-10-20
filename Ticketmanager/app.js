/**
 * Module dependencies.
 */

var express = require('express')
var session = require('express-session')
var routes = require('./routes')
var account = require('./routes/account.js')
var ticket = require('./routes/ticket.js')
var application = require('./routes/application.js')
var department = require('./routes/department.js')
var client = require('./routes/client.js')
var release = require('./routes/release.js')
var https = require('https')
var path = require('path')
var fs = require('fs')

var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var config = require('./config.js')
var cradle = require('cradle')

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

app.get('/ticket/add', ticket.add)
app.get('/ticket/add/success', ticket.addSuccess)
app.get('/ticket/add/fail', ticket.addFail)
app.post('/ticket/add', ticket.addPost)

app.get('/application/add', application.add)
app.get('/application/add/success', application.addSuccess)
app.get('/application/add/fail', application.addFail)
app.post('/application/add', application.addPost)

app.get('/department/add', department.add)
app.get('/department/add/success', department.addSuccess)
app.get('/department/add/fail', department.addFail)
app.post('/department/add', department.addPost)

app.get('/client/add', client.add)
app.get('/client/add/success', client.addSuccess)
app.get('/client/add/fail', client.addFail)
app.post('/client/add', client.addPost)

app.get('/release/add', release.add)
app.get('/release/add/success', release.addSuccess)
app.get('/release/add/fail', release.addFail)
app.post('/release/add', release.addPost)

var options = { pfx: fs.readFileSync('localhost.pfx') }

https.createServer(options, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})


var connection = new (cradle.Connection)(config.CouchDBServerHost, config.CouchDBServerPort, {
    cache: true,
    raw: false
})
var db = connection.database('ticketmanagement')
db.exists(function (err, exists) {
    if (err) {
        console.error(err)
    } else if (!exists) {
        console.log('call setup to create database and views')
        db.create()
        db.save('_design/tickets', {
            free: {
                map: function (doc) {
                    if (doc.type == 'ticket') {
                        if (!doc.assigned && doc.priority) {
                            emit([doc.applications, doc.clients, doc.release, doc.departments, 0], doc)
                        }
                    } else if (doc.type == 'application') {
                        emit([doc._id, 1], doc)
                    } else if (doc.type == 'client') {
                        emit([doc._id, 2], doc)
                    } else if (doc.type == 'release') {
                        emit([doc._id, 3], doc)
                    } else if (doc.type == 'department') {
                        emit([doc._id, 4], doc)
                    }
                }
            },
            unprioritised: {
                map: function (doc) {
                    if (doc.type == 'ticket') {
                        if (!doc.priority) {
                            emit(doc.id, doc)
                        }
                    }
                }
            },
            archived: {
                map: function (doc) {
                    if (doc.type == 'ticket') {
                        if (doc.archived) {
                            emit(doc.id, doc)
                        }
                    }
                }
            },
            active: {
                map: function (doc) {
                    if (doc.type == 'ticket') {
                        if (doc.assigned) {
                            emit(doc.id, doc)
                        }
                    }
                }
            }
        })
        db.save('_design/applications', {
            all: {
                map: function (doc) {
                    if (doc.type == 'application') {
                        emit(doc.id, doc)
                    }
                }
            }
        })
        db.save('_design/clients', {
            all: {
                map: function (doc) {
                    if (doc.type == 'client') {
                        emit(doc.id, doc)
                    }
                }
            }
        })
        db.save('_design/departments', {
            all: {
                map: function (doc) {
                    if (doc.type == 'department') {
                        emit(doc.id, doc)
                    }
                }
            }
        })
        db.save('_design/releases', {
            all: {
                map: function (doc) {
                    if (doc.type == 'release') {
                        emit(doc.id, doc)
                    }
                }
            }
        })
    }
})