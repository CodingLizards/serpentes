var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider
var releaseprovider = new ReleaseProvider()
/*
 * GET release/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add release') }
    res.render('releases/add', data)
}

/*
 * POST release
 */
exports.addPost = function (req, res) {
    releaseprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            req.body.title = req.localize('add release')
            res.render('releases/add', req.body)
        } else {
            res.render('releases/addsuccess', { title: req.localize('add release') })
        }
    })
}