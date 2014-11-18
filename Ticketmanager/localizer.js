var fs = require('fs')
var join = require('path').join

var languages = {}
function init() {
    var files = fs.readdirSync(join(__dirname, 'languages'))
    for (lang in files) {
        var element = files[lang]
        var data = fs.readFileSync(join(__dirname, 'languages', element))
        var offset = 0
        for (i = 0; i < data.length; i++) {
            if (data[i] == 123) {
                break
            } else {
                offset++
            }
        }
        languages[element.toLowerCase().replace('.json', '')] = JSON.parse(data.toString('utf-8', offset, data.length))
    }
}
exports.localize = function (key, req) {
    var lang = req.locale
    var result = undefined
    if (languages[lang]) {
        result = languages[lang][key]
    } else if (languages['default']) {
        result = languages['default'][key]
    }
    if (!result)
        result = key
    return result
}

init()