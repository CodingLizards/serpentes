var TicketProvider = require('../persistence/ticketProvider.js').TicketProvider
var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider
var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider

var ticketprovider = new TicketProvider()
var applicationprovider = new ApplicationProvider()
var clientprovider = new ClientProvider()
var departmentprovider = new DepartmentProvider()
var releaseprovider = new ReleaseProvider()
var workerprovider = new WorkerProvider()

var minifyUser = function (user) {
    var result = {
        firstname: user.firstname,
        lastname: user.lastname,
        emailaddress: user.emailaddress,
        phonenumber: user.phonenumber
    }
    return result
}

var postComment = function (req, callback) {
    workerprovider.byId(req.session['username'], function (err, user) {
        var data = {
            commentvalue: req.param('commentvalue'), 
            creator: err ? req.session['username'] : minifyUser(user),
            created: new Date(Date.now())
        }
        ticketprovider.addComment(req.param('id'), data, function (error, result) {
            callback(error, result)
        })
    })
}

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

/*
 * GET ticket/details/:id
 */
exports.details = function (req, res) {
    ticketprovider.byId(req.param('id'), function (error, result) {
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
                        workerprovider.all(function (err, workers) {
                            if (err)
                                console.warn(err)
                            res.render('tickets/details', { title: req.localize('ticket details'), details: result, Applications: apps, Clients: clients, Departments: departments, Releases: releases, Workers: workers })
                        })
                    })
                })
            })
        })
    })
}

/*
 * POST ticket/comments/:id
 */
exports.comment = function (req, res) {
    postComment(req, function (error, result) {
        res.redirect('ticket/details/' + req.param('id') + '#comments')
    })
}

/*
 * GET ticket/:state
 */
exports.index = function (req, res) {
    ticketprovider.allByState(req.param('state'), function (err, result) {
        if (err) {
            console.log(err)
        }
        var data = {
            tickets: result
        }
        
        switch (req.param('state')) {
            case 'active':
                data.title = req.localize('active tickets')
                break
            case 'free':
                data.title = req.localize('free tickets')
                break
            case 'archived':
                data.title = req.localize('archived tickets')
                break
            case 'unprioritized':
                data.title = req.localize('unprioritized tickets')
                break
            default:
                data.title = req.localize('show tickets')
                break
        }
        res.render('tickets/index', data)
    })
}

/*
 * POST ticket/update/:id
 */
exports.update = function (req, res) {
    var data = {
        priority: req.param('priority'),
        description: req.param('description'),
        deadline: req.param('deadline'),
        emergency: req.param('emergency'),
        brandharming: req.param('brandharming'),
        minutesperweek: req.param('minutesperweek'),
        ordervolume: req.param('ordervolume'),
        impactdescription: req.param('impactdescription'),
        applications: req.param('applications'),
        departments: req.param('departments'),
        clients: req.param('clients'),
        release: req.param('release')
    }
    ticketprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('ticket/details/' + req.param('id'))
    })
}

/*
 * POST ticket/assign/:id/:username
 */
exports.assign = function (req, res) {
    workerprovider.byId(req.param('username'), function (err, user) {
        var data = {
            assignee: err ? req.param('username') : minifyUser(user)
        }
        ticketprovider.assign(req.param('id'), data, function (err, result) {
            postComment(req, function (err, result) {
                res.redirect('ticket/details/' + req.param('id'))
            })
        })
    })
}

/*
 * POST ticket/reviewed/:id
 */
exports.reviewed = function (req, res) {
    workerprovider.byId(req.session['username'], function (err, user) {
        var data = {
            commentvalue: req.param('reviewcomment'), 
            creator: err ? req.session['username'] : minifyUser(user),
            created: new Date(Date.now())
        }
        ticketprovider.review(req.param('id'), data, function (err, result) {
            res.redirect('ticket/details/' + req.param('id'))
        })
    })
}

/*
 * POST ticket/archive/:id
 */
exports.archive = function (req, res) {
    ticketprovider.update(req.param('id'), { archived: true }, function (err, result) {
        workerprovider.byId(req.session['username'], function (err, user) {
            postComment(req, function (err, result) {
                res.redirect('ticket/details/' + req.param('id'))
            })
        })
    })
}