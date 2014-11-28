var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var departmentprovider = new DepartmentProvider()
/*
 * GET department/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add department') }
    res.render('departments/add', data)
}

/*
 * POST department
 */
exports.addPost = function (req, res) {
    departmentprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            req.body.title = req.localize('add department')
            res.render('departments/add', req.body)
        } else {
            res.render('departments/addsuccess', { title: req.localize('saved department successfully') })
        }
    })
}

/*
 * GET department
 */
exports.index = function (req, res) {
    departmentprovider.all(function (err, result) {
        res.render('departments/index', { title: req.localize('departments'), data: result })
    })
}

/*
 * GET department/details/:id
 */
exports.details = function (req, res) {
    departmentprovider.byId(req.param('id'), function (err, result) {
        res.render('departments/details', { title: req.localize('department details'), data: result })
    })
}

/*
 * POST department/update/:id
 */
exports.update = function (req, res) {
    var data = {
        name: req.param('name')
    }
    departmentprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('/department/details/' + req.param('id'))
    })
}