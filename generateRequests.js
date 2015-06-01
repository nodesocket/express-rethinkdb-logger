var config  = require('./config'),
    request = require('request'),
    colors  = require('cli-color');

var totalRequests = 500;
if(process.argv[2]) {
    totalRequests = parseInt(process.argv[2]);
}

for(var i = 0; i < totalRequests; i++) {
    (function(i) {
        request('http://localhost:' + config.port + '/', function(error, response, body) {
            if(error) {
                console.error(colors.redBright('Request ' + (i + 1) + ' - ' + error.message));
            } else {
                console.info(colors.greenBright('Request ' + (i + 1) + ' - ' + response.statusCode));
            }
        });
    })(i);
}
