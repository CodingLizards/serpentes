var cradle = require('cradle')

var sort = function (data) {
    return data.sort(function (a, b) {
        return a.value.priority - b.value.priority;
    })
}

TicketProvider = function () {
    this.db = require('./databaseSetup.js').getDatabase()
}
TicketProvider.prototype.allByState = function (state, callback) {
    var provider = new TicketProvider()
    switch (state) {
        case 'active':
            provider.allActive(callback)
            break
        case 'free':
            provider.allFree(callback)
            break
        case 'archived':
            provider.allArchived(callback)
            break
        case 'unprioritized':
            provider.allUnprioritized(callback)
            break
        default:
            provider.all(callback)
            break
    }
}
TicketProvider.prototype.save = function (ticket, callback) {
    ticket['type'] = 'ticket'
    var ticketnumber = ticket.ticketnumber
    delete ticket['ticketnumber']
    this.db.save(ticketnumber, ticket, function (err, res) {
        ticket.ticketnumber = ticketnumber
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
TicketProvider.prototype.addComment = function (id, comment, callback) {
    var provider = new TicketProvider()
    provider.byId(id, function (error, ticket) {
        if (!ticket.comments) {
            ticket.comments = []
        }
        ticket.comments.push(comment)
        var data = { comments: ticket.comments }
        provider.db.merge(id, data, function (err, res) {
            if (err) {
                console.error(err)
                callback(err, null)
            } else {
                console.log(res)
                callback(null, res)
            }
        })
    })
}

TicketProvider.prototype.all = function (callback) {
    this.db.view('tickets/all', new { include_docs: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, sort(docs))
        }
    })
}
TicketProvider.prototype.allFree = function (callback) {
    this.db.view('tickets/free', new { include_docs: true}, function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, sort(docs))
        }
    })
}
TicketProvider.prototype.allUnprioritized = function (callback) {
    this.db.view('tickets/unprioritized', function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, sort(docs))
        }
    })
}
TicketProvider.prototype.allArchived = function (callback) {
    this.db.view('tickets/archived', function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, sort(docs))
        }
    })
}
TicketProvider.prototype.allActive = function (callback) {
    this.db.view('tickets/active', function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, docs);
        }
    })
}
TicketProvider.prototype.byCurrentWorker = function (workerid, callback) {
    this.db.view('tickets/byCurrentWorker', { key: workerid }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, sort(result))
        }
    })
}
TicketProvider.prototype.byId = function (id, callback) {
    var opts = {
        startkey: [id],
        endkey: [id, {}],
        reduce: true,
        json: true
    }
    this.db.view('tickets/byId/', opts, function (error, result) {
        if (error) {
            callback(error)
        } else {
            var docs = []
            result.forEach(function (row) {
                docs.push(row)
            })
            callback(null, docs[0]);
        }
    })
}
exports.TicketProvider = TicketProvider