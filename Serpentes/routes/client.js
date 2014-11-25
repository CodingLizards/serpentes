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

/*
 * GET client
 */
exports.index = function (req, res) {
    clientprovider.all(function (err, result) {
        res.render('clients/index', { title: req.localize('clients'), data: result })
    })
}

/*
 * GET client/details/:id
 */
exports.details = function (req, res) {
    clientprovider.byId(req.param('id'), function (err, result) {
        res.render('clients/details', { title: req.localize('client details'), data: result })
    })
}

/*
 * POST client/update/:id
 */
exports.update = function (req, res) {
    var data = {
        name: req.param('name')
    }
    clientprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('client/details/' + req.param('id'))
    })
}