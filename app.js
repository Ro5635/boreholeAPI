const express = require('express');
const path = require('path');
const morganLogger = require('morgan');
const bodyParser = require('body-parser');

const logger = require('./Helpers/LogHelper').getLogger(__filename);
const responseMiddleware = require('./Middleware/responseMiddleware');

// Setup Routers
const index = require('./Routers/index');
const boreholesRouter = require('./Routers/boreholesRouter');

const app = express();


// Middleware
app.use(responseMiddleware.addSendResponseToRes);
app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    "use strict";
    res.setHeader('x-powered-by', 'Pepsi Max');
    res.setHeader('content-type', 'application/json');
    // TODO: Create list of allowed origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Routers
app.use('/', index);
app.use('/boreholes/', boreholesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    logger.error('Hit final error handler');
    logger.error(err);

    if (err) {
        if (err.status < 500) {
            return res.sendResponse(err.status, {msg: err.message});
        }

        return res.sendResponse(500, {msg: 'Unexpected error'});
    }

    // Otherwise send a 404
    return res.sendResponse(404, {msg: 'Endpoint not found'});

});

module.exports = app;