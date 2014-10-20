var config = require('../config.js')
var cradle = require('cradle')

DepartmentProvider = function () {
    this.connection = new (cradle.Connection)(config.CouchDBServerHost, config.CouchDBServerPort, {
        cache: true,
        raw: false
    })
    var db = this.connection.database('ticketmanagement')
    this.db = db;
}
DepartmentProvider.prototype.save = function (department, callback) {
    department['type'] = 'department';
    this.db.save(department, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
DepartmentProvider.prototype.findAll = function (callback) {
    this.db.view('departments/all', function (error, result) {
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
exports.DepartmentProvider = DepartmentProvider