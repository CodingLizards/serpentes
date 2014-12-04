var fs = require('fs')
var __join = require('path').join
var marked = require('marked')
var renderer = new marked.Renderer()
renderer.listitem = function (text) {
    if (/\[.\]/g.test(text))
        return '<li class="no-bullet">' + text + '</li>\n'
    else
        return '<li>' + text + '</li>\n'
}

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
})

var TicketProvider = require('../persistence/ticketProvider.js').TicketProvider
var ticketProvider = new TicketProvider()

/*
 * GET /
 */

exports.index = function (req, res) {
    ticketProvider.byExternal('worker', req.session['username'], function (error, result) {
        res.render('index', { title: req.localize('my tickets'), tickets: result })
    })
}

/*
 * GET about
 */
exports.about = function (req, res) {
    var readme = fs.readFileSync(__join(__dirname, '..', 'README.md')).toString('utf8')
    var data = marked(readme)
    data = data.replace(/\[ \]/g, '<i class="fa fa-square-o"></i>')
    data = data.replace(/\[x\]/g, '<i class="fa fa-check-square-o"></i>')
    fs.writeFileSync(__join(__dirname, '..', 'views', 'about.hbs'), data)
    res.render('about', { title: req.localize('about') })
}