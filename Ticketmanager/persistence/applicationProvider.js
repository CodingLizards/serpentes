var config = require('../config.js')
var cradle = require('cradle')

ApplicationProvider = function () {
    this.connection = new (cradle.Connection)(config.CouchDBServerHost, config.CouchDBServerPort, {
        cache: true,
        raw: false
    })
    var db = this.connection.database('ticketmanagement')
    this.db = db;
}
ApplicationProvider.prototype.save = function (application, callback) {
    application['type'] = 'application';
    this.db.save(application, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
ApplicationProvider.prototype.findAll = function (callback) {
    this.db.view('applications/all', function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, docs)
        }
    })
}
exports.ApplicationProvider = ApplicationProvider