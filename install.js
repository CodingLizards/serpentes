var http = require('http')
var fs = require('fs')
var path = require('path')

var parseForm = function (data) {
    var reg = /-----------------------------.+(\r\n|\r|\n)Content-Disposition: form-data; name="/
    var sections = data.split(reg)
    var result = {}
    for (sec in sections) {
        var values = sections[sec].split(/\b"(\r\n|\r|\n)(\r\n|\r|\n)/)
        if (/certificate"; filename/.test(values[0])) {
            var key = values[0].replace(/"; filename=".*/i, '')
            var value = values[3].replace(/Content-Type: application\/x-pkcs12(\r\n|\n|\r)+/i, '').replace(/-----------------------------.+--(\r\n|\r|\n)/, '')
            result[key] = new Buffer(value, 'ascii').toString()
        } else if (values[3]) {
            var key = values[0]
            var value = values[3].replace(/(\r\n|\r|\n)/, '')
            result[key] = value
        }
    }
    return result
}

var server = http.createServer(function (req, res) {
    console.log(req.method)
    if (req.method == 'GET') {
        res.writeHead(200, { "content-type": "text/html" })
        res.end(fs.readFileSync(path.join(__dirname, 'install.html')))
    } else if (req.method == 'POST') {
        req.setEncoding('base64')
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function (data) {
            if (data) {
                body += data
            }
            var parameter = parseForm(new Buffer(body, 'base64').toString('ascii'))
            var startbat = ''
            
            for (var p in parameter) {
                if (p == 'certificate') {
                    fs.writeFile(path.join(__dirname, 'server.p12'), parameter[p], function (err) {
                        console.error(err)
                        console.error('please copy the file to "' + __dirname + '" and name it server.p12')
                    })
                } else {
                    startbat += 'set ' + p + '=' + parameter[p] + '\r\n'
                }
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
console.log('start server on ' + process.env.PORT)
server.listen(process.env.PORT)
