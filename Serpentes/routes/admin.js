/*
 * GET admin/update
 */
exports.update = function (req, res) {
    res.render('admin/updates/index', { title: req.localize('update serpentes'), server: req.host })
}

/*
 * POST admin/update
 */
exports.updatePost = function (req, res) {
    var result = ''
    var process = childprocess.spawn('git', ['pull origin feature/i-like-update'], { cwd: '.' })
    process.stdout.on('data', function (data) {
        console.log(data.toString())
        result += data.toString()
    })
    process.stderr.on('data', function (data) {
        console.log(data.toString())
        result += data.toString()
    })
    process.on('close', function (data) {
        result += data.toString()
        res.render('admin/updates/updating', { title: req.localize('update serpentes'), data: result })
    })
}