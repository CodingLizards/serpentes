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

var findByIdInList = function (key, data) {
    return data.filter(function (item) {
        return item._id == key
    })
}

var exportCSV = function (localize, fields, tickets, callback) {
    applicationprovider.all(function (err, applications) {
        departmentprovider.all(function (err, departments) {
            releaseprovider.all(function (err, releases) {
                clientprovider.all(function (err, clients) {
                    var toselect = fields.split(',')
                    var array = typeof tickets != 'object' ? JSON.parse(tickets) : tickets
                    var str = fields.replace(/\,/g, ';')
                    str += '\r\n'
                    for (var i = 0; i < array.length; i++) {
                        var line = ''
                        for (var index in toselect) {
                            index = toselect[index]
                            var item = array[i][index]
                            if (/(clients|applications|departments|release)/i.test(index)) {
                                var res = []
                                if (/release/i.test(index)) {
                                    var rel = findByIdInList(item._id, releases)
                                    if (rel) {
                                        res.push(rel.name)
                                    }
                                }
                                for (k in item) {
                                    var list = []
                                    if (/clients/i.test(index)) {
                                        list = clients
                                    } else if (/applications/i.test(index)) {
                                        list = applications
                                    } else if (/departments/i.test(index)) {
                                        list = departments
                                    }
                                    var it = findByIdInList(item[k], list)
                                    if (it[0]) {
                                        res.push(it[0].name)
                                    }
                                }
                                item = res.join(', ')
                            }
                            line += '"' + (item ? item : '') + '";'
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
 * POST admin/export
 */
exports.exportPost = function (req, res) {
    ticketprovider.allByState(req.param('type'), function (err, tickets) {
        if (err) {
            res.render('admin/export', { title: req.localize('export tickets'), error: err })
        } else {
            res.attachment('tickets.csv')
            res.setHeader('Content-Type', 'text/csv')
            exportCSV(req.localize, req.param('fields'), tickets, function (data) {
                res.end(data, 'ascii')
            })
        }
    })
}