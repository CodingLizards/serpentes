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

var homeRouter = function () {
    var router = express.Router()
    router.get('/', routes.index)
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
var ticketRouter = function () {
    var router = express.Router()
    router.get('/', ticket.index)
    router.get('/details/:id', ticket.details)
    router.get('/add', ticket.add)
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
    router.get('/settings/language', settings.language)
    router.get('/settings/language/reload', settings.reloadLanguage)
    router.get('/settings/design', settings.design)
    router.post('/settings/design', settings.configuredesign)
    router.get('/users', user.index)
    router.get('/users/details/:id', user.details)
    router.post('/users/update/:id', user.update)
    router.get('/update', admin.update)
    router.post('/update/', admin.updatePost)
    return router
}

exports.setup = function (app) {
    app.use('/', homeRouter())
    app.use('/application', typeRouter(application))
    app.use('/department', typeRouter(department))
    app.use('/client', typeRouter(client))
    app.use('/worker', typeRouter(worker))
    app.use('/release', typeRouter(release))
    app.use('/ticket', ticketRouter())
    app.use('/admin', adminRouter())
    app.get('*', routes.index)
}