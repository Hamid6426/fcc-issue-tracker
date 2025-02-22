'use strict';

module.exports = function (app) {

    app.route('/:project/').get(function (req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
    });

    app.route('/').get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

    app.use(function (req, res, next) {
        res.status(404)
            .type('text')
            .send('Not Found');
    });

};