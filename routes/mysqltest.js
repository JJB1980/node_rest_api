
var express = require('express');
var utils = require('utils');
var router = express.Router();

router.get('/', pullRequest);
router.get('/:id', pullRequest);


function pullRequest(req, res) {
    //console.log(req.params);
    var connection = utils.connect();          
    var sql = 'SELECT * FROM Inventory LIMIT 20';
    if (req.params.id) {
        sql = 'select * from Inventory where ID = ' + req.params.id;
    }
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
            return;
        }
        res.send({
            sql: sql,
            result: 'success',
            err:    '',
            json:   rows,
            length: rows.length,
            lastId: req.session.lastId
        });
    });
    if (req.params.id) {
        req.session.lastId = req.params.id;
    }

    connection.end();
}

module.exports = router;
