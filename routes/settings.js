﻿var SettingsProvider = require('../persistence/settingsProvider.js').SettingsProvider
var settingsProvider = new SettingsProvider()

/*
 * GET /admin/settings/language
 */
exports.language = function (req, res) {
    res.render('admin/settings/language', { title: req.localize('reload language files') })
}

/*
 * GET /admin/settings/language/reload
 */
exports.reloadLanguage = function (req, res) {
    var result
    try {
        require('codinglizards-localizer').initialize()
        result = 'reloading language files worked fine'
    } catch (ex) {
        console.error(ex)
        result = 'error reloading language files'
    }
    res.render('admin/settings/language', { title: req.localize('reload language files'), result: req.localize(result) })
}

/*
 * GET /admin/settings/design
 */
exports.design = function (req, res) {
    settingsProvider.find(function (error, result) {
        if (error) {
            result = exports.designvalues
        }
        res.render('admin/settings/configuredesign', { title: req.localize('configure colors'), colors: result })
    })
}

/*
 * POST /admin/settings/design
 */
exports.configuredesign = function (req, res) {
    settingsProvider.save(req.body, function (error, result) {
        if (error) {
            res.render('admin/settings/configuredesign', { title: req.localize('configure colors'), colors: req.body })
        } else {
            exports.initializedesign(function () {
                res.redirect('/admin/settings/design')
            })
        }
    })
}

exports.designvalues = {
    "brand-color": "#177",
    "success-color": "#7fdb7f",
    "info-color": "#27a6c0",
    "warning-color": "#ffb73a",
    "error-color": "#d83c3c",
    "text-color": "#fafdff"
}
exports.initializedesign = function (callback) {
    settingsProvider.find(function (error, result) {
        if (result) {
            for (item in result) {
                if (result[item])
                    exports.designvalues[item] = result[item]
            }
            if (callback) {
                callback()
            }
        }
    })
}