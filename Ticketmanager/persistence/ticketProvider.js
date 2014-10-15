var config = require('../config.js')
var cradle = require('cradle')

ticketprovider = function () {
    this.connection = new (cradle.Connection)(host, port, {
        cache: true,
        raw: false
    })
    this.db = this.connection.database('tickets')
}
ticketprovider.prototype.setup = function (callback) {
    this.db.save('_design/tickets', {
        free: {
            map: function (doc) {
                if (!doc.assigned)
                    emit(doc.id, doc);
            }
        },
        unprioritised: {
            map: function (doc) {
                if (!doc.priority) {
                    emit(doc.id, doc)
                }
            }
        }
    })
}
ticketprovider.prototype.findAllFree = function (callback) {
    this.db.view('tickets/free', function (error, result) {
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