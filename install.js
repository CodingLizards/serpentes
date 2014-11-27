var http = require('http')
var fs = require('fs')
var path = require('path')

var parseForm = function (data) {
    var parts = 'set ' + decodeURIComponent(data.replace(/&/g, '\r\nset '))
    return parts
}

var checkFile = function (res) {
    res.writeHead(200, { "content-type": "text/html" })
    fs.exists(path.join(__dirname, 'server.p12'), function (exists) {
        if (exists) {
            res.end(fs.readFileSync(path.join(__dirname, 'installsuccess.html')))
            console.log('it is supposed to crash now')
            response.end()
        } else {
            res.writeHead(500, { "content-type": "text/html" })
            var page = fs.readFileSync(path.join(__dirname, 'installcertmissing.html'), { encoding: 'utf8' }).replace('{{folder}}', __dirname)
            console.log(typeof page)
            res.end(page)
        }
    })
}

var server = http.createServer(function (req, res) {
    if (req.method == 'GET') {
        res.writeHead(200, { "content-type": "text/html" })
        res.end(fs.readFileSync(path.join(__dirname, 'install.html')))
    } else if (req.method == 'POST') {
        console.log(req.url)
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function (data) {
            if (data) {
                body += data
            }
            if (req.url == '/') {
                var startbat = parseForm(body)
                startbat += '\r\nnodemon app.js'
                fs.writeFile(path.join(__dirname, 'start.bat'), startbat, function (err) {
                    if (err) {
                        console.log(err)
                        res.writeHead(500, { "content-type": "text/plain" })
                        res.end('an error occured, try again please')
                    } else {
                        checkFile(res)
                    }
                })
            } else if (req.url == '/ready') {
                checkFile(res)
            }
        })
    }
})
console.log('start server on ' + process.env.PORT)
server.listen(process.env.PORT)
