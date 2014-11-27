var TicketProvider = require('../persistence/ticketProvider.js').TicketProvider
var ticketProvider = new TicketProvider()


/*
 * GET home page.
 */

exports.index = function (req, res) {
    ticketProvider.byExternal('worker', req.session['username'], function (error, result) {
        res.render('index', { title: req.localize('my tickets'), tickets: result })
    })
}