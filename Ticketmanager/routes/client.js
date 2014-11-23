var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var clientprovider = new ClientProvider()
/*
 * GET client/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add client') }
    res.render('clients/add', data)
}

/*
 * POST client
 */
exports.addPost = function (req, res) {
    clientprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            req.body.title = req.localize('add client')
            res.render('clients/add', req.body)
        } else {
            res.render('clients/addsuccess', { title: req.localize('saved client successfully') })
        }
    })
}