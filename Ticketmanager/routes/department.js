var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var departmentprovider = new DepartmentProvider()
/*
 * GET department/add
 */
exports.add = function (req, res) {
    departmentprovider.all(function (err, result) {
        var data = { title: 'Abteilung hinzufügen', Applications: result }
        res.render('departments/add', data)
    })
}

/*
 * POST department
 */
exports.addPost = function (req, res) {
    departmentprovider.save(req.body, function (err, result) {
        if (err) {
            res.render('departments/add')
        } else {
            res.render('departments/addsuccess')
        }
    })
}