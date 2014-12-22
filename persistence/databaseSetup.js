var cradle = require('cradle')

getDatabase = function () {
    var connection = new (cradle.Connection)(process.env.COUCHDBSERVERHOST, process.env.COUCHDBSERVERPORT, {
        cache: false,
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
                byId: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            emit([doc._id, doc.applications, doc.clients, doc.release, doc.departments], doc)
                        } else if (doc.type == 'application') {
                            emit([doc._id, 0], doc)
                        } else if (doc.type == 'client') {
                            emit([doc._id, 1], doc)
                        } else if (doc.type == 'release') {
                            emit([doc._id, 2], doc)
                        } else if (doc.type == 'department') {
                            emit([doc._id, 3], doc)
                        }
                    }
                },
                all: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (!doc.archived) {
                                emit(doc._id, doc)
                            }
                        }
                    }
                },
                free: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (!doc.assignee && doc.priority && !doc.archived) {
                                emit(doc._id, doc)
                            }
                        }
                    }
                },
                unprioritized: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (!doc.priority && !doc.archived) {
                                emit(doc._id, doc)
                            }
                        }
                    }
                },
                archived: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (doc.archived) {
                                emit(doc._id, doc)
                            }
                        }
                    }
                },
                active: {
                    map: function (doc) {
                        if (doc.type == 'ticket') {
                            if (doc.assignee && !doc.archived) {
                                emit(doc._id, doc)
                            }
                        }
                    }
                },
                byWorker: {
                    map: function (doc) {
                        if (doc.type == 'ticket' && doc.assignee) {
                            emit(doc.assignee._id, doc)
                        }
                    }
                },
                byClient: {
                    map: function (doc) {
                        if (doc.type == 'ticket' && doc.clients && !doc.archived) {
                            for (c in doc.clients) {
                                emit(doc.clients[c], doc)
                            }
                        }
                    }
                },
                byApplication: {
                    map: function (doc) {
                        if (doc.type == 'ticket' && doc.applications && !doc.archived) {
                            for (a in doc.applications) {
                                emit(doc.applications[a], doc)
                            }
                        }
                    }
                },
                byDepartment: {
                    map: function (doc) {
                        if (doc.type == 'ticket' && doc.departments && !doc.archived) {
                            for (d in doc.departments) {
                                emit(doc.departments[d], doc)
                            }
                        }
                    }
                },
                byRelease: {
                    map: function (doc) {
                        if (doc.type == 'ticket' && doc.release && !doc.archived) {
                            emit(doc.release, doc)
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
            db.save('_design/release', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'release') {
                            emit(doc.id, doc)
                        }
                    }
                }
            })
            db.save('_design/workers', {
                all: {
                    map: function (doc) {
                        if (doc.type == 'worker') {
                            emit([doc.department, 0], doc)
                        }
                    }
                }
            })
            db.save('_design/validation', {
                language: 'javascript',
                views: {},                
                validate_doc_update: function (newDoc, oldDoc, usrCtx) {
                    var error = { reason: [], error: '' }
                    switch (newDoc.type) {
                        case 'application':
                            if (!newDoc.name) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the application a name")
                            }
                            break;
                        case 'client':
                            if (!newDoc.name) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the client a name")
                            }
                            break;
                        case 'department':
                            if (!newDoc.name) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the department a name")
                            }
                            break;
                        case 'release':
                            if (!newDoc.name) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the release a name")
                            }
                            break;
                        case 'ticket':
                            if (!newDoc.description) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the ticket a description")
                            }
                            if (newDoc.priority && !/\d*[,|.]?\d*/.test(newDoc.priority)) {
                                error.error = "invalid value"
                                error.reason.push("the priority is invalid")
                            }
                            if (!newDoc.minutesperweek) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the ticket a impact in minutes per week")
                            } else if (!/\d*[,|.]?\d*/.test(newDoc.minutesperweek)) {
                                error.error = "invalid value"
                                error.reason.push("the impact in minutes per week is invalid")
                            }
                            if (!newDoc.ordervolume) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the ticket a impact in orders per week")
                            } else if (!/\d*/.test(newDoc.ordervolume)) {
                                error.error = "invalid value"
                                error.reason.push("the impact in orders per week is invalid")
                            }
                            if (!newDoc.impactdescription) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the ticket an impact description")
                            }
                            break;
                        case 'worker':
                            if (!newDoc.firstname) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the worker a firstname")
                            }
                            if (!newDoc.lastname) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the worker a lastname")
                            }
                            if (!newDoc.emailaddress) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the worker an emailaddress")
                            } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newDoc.emailaddress)) {
                                error.error = "invalid value"
                                error.reason.push("the emailaddress is invalid")
                            }
                            if (!newDoc.phonenumber) {
                                error.error = "invalid value"
                                error.reason.push("you need to give the worker a phonenumber")
                            } else if (!/\d/g.test(newDoc.phonenumber)) {
                                error.error = "invalid value"
                                error.reason.push("the phonenumber is invalid")
                            }
                            break;
                    }
                    if (error.error != '') {
                        throw {
                            forbidden: {
                                'error': error.error, 
                                'reason': error.reason
                            }
                        }
                    }
                }
            })
        }
    })
}