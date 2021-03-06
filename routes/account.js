﻿var formsTools = require('../formsauthentication.js')
var login = undefined

if (process.env.AUTHENTICATIONMODE === 'windows') {
    var edge = require('edge')
    login = edge.func(function () { 
    /*
    #r "System.DirectoryServices.AccountManagement.dll" 
    
    using System.DirectoryServices.AccountManagement;
    
    async (dynamic input) => {
        try {
            if (string.IsNullOrWhiteSpace(input.UserName) || string.IsNullOrWhiteSpace(input.Password))
                return false;

            var pc = default(PrincipalContext);
            if (input.Domain != null)
                pc = new PrincipalContext(ContextType.Domain, input.Domain);
            else
                pc = new PrincipalContext(ContextType.Domain);
            
            using (pc) {
                return pc.ValidateCredentials(input.UserName, input.Password);
            }
        } catch {
            return false;
        }
     }
     */
    })
} else if (process.env.AUTHENTICATIONMODE === 'forms') {
    login = function (input, callback) {
        var username = input.UserName
        var password = input.Password
        workerprovider.byId(username, function (err, user) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, formsTools.hashPassword({ username: username, password: password }) == user.password)
            }
        })
    }
}
var Workerprovider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new Workerprovider()

/*
 * GET login
 */
exports.login = function (req, res) {
    res.render('account/login', { layout: 'login', title: req.localize('login'), target: req.param('target') })
}

/*
 * POST login
 */
exports.loginPost = function (req, res) {
    var input = {
        UserName: req.body.username,
        Domain: process.env.DEFAULTDOMAIN,
        Password: req.body.password
    }
    login(input, function (error, result) {
        if (error || !result) {
            console.error(error ? error : "Couldn't login")
            res.redirect('/login')
        } else {
            console.log('login result ' + result)
            req.session['authenticated'] = result
            req.session['username'] = input.UserName
            workerprovider.byId(req.session['username'], function (error, result) {
                if (error || !result) {
                    res.render('account/adddetails', { layout: 'login', title: req.localize('my data'), username: req.session['username'], target: encodeURIComponent(req.param('target')), username: req.session['username'] })
                } else {
                    req.session['fullname'] = result.firstname + ' ' + result.lastname
                    req.session['isAdmin'] = result.isadmin
                    if (req.param('target'))
                        res.redirect(req.param('target'))
                    else
                        res.redirect('/')
                }
            })
        }
    })
}

/*
 * POST login/details
 */
exports.addDetails = function (req, res) {
    req.body.username = req.session['username']
    workerprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            res.render('account/adddetails', req.body)
        } else {
            res.redirect(req.param('target'))
        }
    })
}

/*
 * GET logout
 */
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/')
    })
}