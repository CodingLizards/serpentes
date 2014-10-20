var TicketProvider = require('../persistence/ticketProvider.js').TicketProvider
var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider

var ticketprovider = new TicketProvider()
var applicationprovider = new ApplicationProvider()
var clientprovider = new ClientProvider()
var departmentprovider = new DepartmentProvider()
var releaseprovider = new ReleaseProvider()
/*
 * GET ticket/add
 */
exports.add = function (req, res) {
    applicationprovider.findAll(function (err, apps) {
        if (err)
            console.warn(err)
        clientprovider.findAll(function (err, clients) {
            if (err)
                console.warn(err)
            departmentprovider.findAll(function (err, departments) {
                if (err)
                    console.warn(err)
                releaseprovider.findAll(function (err, releases) {
                    if (err)
                        console.warn(err)
                    var data = { title: 'Ticket hinzufügen', Applications: apps, Clients: clients, Departments: departments, Releases: releases }
                    res.render('tickets/add', data)
                })
            })
        })
    })
}

/*
 * GET ticket/add/fail
 */
exports.addFail = function (req, res) {
    res.render('tickets/addfail')
}

/*
 * GET ticket/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('tickets/addsuccess')
}

/*
 * POST ticket
 */
exports.addPost = function (req, res) {
    ticketprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('ticket/add/fail')
        } else {
            res.redirect('ticket/add/success')
        }
    })
}