var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var clientprovider = new ClientProvider()
/*
 * GET client/add
 */
exports.add = function (req, res) {
    clientprovider.findAll(function (err, result) {
        var data = { title: 'Mandant hinzufügen', Applications: result }
        res.render('clients/add', data)
    })
}

/*
 * GET client/add/fail
 */
exports.addFail = function (req, res) {
    res.render('clients/addfail')
}

/*
 * GET client/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('clients/addsuccess')
}

/*
 * POST client
 */
exports.addPost = function (req, res) {
    clientprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('client/add/fail')
        } else {
            res.redirect('client/add/success')
        }
    })
}