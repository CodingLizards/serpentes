var cradle = require('cradle')

var sort = function (data) {
    return data.sort(function (a, b) {
        return a.priority - b.priority;
    })
}

var formatResult = function (data) {
    var docs = []
    data.forEach(function (row) {
        if (row && row.type == 'ticket')
            docs.push(row)
    })
    return sort(docs)
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
TicketProvider.prototype.update = function (ticketnumber, ticket, callback) {
    this.db.merge(ticketnumber, ticket, function (err, res) {
        if (err) {
            console.error(err)
            callback(err, null)
        } else {
            console.log(res)
            callback(null, res)
        }
    })
}
TicketProvider.prototype.assign = function (id, data, callback) {
    var provider = new TicketProvider()
    provider.byId(id, function (error, ticket) {
        if (!ticket.assigneehistory) {
            ticket.assigneehistory = []
        }
        ticket.assigneehistory.push(data.assignee)
        var assignment = {
            assignee: data.assignee,
            assigneehistory: ticket.assigneehistory
        }
        provider.db.merge(id, assignment, function (err, res) {
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
TicketProvider.prototype.review = function (id, data, callback) {
    var provider = new TicketProvider()
    provider.byId(id, function (error, ticket) {
        if (!ticket.reviewcomment) {
            ticket.reviewcomment = []
        }
        ticket.reviewcomment.push(data)
        var review = { reviewcomment: ticket.reviewcomment, reviewed: true }
        provider.db.merge(id, review, function (err, res) {
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
    this.db.view('tickets/all', { group: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allFree = function (callback) {
    this.db.view('tickets/free', { group: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allUnprioritized = function (callback) {
    this.db.view('tickets/unprioritized', { group: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allArchived = function (callback) {
    this.db.view('tickets/archived', { group: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allActive = function (callback) {
    this.db.view('tickets/active', { group: true }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
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
        endkey: [{}, {}, {}, {}, id]
    }
    this.db.view('tickets/byId/', opts, function (error, result) {
        if (error) {
            callback(error)
        } else {
            var doc = {}
            result.forEach(function (row) {
                if (row._id == id) {
                    doc = row
                }
            })
            callback(null, doc);
        }
    })
}
exports.TicketProvider = TicketProvider