var fs = require('fs');
var crypto = require('crypto');
module.exports = function (filepath, cut) {
    cut = cut || 10;
    var shasum = crypto.createHash('md5');
    var fileContent = fs.readFileSync(filepath);
    shasum.update(fileContent);
    return shasum.digest('hex').substring(0, cut);
};