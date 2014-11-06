var cradle = require('cradle')

getDatabase = function () {
    var connection = new (cradle.Connection)(process.env.COUCHDBSERVERHOST, process.env.COUCHDBSERVERPORT, {
        cache: true,
        raw: false,
        auth: {
            username: process.env.COUCHDBSERVERUSERNAME, 
            password: process.env.COUCHDBSERVERPASSWORD
        }
    })
    var db = connection.database('ticketmanagement')
    return db
}

exports.getDatabase = getDatabase
exports.setup = function () {
    var db = getDatabase()
    db.exists(function (err, exists) {
        if (err) {
            console.error(err)
        } else {
            if (!exists)
                db.create()
            console.log('call setup to create database and views')
            db.save('_design/tickets', {
                language: 'javascript',
                views: {
                    free: {
                        map: function (doc) {
                            if (doc.type == 'ticket') {
                                if (!doc.assigned && doc.priority && !doc.archived) {
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
                        }, 
                        reduce: function (keys, values, rereduce) {
                            var result = null
                            var applications = []
                            var clients = []
                            var release = []
                            var departments = []
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].type == 'ticket') {
                                    result = values[i]
                                } else if (values[i].type == 'application') {
                                    applications.push(values[i])
                                } else if (values[i].type == 'client') {
                                    clients.push(values[i])
                                } else if (values[i].type == 'release') {
                                    release.push(values[i])
                                } else if (values[i].type == 'department') {
                                    departments.push(values[i])
                                }
                            }
                            if (result != null) {
                                result.applications = applications
                                result.clients = clients
                                result.release = release
                                result.departments = departments
                                return result
                            }
                        }
                    },
                    unprioritised: {
                        map: function (doc) {
                            if (doc.type == 'ticket') {
                                if (!doc.priority && !doc.archived) {
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
                        },
                        reduce: function (keys, values, rereduce) {
                            var result = null
                            var applications = []
                            var clients = []
                            var release = []
                            var departments = []
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].type == 'ticket') {
                                    result = values[i]
                                } else if (values[i].type == 'application') {
                                    applications.push(values[i])
                                } else if (values[i].type == 'client') {
                                    clients.push(values[i])
                                } else if (values[i].type == 'release') {
                                    release.push(values[i])
                                } else if (values[i].type == 'department') {
                                    departments.push(values[i])
                                }
                            }
                            if (result != null) {
                                result.applications = applications
                                result.clients = clients
                                result.release = release
                                result.departments = departments
                                return result
                            }
                        }
                    },
                    archived: {
                        map: function (doc) {
                            if (doc.type == 'ticket') {
                                if (doc.archived) {
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
                        },
                        reduce: function (keys, values, rereduce) {
                            var result = null
                            var applications = []
                            var clients = []
                            var release = []
                            var departments = []
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].type == 'ticket') {
                                    result = values[i]
                                } else if (values[i].type == 'application') {
                                    applications.push(values[i])
                                } else if (values[i].type == 'client') {
                                    clients.push(values[i])
                                } else if (values[i].type == 'release') {
                                    release.push(values[i])
                                } else if (values[i].type == 'department') {
                                    departments.push(values[i])
                                }
                            }
                            if (result != null) {
                                result.applications = applications
                                result.clients = clients
                                result.release = release
                                result.departments = departments
                                return result
                            }
                        }
                    },
                    active: {
                        map: function (doc) {
                            if (doc.type == 'ticket') {
                                if (doc.assigned && !doc.archived) {
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
                        }, 
                        reduce: function (keys, values, rereduce) {
                            var result = null
                            var applications = []
                            var clients = []
                            var release = []
                            var departments = []
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].type == 'ticket') {
                                    result = values[i]
                                } else if (values[i].type == 'application') {
                                    applications.push(values[i])
                                } else if (values[i].type == 'client') {
                                    clients.push(values[i])
                                } else if (values[i].type == 'release') {
                                    release.push(values[i])
                                } else if (values[i].type == 'department') {
                                    departments.push(values[i])
                                }
                            }
                            if (result != null) {
                                result.applications = applications
                                result.clients = clients
                                result.release = release
                                result.departments = departments
                                return result
                            }
                        }
                    }
                }
            })
            db.save('_design/applications', {
                language: 'javascript',
                views: {
                    all: {
                        map: function (doc) {
                            if (doc.type == 'application') {
                                emit(doc.id, doc)
                            }
                        }
                    }
                },
                validate_doc_update: function (newDoc, oldDoc, usrCtx) {
                    if (!newDoc.name) {
                        throw { error: "invalid value", reason: "you need to give the application a name" }
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
            db.save('_design/release', {
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