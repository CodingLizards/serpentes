exports.authentication = function (env) {
    return function (req, res, next) {
        if ('development' == env) {
            req.session['isAdmin'] = true
            req.session['fullname'] = 'Theo Test'
            req.session['username'] = 'theo'
            next()
        } else {
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
    }
}