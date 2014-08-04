
var express = require('express');
var utils = require('utils');

var router = express.Router();

router.get('/', pullRequest);

function pullRequest(req, res) {
    
    
    req.session.clientID = 1;
    
    utils.getAccPar("ECom.Home",function (err,rows,fields) {
        if (err) {
            throw err;
            //return;
        }
        res.jsonp({ message: rows[0].SettingValue });
    });
         
}

module.exports = router;
