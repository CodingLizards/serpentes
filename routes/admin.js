var TicketProvider = require('../persistence/ticketprovider.js').TicketProvider
var ApplicationProvider = require('../persistence/applicationProvider.js').ApplicationProvider
var ClientProvider = require('../persistence/clientProvider.js').ClientProvider
var DepartmentProvider = require('../persistence/departmentProvider.js').DepartmentProvider
var ReleaseProvider = require('../persistence/releaseProvider.js').ReleaseProvider
var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider

var ticketprovider = new TicketProvider()
var applicationprovider = new ApplicationProvider()
var clientprovider = new ClientProvider()
var departmentprovider = new DepartmentProvider()
var releaseprovider = new ReleaseProvider()
var workerprovider = new WorkerProvider()

var exportCSV = function (localize, fields, tickets, callback) {
    applicationprovider.all(function (err, apps) {
        departmentprovider.all(function (err, departments) {
            releaseprovider.all(function (err, releases) {
                clientprovider.all(function (err, clients) {
                    var array = typeof tickets != 'object' ? JSON.parse(tickets) : tickets;
                    var str = '';
                    for (var k in array[0]) {
                        str += '"' + localize(k) + '";'
                    }
                    str.slice(0, str.Length - 1)
                    str += '\r\n'
                    for (var i = 0; i < array.length; i++) {
                        var line = ''
                        for (var index in array[i]) {
                            line += '"' + array[i][index] + '";'
                        }
                        line.slice(0, line.Length - 1)
                        str += line + '\r\n'
                    }
                    callback(str)
                })
            })
        })
    })
}

/*
 * GET admin/update
 */
exports.update = function (req, res) {
    if (req.session['isAdmin']) {
        res.render('admin/updates/index', { title: req.localize('update serpentes'), server: req.host })
    } else {
        res.redirect('/')
    }
}

/*
 * POST admin/update
 */
exports.updatePost = function (req, res) {
    if (req.session['isAdmin']) {
        var result = ''
        var process = childprocess.spawn('git', ['pull origin'], { cwd: '.' })
        process.stdout.on('data', function (data) {
            console.log(data.toString())
            result += data.toString()
        })
        process.stderr.on('data', function (data) {
            console.log(data.toString())
            result += data.toString()
        })
        process.on('close', function (data) {
            result += data.toString()
            res.render('admin/updates/updating', { title: req.localize('update serpentes'), data: result })
        })
    } else {
        res.redirect('/')
    }
}

/*
 * GET admin/export
 */
exports.export = function (req, res) {
    res.render('admin/export', { title: req.localize('export tickets') })
}

/*
 * GET admin/export/active
 */
exports.exportActive = function (req, res) {
    ticketprovider.all(function (err, tickets) {
        if (err) {
            res.render('admin/export', { title: req.localize('export tickets'), error: err })
        } else {
            res.attachment('archivedtickets.csv')
            res.setHeader('Content-Type', 'text/csv')
            exportCSV(req.localize, req.param('fields'), tickets, function (data) {
                res.end(data, 'ascii')
            })
        }
    })
}

/*
 * GET admin/export/archived
 */
exports.exportArchived = function (req, res) {
    ticketprovider.allArchived(function (err, tickets) {
        if (err) {
            res.render('admin/export', { title: req.localize('export tickets'), error: err })
        } else {
            res.attachment('archivedtickets.csv')
            res.setHeader('Content-Type', 'text/csv')
            exportCSV(req.localize, req.param('fields'), tickets, function (data) {
                res.end(data, 'ascii')
            })
        }
    })
}