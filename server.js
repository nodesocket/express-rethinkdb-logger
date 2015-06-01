var config     = require('./config'),
    r          = require('rethinkdb'),
    express    = require('express'),
    HTTPStatus = require('http-status'),
    path       = require('path'),
    colors     = require('cli-color'),
    app        = express(),
    uuid       = require('node-uuid'),
    morgan     = require('morgan'),
    rethinkdbConnection,
    server;

    function onExit(error) {
        if(error) {
            console.error(colors.red('Uncaught exception ') + colors.redBright(error.message));
        }

        if(server) {
            server.close();
            console.info(colors.green('Server closed.'));
        }

        if(rethinkdbConnection) {
            rethinkdbConnection.close();
            console.info(colors.green('Connection to RethinkDB closed.'));
        }

        if(error) {
            process.exit(1);
        }

        process.exit(0);
    }

    process.on('SIGINT', onExit);
    process.on('uncaughtException', onExit);

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    function handleError(res, code, error) {
        res.status(code).send({
            status_code: code,
            status: HTTPStatus[code],
            message: error.message
        });
    }

    function rethinkdbLog(obj) {
        var token = /^:([-\w]{2,})(?:\[([^\]]+)\])?$/;

        return function (tokens, req, res) {
            var data = {};

            for(var key in obj) {
                var label = token.exec(obj[key]);

                if(label !== null) {
                    var val;

                    if(key === 'response_time') {
                        val = parseFloat(tokens[label[1]](req, res, label[2]));
                    } else {
                        val = tokens[label[1]](req, res, label[2]);
                    }

                    if(val) {
                        data[key] = val;
                    }
                }
            }

            if(!isEmpty(data)) {
                r.table(config.rethinkdb.table).insert(data).run(rethinkdbConnection, function(error, result) {
                    if(error) {
                        handleError(res, HTTPStatus.INTERNAL_SERVER_ERROR, error);
                    } else if (result.inserted !== 1) {
                        handleError(res, HTTPStatus.INTERNAL_SERVER_ERROR, new Error("Failed to insert request log document into RethinkDB"));
                    }
                });
            }
        };
    }

    app.use(function(req, res, next) {
        var id = uuid.v4();

        req.id = id;
        res.setHeader('Request-Id', id);
        next();
    });

    morgan.token('id', function getId(req) {
        return req.id;
    });

    app.use(morgan(rethinkdbLog({
        id: ':id',
        date: ':date[iso]',
        http_version: ':http-version',
        method: ':method',
        url: ':url',
        status: ':status',
        response_time: ':response-time',
        remote_user: ':remote-user',
        remote_addr: ':remote-addr',
        user_agent: ':user-agent',
        referrer: ':referrer'
    })));

    ////
    // Routes
    ////
    app.get('/', function (req, res, next) {
        res.status(HTTPStatus.OK).send({
            status_code: HTTPStatus.OK,
            status: HTTPStatus[HTTPStatus.OK],
            message: null
        });
    });

    ////
    // Try connecting to RethinkDB
    ////
    r.connect(config.rethinkdb, function(error, connection) {
        if(error) {
            console.error(colors.red(error.message));
            process.exit(1);
        }

        rethinkdbConnection = connection;
        console.info(colors.green('Connected to RethinkDB ') + colors.greenBright(config.rethinkdb.host + ':' + config.rethinkdb.port + '.'));

        ////
        // Listen and start express
        ////
        server = app.listen(config.port, function () {
            console.info(colors.green('Server listening on ') + colors.greenBright(server.address().address + ':' + server.address().port + '...'));
        });
    });
