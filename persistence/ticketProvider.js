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
    this.db.view('tickets/all', function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allFree = function (callback) {
    this.db.view('tickets/free', function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allUnprioritized = function (callback) {
    this.db.view('tickets/unprioritized', function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allArchived = function (callback) {
    this.db.view('tickets/archived', function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.allActive = function (callback) {
    this.db.view('tickets/active', function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, formatResult(result))
        }
    })
}
TicketProvider.prototype.byExternal = function (type, id, callback) {
    var provider = new TicketProvider()
    switch (type) {
        case 'client':
            provider.byClient(id, callback)
            break
        case 'worker':
            provider.byWorker(id, callback)
            break
        case 'application':
            provider.byApplication(id, callback)
            break
        case 'department':
            provider.byDepartment(id, callback)
            break
        case 'release':
            provider.byRelease(id, callback)
            break
        default:
            provider.all(callback)
            break
    }
}
TicketProvider.prototype.byRelease = function (release, callback) {
    this.db.view('tickets/byRelease', { key: release }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, sort(result))
        }
    })
}
TicketProvider.prototype.byWorker = function (worker, callback) {
    this.db.view('tickets/byWorker', { key: worker }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, sort(result))
        }
    })
}
TicketProvider.prototype.byClient = function (client, callback) {
    this.db.view('tickets/byClient', { key: client }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, sort(result))
        }
    })
}
TicketProvider.prototype.byApplication = function (application, callback) {
    this.db.view('tickets/byApplication', { key: application }, function (error, result) {
        if (error) {
            callback(error)
        } else {
            callback(null, sort(result))
        }
    })
}
TicketProvider.prototype.byDepartment = function (department, callback) {
    this.db.view('tickets/byDepartment', { key: department }, function (error, result) {
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