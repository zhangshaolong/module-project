var argv = require('yargs').argv;

module.exports = {
    api: {
        type: 'prefix', // prefix or suffix
        value: '/omega-compute/compute-api/' // or array like ['/api/', '/api-prefix/']
    },
    server: {
        host: argv.h || 'localhost',
        port: argv.p || 8080
    },
    rootBase: '',
    cwd: process.cwd()
};