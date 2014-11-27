exports.nonRequestHelper = {
    jsonStringify: function (value) {
        return JSON.stringify(value)
    }, uriencode: function (item) {
        return encodeURIComponent(item)
    }, lastElement: function (array) {
        return array.reverse()[0]
    }, withLastElement: function (array, opts) {
        if (array)
            return opts.fn(array.reverse()[0])
        else
            return opts.inverse(this)
    }, inArrayId: function (array, id, opts) {
        var lookup = {}
        if (array) {
            for (var i = 0; i < array.length; i++) {
                lookup[array[i]._id] = array[i]
            }
        }
        if (lookup[id])
            return opts.fn(this)
        else
            return opts.inverse(this)
    }, formatWorker: function (worker) {
        if (worker) {
            if (worker.firstname && worker.lastname) {
                return worker.firstname + '\u00A0' + worker.lastname
            } else {
                return worker
            }
        }
    }, withValue: function (data, opts) {
        if (data.value) {
            return opts.fn(data.value)
        } else {
            return opts.fn(data)
        }
    }
}
exports.setup = function (hbs) {
    return function (req, res, next) {
        hbs.helpers.isAdmin = function (opts) {
            if (req.session['isAdmin'])
                return opts.fn(this)
            else
                return opts.inverse(this)
        }
        hbs.helpers.loggedonuser = function () {
            return req.session['username']
        }
        hbs.helpers.currentusername = function () {
            if (req.session['fullname'])
                return req.session['fullname']
            return req.session['username']
        }
        hbs.helpers.localize = function (key) {
            return req.localize(key)
        }
        hbs.helpers.workerIsNotAssigneeOption = function (worker, assignee, opts) {
            var res = '<option value="' + worker._id + '">' + worker.firstname + ' ' + worker.lastname + (worker.department ? ' (' + req.localize(worker.department) + ')' : '') + '</option>'
            if (assignee) {
                if (!(worker != assignee && worker._id != assignee._id)) {
                    res = ''
                }
            }
            return new hbs.handlebars.SafeString(res)

        }
        hbs.helpers.commentList = function (input) {
            var res = '<ul class="list-unstyled">'
            for (item in input) {
                res +=
            '<li><blockquote>' + input[item].commentvalue + 
                '<footer>' + hbs.helpers.formatWorker(input[item].creator) + ' &mdash; ' + hbs.handlebars.helpers.formatDate(input[item].created, '%d.%m.%y %H:%M') + '</footer></blockquote></li>'
            }
            res += '</ul>'
            return new hbs.handlebars.SafeString(res)
        }
        hbs.helpers.currentUserIsAssignee = function (assignee, opts) {
            if (assignee && (assignee == req.session['username'] || assignee._id && assignee._id == req.session['username'])) {
                return opts.inverse(this)
            } else {
                return opts.fn(this)
            }
        }
        next()
    }
}