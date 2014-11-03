var cradle = require('cradle')

getDatabase = function () {
    var connection = new (cradle.Connection)(process.env.COUCHDBSERVERHOST, process.env.COUCHDBSERVERPORT, {
        cache: true,
        raw: false
    })
    var db = connection.database('ticketmanagement')
    return db
}

exports.getDatabase = getDatabase
exports.setup = function () {
    getDatabase().exists(function (err, exists) {
        if (err) {
            console.error(err)
        } else if (!exists) {
            console.log('call setup to create database and views')
            db.create()
            db.save('_design/tickets', {
                free: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (!doc.assigned && doc.priority) {
                                emit([doc.applications, doc.clients, doc.release, doc.departments, 0], doc)
                            }
                        } else if (doc.type == 'application') {
                            emit([doc._id, 1], doc)
                        } else if (doc.type == 'client') {
                            emit([doc._id, 2], doc)
                        } else if (doc.type == 'release') {
                            emit([doc._id, 3], doc)
                        } else if (doc.type == 'department') {
                            emit([doc._id, 4], doc)
                        }
                    }
                },
                unprioritised: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (!doc.priority) {
                                emit(doc.id, doc)
                            }
                        }
                    }
                },
                archived: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (doc.archived) {
                                emit(doc.id, doc)
                            }
                        }
                    }
                },
                active: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (doc.assigned) {
                                emit(doc.id, doc)
                            }
                        }
                    }
                }
            })
            db.save('_design/applications', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'application') {
                            emit(doc.id, doc)
                        }
                    }
                }
            })
            db.save('_design/clients', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'client') {
                            emit(doc.id, doc)
                        }
                    }
                }
            })
            db.save('_design/departments', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'department') {
                            emit(doc.id, doc)
                        }
                    }
                }
            })
            db.save('_design/releases', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'release') {
                            emit(doc.id, doc)
                        }
                    }
                }
            })
        }
    })
}