var fs = require('fs')
var path = require('path')
var routes = require('./')
var account = require('./account.js')
var ticket = require('./ticket.js')
var application = require('./application.js')
var department = require('./department.js')
var client = require('./client.js')
var release = require('./release.js')
var worker = require('./worker.js')
var settings = require('./settings.js')
var user = require('./user.js')
var admin = require('./admin.js')
var express = require('express')
var marked = require('marked')
var renderer = new marked.Renderer()
renderer.listitem = function (text) {
    if (/\[.\]/g.test(text))
        return '<li class="no-bullet">' + text + '</li>\n'
    else
        return '<li>' + text + '</li>\n'
}
renderer.html = function (html) {
    return html
}

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
})
var apiRouter = function () {
    var router = express.Router()
    router.post('/ticket/prioritize/:id', ticket.api.prioritize)
    return router
}

var helpRouter = function () {
    var router = express.Router()
    router.get('*', function (req, res) {
        var pagepath = req.params[0]
        if (pagepath == '/') {
            pagepath = 'index'
        }
        res.render(path.join('help', pagepath))
    })
    return router
}
var homeRouter = function () {
    var router = express.Router()
    router.get('/', routes.index)
    router.get('/about', routes.about)
    router.get('/logout', account.logout)
    router.get('/login', account.login)
    router.post('/login', account.loginPost)
    router.post('/login/details', account.addDetails)
    return router
}
var typeRouter = function (type) {
    var router = express.Router()
    router.get('/', type.index)
    router.get('/details/:id', type.details)
    router.get('/add', type.add)
    router.post('/add', type.addPost)
    router.post('/update/:id', type.update)
    return router
}
var workerRouter = function () {
    var router = express.Router()
    router.get('/', worker.index)
    router.get('/details/:id', worker.details)
    return router
}
var ticketRouter = function () {
    var router = express.Router()
    router.get('/', ticket.index)
    router.get('/details/:id', ticket.details)
    router.get('/add', ticket.add)
    router.get('/:state/search/', ticket.index)
    router.get('/:state', ticket.index)
    router.post('/add', ticket.addPost)
    router.post('/comments/:id', ticket.comment)
    router.post('/assign/:id/:username', ticket.assign)
    router.post('/assign/:id', ticket.assign)
    router.post('/reviewed/:id', ticket.reviewed)
    router.post('/archive/:id', ticket.archive)
    router.post('/update/:id', ticket.update)
    return router
}
var adminRouter = function () {
    var router = express.Router()
    router.use(function (req, res, next) {
        if (req.session['isAdmin']) {
            next()
        } else {
            res.redirect('/')
        }
    })
    router.get('/settings/language', settings.language)
    router.get('/settings/language/reload', settings.reloadLanguage)
    router.get('/settings/design', settings.design)
    router.post('/settings/design', settings.configuredesign)
    router.get('/users', user.index)
    router.get('/users/add', user.add)
    router.get('/users/details/:id', user.details)
    router.post('/users/add', user.addPost)
    router.post('/users/update/:id', user.update)
    router.get('/update', admin.update)
    router.post('/update', admin.updatePost)
    router.get('/export', admin.export)
    router.post('/export', admin.exportPost)
    return router
}

exports.setup = function (app) {
    app.use('/', homeRouter())
    app.use('/application', typeRouter(application))
    app.use('/department', typeRouter(department))
    app.use('/client', typeRouter(client))
    app.use('/worker', workerRouter())
    app.use('/release', typeRouter(release))
    app.use('/ticket', ticketRouter())
    app.use('/admin', adminRouter())
    app.use('/api', apiRouter())
    app.use('/help', helpRouter())
    app.get('*', routes.index)
}