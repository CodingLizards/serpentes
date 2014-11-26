var http = require('http')
var fs = require('fs')
var path = require('path')

var server = http.createServer(function (req, res) {
    console.log(req.method)
    if (req.method == 'GET') {
        res.writeHead(200, { "content-type": "text/html" })
        res.end(fs.readFileSync(path.join(__dirname, 'install.html')))
    } else if (req.method == 'POST') {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function (data) {
            if (data) {
                body += data
            }
            var parameter = body.split('&')
            var startbat = ''
            console.log(parameter)
            for (var p in parameter) {
                startbat += 'set ' + parameter[p] + '\r\n'
            }
            startbat += 'nodemon app.js'
            fs.writeFile(path.join(__dirname, 'start.bat'), startbat, function (err) {
                if (err) {
                    console.log(err)
                    res.writeHead(500, { "content-type": "text/plain" })
                    res.end('an error occured, try again please')
                } else {
                    res.writeHead(200, { "content-type": "text/html" })
                    res.end(fs.readFileSync(path.join(__dirname, 'installsuccess.html')))
                    console.log('it is supposed to crash now')
                    response.end()
                }
            })
        })
    }
})
server.listen(process.env.PORT)