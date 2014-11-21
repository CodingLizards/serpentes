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
                    var data = { title: req.localize('add ticket'), Applications: apps, Clients: clients, Departments: departments, Releases: releases, Emergency: false, Brandharming: false }
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
    if (req.body.ticketnumber) {
        ticketprovider.save(req.body, function (err, result) {
            if (err) {
                req.body.error = err
                req.body.title = req.localize('add ticket')
                res.render('tickets/add', req.body)
            } else {
                res.render('tickets/addsuccess', { title: req.localize('add ticket') })
            }
        })
    } else {
        req.body.error = {
            error: "forbidden",
            reason: {
                error: "invalid value", 
                reason: ["you need to give the ticket a ticketnumber"]
            }
        }
        req.body.title = req.localize('add ticket')
        res.render('tickets/add', req.body)
    }
}