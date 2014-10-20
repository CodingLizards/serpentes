var config = require('../config.js')
var cradle = require('cradle')

ReleaseProvider = function () {
    this.connection = new (cradle.Connection)(config.CouchDBServerHost, config.CouchDBServerPort, {
        cache: true,
        raw: false
    })
    var db = this.connection.database('ticketmanagement')
    this.db = db;
}
ReleaseProvider.prototype.save = function (release, callback) {
    release['type'] = 'release';
    this.db.save(release, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
ReleaseProvider.prototype.findAll = function (callback) {
    this.db.view('releases/all', function (error, result) {
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
exports.ReleaseProvider = ReleaseProvider