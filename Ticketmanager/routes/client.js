var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var clientprovider = new ClientProvider()
/*
 * GET client/add
 */
exports.add = function (req, res) {
    clientprovider.all(function (err, result) {
        var data = { title: 'Mandant hinzufügen', Applications: result }
        res.render('clients/add', data)
    })
}

/*
 * POST client
 */
exports.addPost = function (req, res) {
    clientprovider.save(req.body, function (err, result) {
        if (err) {
            res.render('client/add')
        } else {
            res.render('clients/add/success')
        }
    })
}