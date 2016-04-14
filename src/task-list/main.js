define(function (require, exports) {

    require('tpl!/tpl/task-list.tpl');
    require('./task-list');
    var utils = require('common/utils');

    Simplite.addFilter('dateFormat', function (ts) {
        return utils.toYMDHMS(utils.toDate(ts));
    });
});