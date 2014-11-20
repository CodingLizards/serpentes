var cradle = require('cradle')

SettingsProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
}
SettingsProvider.prototype.save = function (object, callback) {
    object['type'] = 'settings';
    this.db.save('settings', object, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
SettingsProvider.prototype.find = function (callback) {
    this.db.get('settings', function (error, result) {
        if (error) {
            console.log(error)
            callback(error, result)
        } else {
            callback(null, result)
        }
    })
}
exports.SettingsProvider = SettingsProvider