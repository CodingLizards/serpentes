/*
 * GET /admin/settings/language
 */
exports.language = function (req, res) {
    res.render('admin/settings/language', { title: req.localize('reload language files') })
}

/*
 * GET /admin/settings/language/reload
 */
exports.reloadLanguage = function (req, res) {
    var result
    try {
        require('../localizer.js').initialize()
        result = 'reloading language files worked fine'
    } catch (ex) {
        console.error(ex)
        result = 'error reloading language files'
    }
    res.render('admin/settings/language', { title: req.localize('reload language files'), result: req.localize(result) })
}

/*
 * GET /admin/settings/design
 */
exports.design = function (req, res) {

}