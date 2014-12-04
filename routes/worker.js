var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()

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