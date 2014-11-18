var routes = require('./')
var account = require('./account.js')
var ticket = require('./ticket.js')
var application = require('./application.js')
var department = require('./department.js')
var client = require('./client.js')
var release = require('./release.js')
var worker = require('./worker.js')

exports.setup = function (app) {
    app.get('/', routes.index)
    
    app.get('/logout', account.logout)
    app.get('/login', account.login)
    app.post('/login', account.loginPost)
    app.post('/login/details', account.addDetails)
    
    app.get('/ticket/add', ticket.add)
    app.post('/ticket/add', ticket.addPost)
    
    app.get('/worker/add', worker.add)
    app.post('/worker/add', worker.addPost)
    
    app.get('/application/add', application.add)
    app.post('/application/add', application.addPost)
    
    app.get('/department/add', department.add)
    app.post('/department/add', department.addPost)
    
    app.get('/client/add', client.add)
    app.post('/client/add', client.addPost)
    
    app.get('/release/add', release.add)
    app.post('/release/add', release.addPost)
    
    if ('development' == app.get('env')) {
        app.get('/language/redo', function (req, res) {
            require('../localizer.js').initialize()
            res.set('Content-Type', 'text/plain')
            res.send('ready')
        })
    }
}