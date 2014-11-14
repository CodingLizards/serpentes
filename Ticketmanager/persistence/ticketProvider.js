var cradle = require('cradle')

TicketProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
}
TicketProvider.prototype.save = function (ticket, callback) {
    ticket['type'] = 'ticket'
    this.db.save(ticket, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
TicketProvider.prototype.findAllFree = function (callback) {
    this.db.view('tickets/free',new { include_docs: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, docs);
        }
    })
}
TicketProvider.prototype.findAllUnprioritised = function (callback) {
    this.db.view('tickets/unprioritised', function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, docs);
        }
    })
}
exports.TicketProvider = TicketProvider