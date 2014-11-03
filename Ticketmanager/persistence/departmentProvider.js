﻿var cradle = require('cradle')

DepartmentProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
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
DepartmentProvider.prototype.all = function (callback) {
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