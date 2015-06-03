var config = {};

config.port = process.env.port || 3000;

config.rethinkdb = {
    host: 'your-rethinkdb-server-here',
    port: 28015,
    db: 'logs',
    table: 'requests'
};

module.exports = config;
