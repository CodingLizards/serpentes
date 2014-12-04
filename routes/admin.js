var TicketProvider = require('../persistence/ticketprovider.js').TicketProvider
var ticketprovider = new TicketProvider()

var exportCSV = function (tickets, callback) {
    var array = typeof tickets != 'object' ? JSON.parse(tickets) : tickets;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            line += '"' + array[i][index] + '";';
        }
        line.slice(0, line.Length - 1);
        str += line + '\r\n';
    }
    callback(str)
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
            exportCSV(tickets, function (data) {
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
            exportCSV(tickets, function (data) {
                res.end(data, 'ascii')
            })
        }
    })
}