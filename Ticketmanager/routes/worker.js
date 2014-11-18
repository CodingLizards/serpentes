var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()
/*
 * GET worker/add
 */
exports.add = function (req, res) {
    workerprovider.all(function (err, result) {
        var data = { title: 'Anwendung hinzufügen', Workers: result }
        res.render('workers/add', data)
    })
}

/*
 * POST worker
 */
exports.addPost = function (req, res) {
    workerprovider.save(req.body, function (err, result) {
        if (err) {
            req.body.errors = err
            res.render('workers/add', req.body)
        } else {
            res.render('workers/addsuccess')
        }
    })
}