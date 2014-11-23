﻿var routes = require('./')
var account = require('./account.js')
var ticket = require('./ticket.js')
var application = require('./application.js')
var department = require('./department.js')
var client = require('./client.js')
var release = require('./release.js')
var worker = require('./worker.js')
var settings = require('./settings.js')

exports.setup = function (app) {
    app.get('/', routes.index)
    
    app.get('/logout', account.logout)
    app.get('/login', account.login)
    app.post('/login', account.loginPost)
    app.post('/login/details', account.addDetails)
    
    app.get('/ticket/add', ticket.add)
    app.post('/ticket/add', ticket.addPost)
    app.get('/ticket/details/:id', ticket.details)
    app.post('/ticket/comments/:id', ticket.comment)
    
    app.get('/worker', worker.index)
    app.get('/worker/details/:id', worker.details)
    app.get('/worker/add', worker.add)
    app.post('/worker/add', worker.addPost)
    app.post('/worker/update/:id', worker.update)
    
    app.get('/application', application.index)
    app.get('/application/details/:id', application.details)
    app.get('/application/add', application.add)
    app.post('/application/add', application.addPost)
    app.post('/application/update/:id', application.update)
    
    app.get('/department', department.index)
    app.get('/department/details/:id', department.details)
    app.get('/department/add', department.add)
    app.post('/department/add', department.addPost)
    app.post('/department/update/:id', department.update)
    
    app.get('/client', client.index)
    app.get('/client/details/:id', client.details)
    app.get('/client/add', client.add)
    app.post('/client/add', client.addPost)
    app.post('/client/update/:id', client.update)
    
    app.get('/release/add', release.add)
    app.post('/release/add', release.addPost)
    
    app.get('/admin/settings/language', settings.language)
    app.get('/admin/settings/language/reload', settings.reloadLanguage)
    app.get('/admin/settings/design', settings.design)
    app.post('/admin/settings/design', settings.configuredesign)
}