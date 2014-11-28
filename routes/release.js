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

/*
 * GET release
 */
exports.index = function (req, res) {
    releaseprovider.all(function (err, result) {
        res.render('releases/index', { title: req.localize('releases'), data: result })
    })
}

/*
 * GET release/details/:id
 */
exports.details = function (req, res) {
    releaseprovider.byId(req.param('id'), function (err, result) {
        res.render('releases/details', { title: req.localize('release details'), data: result })
    })
}

/*
 * POST release/update/:id
 */
exports.update = function (req, res) {
    var data = {
        name: req.param('name'),
        releasedate: req.param('releasedate')
    }
    releaseprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('/release/details/' + req.param('id'))
    })
}