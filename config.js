var config = {};

config.port = process.env.port || 3000;

config.rethinkdb = {
    host: 'rethink1.commando.io',
    port: 28015,
    db: 'logs',
    table: 'requests'
};

module.exports = config;
