var cradle = require('cradle')

ApplicationProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
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
ApplicationProvider.prototype.all = function (callback) {
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