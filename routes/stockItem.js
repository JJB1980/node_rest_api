
var express = require('express');
var utils = require('utils');
var async = require('async');
var sizeOf = require('image-size');
var fs = require('fs');

var router = express.Router();

var _parent = this;

router.get('/', function (req, res) {
    res.jsonp(405, { status: "error", message: "Missing ID" } );
});
router.get('/:id', pullRequest);

function pullRequest(req, res) {
    
    _parent.id = req.params.id;
    _parent.cli = req.session.clientID;
    
    async.waterfall([imageLoc,folderLoc,stockItem,images], function (err, data) {
        if (err) {
            throw err;
        }
        res.jsonp(data);
    });
         
}

function imageLoc(callback) {
    var sql = "select ImageServer,ImageFolder from ClientData where ID = "+_parent.cli;
    var connection = utils.connectAdmin();
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            throw err;
            //res.send({error: err});
            //return;
        }
        var images = {};
        images.ImageServer = rows[0].ImageServer;
        images.ImageFolder = rows[0].ImageFolder;
        callback(null,images);
    });
    
}

function folderLoc(images,callback) {
    var sql = "select ServerURL,WindowsShare from ImageServer where ID = "+images.ImageServer;
    var connection = utils.connectAdmin();
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            throw err;
            //res.send({error: err});
            //return;
        }
        images.ServerURL = rows[0].ServerURL;
        images.ImageLocation = rows[0].WindowsShare;
        callback(null,images);
    });
    
}

function stockItem(images,callback) {
    var sql = "select * from Inventory where ID = "+_parent.id;
    //console.log(sql);
    var connection = utils.connect();          
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            throw err;
            //res.send({error: err});
            //return;
        }
        callback(null,rows[0],images);
    });
    
}

function images(data,images,callback) {
    var sql = "select * from InventoryImage where InventoryID = "+_parent.id+" order by ImageNo asc";
    var connection = utils.connect();          
    connection.query(sql,
                     function(err, rows, fields) {
        if (err) {
            throw err;
            //res.send({error: err});
            //return;
        }
        data.Images = [];
        var count = 0;
        for (var i = 0; i < rows.length; i++) {
            var file = images.ImageLocation + "/" + images.ImageFolder + "/" + rows[i].FileName;
            if (fs.existsSync(file)) {
                count++;
                var img = {};
                img.imgSrc = images.ServerURL + "/" + images.ImageFolder + "/" + rows[i].FileName;
                var dimensions = sizeOf(file);
		var aspect = dimensions.height / dimensions.width;
		img.imgHeight = 500;
		img.imgWidth = img.imgHeight / aspect;
                data.Images.push(img); //rows[i].FileName);
            }
            
        }
        callback(null,data);
    });
}

module.exports = router;