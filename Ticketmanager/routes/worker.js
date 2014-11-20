var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()
/*
 * GET worker/add
 */
exports.add = function (req, res) {
    var data = { title: req.localize('add worker') }
    res.render('workers/add', data)
}

/*
 * POST worker
 */
exports.addPost = function (req, res) {
    if (req.body.username) {
        workerprovider.save(req.body, function (err, result) {
            if (err) {
                req.body.error = err
                req.body.title = req.localize('add worker')
                res.render('workers/add', req.body)
            } else {
                res.render('workers/addsuccess', { title: req.localize('add worker') })
            }
        })
    } else {
        req.body.error = {
            error: "forbidden",
            reason: {
                error: "invalid value", 
                reason: ["you need to give the worker a username"]
            }
        }
        req.body.title = req.localize('add worker')
        res.render('workers/add', req.body)
    }
}