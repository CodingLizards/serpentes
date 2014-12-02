var WorkerProvider = require('../persistence/workerProvider.js').WorkerProvider
var workerprovider = new WorkerProvider()

/*
 * GET worker
 */
exports.index = function (req, res) {
    workerprovider.all(function (err, result) {
        res.render('workers/index', { title: req.localize('worker'), data: result })
    })
}

/*
 * GET worker/details/:id
 */
exports.details = function (req, res) {
    workerprovider.byId(req.param('id'), function (err, result) {
        res.render('workers/details', { title: req.localize('worker details'), data: result })
    })
}