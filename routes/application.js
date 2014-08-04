
var express = require('express');
var utils = require('utils');

var router = express.Router();

router.get('/', pullRequest);

function pullRequest(req, res) {
    
    
    req.session.clientID = 1;
    
    utils.getCliPar("GST.Component",req,function (err,rows,fields) {
        if (err) {
            throw err;
            //return;
        }
        res.jsonp({ GST: rows[0].SettingValue, ClientID: 1 });
    });
         
}

module.exports = router;