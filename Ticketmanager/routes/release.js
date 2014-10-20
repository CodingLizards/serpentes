var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider
var releaseprovider = new ReleaseProvider()
/*
 * GET release/add
 */
exports.add = function (req, res) {
    releaseprovider.findAll(function (err, result) {
        var data = { title: 'Release hinzufügen', Releases: result }
        res.render('releases/add', data)
    })
}

/*
 * GET release/add/fail
 */
exports.addFail = function (req, res) {
    res.render('releases/addfail')
}

/*
 * GET release/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('releases/addsuccess')
}

/*
 * POST release
 */
exports.addPost = function (req, res) {
    releaseprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('release/add/fail')
        } else {
            res.redirect('release/add/success')
        }
    })
}