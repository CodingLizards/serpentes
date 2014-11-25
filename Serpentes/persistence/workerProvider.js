var cradle = require('cradle')

WorkerProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
}
WorkerProvider.prototype.save = function (worker, callback) {
    worker['type'] = 'worker';
    var username = worker.username
    delete worker['username']
    this.db.save(username, worker, function (err, res) {
        worker.username = username
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
WorkerProvider.prototype.update = function (id, worker, callback) {
    this.db.merge(id, worker, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
WorkerProvider.prototype.byId = function (id, callback) {
    this.db.get(id, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, result)
        }
    })
}
WorkerProvider.prototype.all = function (callback) {
    this.db.view('workers/all', function (error, result) {
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
exports.WorkerProvider = WorkerProvider