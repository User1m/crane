var express = require('express');
var app = express();


var port = 8080;

var router = express.Router();

router.get('/', function(req, res){
    res.json({ message: 'Response message'})
});

app.listen(port);
console.log("Magic happens on port 8080.")