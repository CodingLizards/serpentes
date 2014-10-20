﻿var config = require('../config.js')
var cradle = require('cradle')

ClientProvider = function () {
    this.connection = new (cradle.Connection)(config.CouchDBServerHost, config.CouchDBServerPort, {
        cache: true,
        raw: false
    })
    var db = this.connection.database('ticketmanagement')
    this.db = db;
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
ClientProvider.prototype.findAll = function (callback) {
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