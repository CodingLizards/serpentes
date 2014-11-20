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
            res.render('departments/addsuccess', { title: req.localize('successfully saved department') })
        }
    })
}