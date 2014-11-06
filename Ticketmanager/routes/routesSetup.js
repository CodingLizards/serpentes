var routes = require('./')
var account = require('./account.js')
var ticket = require('./ticket.js')
var application = require('./application.js')
var department = require('./department.js')
var client = require('./client.js')
var release = require('./release.js')

exports.setup = function (app) {
    app.get('/', routes.index)
    
    app.get('/login', account.login)
    app.post('/login', account.loginPost)
    
    app.get('/ticket/add', ticket.add)
    app.post('/ticket/add', ticket.addPost)
    
    app.get('/application/add', application.add)
    app.post('/application/add', application.addPost)
    
    app.get('/department/add', department.add)
    app.post('/department/add', department.addPost)
    
    app.get('/client/add', client.add)
    app.post('/client/add', client.addPost)
    
    app.get('/release/add', release.add)
    app.post('/release/add', release.addPost)
}