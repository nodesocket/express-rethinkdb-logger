var config  = require('./config'),
    request = require('request');

var totalRequests = 500;
if(process.argv[2]) {
    totalRequests = parseInt(process.argv[2]);
}

for(var i = 0; i < totalRequests; i++) {
    (function(i) {
        request('http://localhost:' + config.port + '/', function(error, response, body) {
            if(error) {
                console.error('Error ' + error.message);
            } else {
                console.info('Request ' + (i + 1) + ' - ' + response.statusCode);
            }
        });
    })(i);
}
