var argv = require('yargs').argv;

module.exports = {
    api: {
        type: 'prefix', // prefix or suffix
        value: ['/api-prefix/', '/compute-api/'], // or array like ['/api/', '/api-prefix/']
        ignoreProxyPaths: { // when use proxy mode, this apis use local mode
            '/api-prefix/common/user': 1,
            '/api-prefix/product/list': 1
        }
    },
    server: {
        host: argv.h || 'localhost',
        port: argv.p || 8080
    },
    rootBase: '',
    cwd: process.cwd()
};