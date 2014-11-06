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
    applicationprovider.all(function (err, apps) {
        if (err)
            console.warn(err)
        clientprovider.all(function (err, clients) {
            if (err)
                console.warn(err)
            departmentprovider.all(function (err, departments) {
                if (err)
                    console.warn(err)
                releaseprovider.all(function (err, releases) {
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
 * POST ticket
 */
exports.addPost = function (req, res) {
    ticketprovider.save(req.body, function (err, result) {
        if (err) {
            res.render('tickets/add')
        } else {
            res.render('tickets/addsuccess')
        }
    })
}