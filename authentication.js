var formsTools = require('./formsauthentication.js')

exports.authentication = function (env) {
    return function (req, res, next) {
        var middleware = function () {
            if (req.path != '/login') {
                if (req.session['authenticated'] == true) {
                    next()
                } else {
                    res.redirect('/login?target=' + encodeURIComponent(req.originalUrl))
                }
            } else {
                next()
            }
        }
        if (process.env.AUTHENTICATIONMODE == 'forms' && 'development' == env) {
            var WP = require('./persistence/workerProvider.js').WorkerProvider
            var wp = new WP()
            wp.byId('theo', function (err, result) {
                if (err) {
                    var user = {
                        username: 'theo',
                        password: 'start',
                        firstname: 'Theo',
                        lastname: 'Test',
                        emailaddress: 'theo.test@test.de',
                        phonenumber: '+49 152 55709066',
                        isadmin: true,
                        department: 'projectmanagement'
                    }
                    user.password = formsTools.hashPassword(user)
                    wp.save(user, function (err, result) {
                        middleware()
                    })
                } else {
                    middleware()
                }
            })
        } else if ('development' == env) {
            req.session['isAdmin'] = true
            req.session['fullname'] = 'Theo Test'
            req.session['username'] = 'theo'
            next()
        } else {
            middleware()
        }
    }
}