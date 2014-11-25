var childprocess = require('child_process')
var server = require('http').createServer(function (req, res) {
    res.writeHead(200, { 'content/type': 'text/plain' })
    res.end('okay')
})
var io = require('socket.io').listen(server)

/*
 * GET admin/update
 */
exports.update = function (req, res) {
    res.render('admin/updates/index', { title: req.localize('update serpentes') })
}

/*
 * POST admin/update
 */
exports.updatePost = function (req, res) {
    server.listen(23400)
    io.sockets.on('connection', function (socket) {
        var process = childprocess.spawn('git', ['pull origin feature/i-like-update'], { cwd: '.' })
        process.stdout.on('data', function (data) {
            console.log(data.toString())
            socket.emit('log', { message: data.toString('UTF-8') });
        })
        process.stderr.on('data', function (data) {
            console.log(data.toString())
            socket.emit('log', { message: data.toString('UTF-8') });
        })
    })
    res.render('admin/updates/updating', { title: req.localize('updating serpentes'), server: req.host })
}