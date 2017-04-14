var express = require('express'),
	  mongoose = require('mongoose'),
    request = require('request'),
    path = require('path'),
    config = require('./config');

var City = require('./models/city'),
    Record = require('./models/record');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));

app.use(function(err, req, res, next){
	console.log(err.stack);
	res.status(err.status || 500);
	res.send({message: err.message});
});

app.listen(app.get('port'), function(){
	console.log('Express server listening on port '+ app.get('port'));
});
