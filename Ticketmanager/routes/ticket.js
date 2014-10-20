var TicketProvider = require('../persistence/ticketProvider.js').TicketProvider
var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider

var ticketprovider = new TicketProvider()
var applicationprovider = new ApplicationProvider()
/*
 * GET ticket/add
 */
exports.add = function (req, res) {
    applicationprovider.findAll(function (err, result) {
        var data = { title: 'Ticket hinzufügen', Applications: result }
        res.render('tickets/add', data)
    })
}

/*
 * GET ticket/add/fail
 */
exports.addFail = function (req, res) {
    res.render('tickets/addfail')
}

/*
 * GET ticket/add/success
 */
exports.addSuccess = function (req, res) {
    res.render('tickets/addsuccess')
}

/*
 * POST ticket
 */
exports.addPost = function (req, res) {
    ticketprovider.save(req.body, function (err, result) {
        if (err) {
            res.redirect('ticket/add/fail')
        } else {
            res.redirect('ticket/add/success')
        }
    })
}