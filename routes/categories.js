
var express = require('express');
var utils = require('utils');
var async = require('async');

var router = express.Router();

router.get('/', pullRequest);

function pullRequest(req, res) {

    async.waterfall([cat,subcat1,subcat2], function (err, data) {
        res.jsonp(data);
    });
}

function cat(callback) {

    var connection = utils.connect();          
    var sql = "select * from Categories";
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            //throw err;
            //res.send({error: err});
            return;
        }
        var items = [];
       for (var i = 0; i < rows.length; i++) {
            var c0 = {};
            c0.CategoryCode = rows[i].CategoryCode;
            c0.CategoryDescription = rows[i].CategoryDescription;
            c0.SubCat1 = [];
            items.push(c0);
       }
        connection.end();
        //console.log(items);
        callback(null,items);
    });
}

function subcat1(items,callback) {
    var connection = utils.connect();          
    sql = "select * from SubCategories1"; 
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            //throw err;
            //res.send({error: err});
            return;
        }
        var cat1 = [];
        for (var i = 0; i < rows.length; i++) {
            var c1 = {};
            c1.SubCategory1Code = rows[i].SubCategory1Code;
            c1.SubCategory1Description = rows[i].SubCategory1Description;
            c1.SubCat2 = [];
            for (var j = 0; j < items.length; j++) {
                if (items[j].CategoryCode == rows[i].CategoryCode) {
                    items[j].SubCat1.push(c1);
                }
            }
        }
        connection.end();
        //console.log(items);
        callback(null,items);        
    });
}

function subcat2(items,callback) {
    var connection = utils.connect();          
    sql = "select * from SubCategories2"; 
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            //throw err;
            //res.send({error: err});
            return;
        }
        var cat2 = [];
       for (var i = 0; i < rows.length; i++) {
            var c2 = {};
            c2.SubCategory2Code = rows[i].SubCategory2Code;
            c2.SubCategory2Description = rows[i].SubCategory2Description;
             for (var j = 0; j < items.length; j++) {
                for (var y = 0; y < items[j].SubCat1.length; y++) {
                    if (items[j].SubCat1[y].SubCategory1Code == rows[i].SubCategory1Code) {
                        items[j].SubCat1[y].SubCat2.push(c2);
                    }
                }
            }
           
       }
        connection.end();
        //console.log(items);
        callback(null,items);
    });
}

module.exports = router;
