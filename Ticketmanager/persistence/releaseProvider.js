var cradle = require('cradle')

ReleaseProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
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
ReleaseProvider.prototype.all = function (callback) {
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