var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var applicationprovider = new ApplicationProvider()
/*
 * GET application/add
 */
exports.add = function (req, res) {
    applicationprovider.findAll(function (err, result) {
        var data = { title: 'Ticket hinzufügen', Applications: result }
        res.render('applications/add', data)
    })
}

/*
 * GET application/add/fail
 */
exports.addFail = function (req, res) {
    res.render('applications/addfail')
}

/*
 * GET application/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('applications/addsuccess')
}

/*
 * POST application
 */
exports.addPost = function (req, res) {
    applicationprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('application/add/fail')
        } else {
            res.redirect('application/add/success')
        }
    })
}