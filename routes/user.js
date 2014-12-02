var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()

/*
 * GET admin/users
 */
exports.index = function (req, res) {
    workerprovider.all(function (err, result) {
        res.render('admin/users/index', { title: req.localize('manage user'), data: result })
    })
}

/*
 * GET admin/users/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add user') }
    res.render('admin/users/add', data)
}

/*
 * POST admin/users
 */
exports.addPost = function (req, res) {
    if (req.body.username) {
        workerprovider.save(req.body, function (err, result) {
            if (err) {
                req.body.error = err
                req.body.title = req.localize('add user')
                res.render('admin/users/add', req.body)
            } else {
                res.render('admin/users/addsuccess', { title: req.localize('add user') })
            }
        })
    } else {
        req.body.error = {
            error: "forbidden",
            reason: {
                error: "invalid value", 
                reason: ["you need to give the user a username"]
            }
        }
        req.body.title = req.localize('add user')
        res.render('admin/users/add', req.body)
    }
}

/*
 * GET admin/users/details/:id
 */
exports.details = function (req, res) {
    workerprovider.byId(req.param('id'), function (err, result) {
        res.render('admin/users/details', { title: req.localize('worker details'), data: result })
    })
}

/*
 * POST admin/users/update/:id
 */
exports.update = function (req, res) {
    var data = {
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        emailaddress: req.param('emailaddress'),
        phonenumber: req.param('phonenumber'),
        department: req.param('department'),
        isadmin: req.param('isadmin') ? true : false
    }
    workerprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('/admin/users/details/' + req.param('id'))
    })
}