﻿var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var applicationprovider = new ApplicationProvider()
/*
 * GET application/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add application') }
    res.render('applications/add', data)
}

/*
 * POST application
 */
exports.addPost = function (req, res) {
    applicationprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.error = err
            req.body.title = req.localize('add application')
            res.render('applications/add', req.body)
        } else {
            res.render('applications/addsuccess', { title: req.localize('saved application successfully') })
        }
    })
}

/*
 * GET application
 */
exports.index = function (req, res) {
    applicationprovider.all(function (err, result) {
        res.render('applications/index', { title: req.localize('applications'), data: result })
    })
}

/*
 * GET application/details/:id
 */
exports.details = function (req, res) {
    applicationprovider.byId(req.param('id'), function (err, result) {
        res.render('applications/details', { title: req.localize('application details'), data: result })
    })
}

/*
 * POST application/update/:id
 */
exports.update = function (req, res) {
    var data = {
        name: req.param('name')
    }
    applicationprovider.update(req.param('id'), data, function (err, result) {
        res.redirect('/application/details/' + req.param('id'))
    })
}