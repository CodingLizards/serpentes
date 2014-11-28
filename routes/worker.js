var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()
/*
 * GET worker/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add worker') }
    res.render('workers/add', data)
}

/*
 * POST worker
 */
exports.addPost = function (req, res) {
    if (req.body.username) {
        workerprovider.save(req.body, function (err, result) {
            if (err) {
                req.body.error = err
                req.body.title = req.localize('add worker')
                res.render('workers/add', req.body)
            } else {
                res.render('workers/addsuccess', { title: req.localize('add worker') })
            }
        })
    } else {
        req.body.error = {
            error: "forbidden",
            reason: {
                error: "invalid value", 
                reason: ["you need to give the worker a username"]
            }
        }
        req.body.title = req.localize('add worker')
        res.render('workers/add', req.body)
    }
}

/*
 * GET worker
 */
exports.index = function (req, res) {
    workerprovider.all(function (err, result) {
        res.render('workers/index', { title: req.localize('worker'), data: result })
    })
}

/*
 * GET worker/details/:id
 */
exports.details = function (req, res) {
    workerprovider.byId(req.param('id'), function (err, result) {
        res.render('workers/details', { title: req.localize('worker details'), data: result })
    })
}

/*
 * POST worker/update/:id
 */
exports.update = function (req, res) {
    var data = {
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        emailaddress: req.param('emailaddress'),
        phonenumber: req.param('phonenumber'),
        department: req.param('department')
    }
    workerprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('/worker/details/' + req.param('id'))
    })
}