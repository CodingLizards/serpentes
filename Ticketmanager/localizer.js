var fs = require('fs')
var join = require('path').join

Localizer = function () {
    var languages = {}
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
    this.languages = languages
}
Localizer.prototype.localize = function (key, req) {
    var lang = req.locale
    if (this.languages['lang']) {
        return this.languages[lang][key]
    } else if (this.languages['default']) {
        return this.languages['default'][key]
    } else {
        return key
    }
}
exports.localizer = Localizer