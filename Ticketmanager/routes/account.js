var edge = require('edge')
var login = edge.func('AuthenticationMapper.dll')
var config = require('../config.js')

/*
 * GET login
 */

exports.login = function (req, res) {
    res.render('account/login', { layout: false })
}

/*
 * POST login
 */

exports.loginPost = function (req, res) {
    var input = {
        UserName: req.body.username,
        Domain: req.body.domain != undefined ? req.body.domain : config.DefaultDomain,
        Password: req.body.password
    }
    login(input, function (error, result) {
        if (error) {
            console.error(error)
            res.redirect('/login')
        } else {
            console.log('login result ' + result)
            req.session['authenticated'] = result
            req.session['username'] = input.UserName
            res.redirect('/')
        }
    })
}