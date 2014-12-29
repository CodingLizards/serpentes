var childprocess = require('child_process')

exports.updateSocket = function (io) {
    return function (req, res, next) {
        io.on('connection', function (socket) {
            socket.on('start', function (data) {
                if (req.session['isAdmin']) {
                    socket.emit('log', { message: req.localize('updating serpentes') })
                    var process = childprocess.spawn('git' , ['pull', 'origin', 'feature/master'])
                    process.stdout.on('data', function (data) {
                        console.log(data.toString())
                        socket.emit('log', { message: data.toString('UTF-8') });
                    })
                    process.stderr.on('data', function (data) {
                        console.log(data.toString())
                        socket.emit('log', { message: data.toString('UTF-8') });
                    })
                    process.on('exit', function (code, signal) {
                        console.log('exited with code ' + code)
                        socket.emit('log', { message: 'exit with code ' + code })
                        process.kill()
                    })
                } else {
                    socket.emit('log', req.localize('only admins can update'))
                }
            })
        })
    }
}
