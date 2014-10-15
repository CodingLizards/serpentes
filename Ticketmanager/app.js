/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes')
var http = require('http')
var path = require('path')

var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var app = express()
var hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: {
        isAdmin: function (opts) { 
            return opts.fn(this)
        }
    }
})

hbshelper.register(hbs.handlebars, { marked: undefined })

// all environments
app.engine('.hbs', hbs.engine)
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//var func = require('edge').func('AuthenticationMapper.dll')

//func(input, function (error, result) {
//    console.log(error)    
//    if (result != null) {
//        console.log('Authenticated');
//    }
//    else
//        console.log(' Bad password');
//});
