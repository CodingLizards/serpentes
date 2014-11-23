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
ApplicationProvider.prototype.update = function (id, application, callback) {
    this.db.merge(id, application, function (err, res) {
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
ApplicationProvider.prototype.byId = function (id, callback) {
    this.db.get(id, function (error, res) {
        if (error) {
            callback(error)
        } else {
            callback(null, res)
        }
    })
}

exports.ApplicationProvider = ApplicationProvider