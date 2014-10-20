var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var departmentprovider = new DepartmentProvider()
/*
 * GET department/add
 */
exports.add = function (req, res) {
    departmentprovider.findAll(function (err, result) {
        var data = { title: 'Abteilung hinzufügen', Applications: result }
        res.render('departments/add', data)
    })
}

/*
 * GET department/add/fail
 */
exports.addFail = function (req, res) {
    res.render('departments/addfail')
}

/*
 * GET department/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('departments/addsuccess')
}

/*
 * POST department
 */
exports.addPost = function (req, res) {
    departmentprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('department/add/fail')
        } else {
            res.redirect('department/add/success')
        }
    })
}