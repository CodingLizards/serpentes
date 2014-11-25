var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()

/*
 * GET admin/users
 */
exports.index = function (req, res) {
    if (req.session['isAdmin']) {
        workerprovider.all(function (err, result) {
            res.render('admin/users/index', { title: req.localize('worker'), data: result })
        })
    } else {
        res.redirect('/')
    }
}

/*
 * GET admin/users/details/:id
 */
exports.details = function (req, res) {
    if (req.session['isAdmin']) {
        workerprovider.byId(req.param('id'), function (err, result) {
            res.render('admin/users/details', { title: req.localize('worker details'), data: result })
        })
    } else {
        res.redirect('/')
    }
}

/*
 * POST admin/users/update/:id
 */
exports.update = function (req, res) {
    if (req.session['isAdmin']) {
        var data = {
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
            emailaddress: req.param('emailaddress'),
            phonenumber: req.param('phonenumber'),
            department: req.param('department'),
            isadmin: req.param('isadmin')
        }
        workerprovider.update(req.param('id'), data, function (err, result) {
            res.redirect('admin/users/details/' + req.param('id'))
        })
    } else {
        res.redirect('/')
    }
}