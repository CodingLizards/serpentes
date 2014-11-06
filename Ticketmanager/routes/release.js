var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider
var releaseprovider = new ReleaseProvider()
/*
 * GET release/add
 */
exports.add = function (req, res) {
    releaseprovider.all(function (err, result) {
        var data = { title: 'Release hinzufügen', Releases: result }
        res.render('releases/add', data)
    })
}

/*
 * POST release
 */
exports.addPost = function (req, res) {
    releaseprovider.save(req.body, function (err, result) {
        if (err) {
            res.render('releases/add')
        } else {
            res.render('releases/addsuccess')
        }
    })
}