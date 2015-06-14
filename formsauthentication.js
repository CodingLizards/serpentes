var crypto = require('crypto')

exports.hashPassword = function (user) {
    var hasher = crypto.createHash('sha256')
    hasher.update(user.username + user.password, 'ascii')
    return hasher.digest('base64')
}