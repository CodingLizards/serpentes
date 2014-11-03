var cradle = require('cradle')

ClientProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
}
ClientProvider.prototype.save = function (client, callback) {
    client['type'] = 'client';
    this.db.save(client, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
ClientProvider.prototype.all = function (callback) {
    this.db.view('clients/all', function (error, result) {
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
exports.ClientProvider = ClientProvider