module.exports = [
    [
        '/',
        function () {
            return 'task-list.html';
        }
    ],
    [
        /^\/(\w+)\/(\w+)$/,
        function (all, k1, k2) {
            return k1 + '-' + k2 + '.html';
        }
    ]
]