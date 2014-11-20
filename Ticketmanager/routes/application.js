var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var applicationprovider = new ApplicationProvider()
/*
 * GET application/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add application') }
    res.render('applications/add', data)
}

/*
 * POST application
 */
exports.addPost = function (req, res) {
    applicationprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            req.body.title = req.localize('add application')
            res.render('applications/add', req.body)
        } else {
            res.render('applications/addsuccess', { title: req.localize('successfully saved application') })
        }
    })
}