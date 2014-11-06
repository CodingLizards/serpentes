var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var applicationprovider = new ApplicationProvider()
/*
 * GET application/add
 */
exports.add = function (req, res) {
    applicationprovider.all(function (err, result) {
        var data = { title: 'Anwendung hinzufügen', Applications: result }
        res.render('applications/add', data)
    })
}

/*
 * POST application
 */
exports.addPost = function (req, res) {
    applicationprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.errors = err
            res.render('applications/add', req.body)
        } else {
            res.render('applications/addsuccess')
        }
    })
}