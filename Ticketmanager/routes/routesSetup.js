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
}