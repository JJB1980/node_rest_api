
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session')
var bodyParser = require('body-parser');

// routing modules.
var routes = require('./routes/index');
var users = require('./routes/users');
var mysqltest = require('./routes/mysqltest');
var categories = require('./routes/categories');
var appinit = require('./routes/application.js');
var about = require('./routes/about.js');
var home = require('./routes/home.js');
var contact = require('./routes/contact.js');
var stockItem = require('./routes/stockItem.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(session({
  keys: ['se54gse5gse5ge5jfgjh', 'hfh4e56h6r5hdtage56y']
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// define routes for application
app.use('/', routes);
app.use('/users', users);

// store app restful crud api
app.use('/appinit',appinit);
app.use('/categories',categories);
app.use('/about',about);
app.use('/home',home);
app.use('/contact',contact);
app.use('/stockItem',stockItem);


// testing mysql connection and query.
app.use('/mysqltest', mysqltest);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
        });
});


module.exports = app;
