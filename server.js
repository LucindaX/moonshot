var express = require('express'),
	  mongoose = require('mongoose'),
    request = require('request'),
		moment = require('moment'),
    path = require('path'),
    config = require('./config');

var City = require('./models/city'),
    Record = require('./models/record');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));

// connect to DB
mongoose.Promise = require('bluebird');
mongoose.connect(config.database);
mongoose.connection.on('error', function(){
	console.log('Error: Could not connect to MongoDB');
});

app.get('/',function(req, res, next){
	res.send('Welcome To Moonshot API');
});


/**
 * GET /api/day/:city
 * Looks up city data for specified
 * date or current date there
*/
app.get('/api/day/:city', function(req, res, next){
	var city = req.params.city;
	var date = req.params.date;

	City.findOne({ name: city.toLowerCase()}, function(err, city){
		
		if (err) return next(err);
		
		if (!city){
			return res.status(404).send({ message: 'Records for '+ city +' not found'});
		}
		// format date object for tz
		if (date){
			date = moment(date).utcOffset(city.tz).startOf('day');
		}else{
			date = moment(new Date()).utcOffset(city.tz).startOf('day');
		}
		
		Record.findOne({ date: {"$gte": date.toDate(), "$lt": moment(date).add(1, 'days').toDate()}},
			function(err, record){
				
				if(err) return next(err);
		
				if(!record){
					return res.status(404).send({ message: "No records found", data:[] });
				}

				res.send({date: date.format('YYYY-MM-DD'), utcOffset: city.tz, data: record.data });
		});
	})

});

app.get('/api/week/:city', function(req, res, next){


});

app.use(function(err, req, res, next){
	console.log(err.stack);
	res.status(err.status || 500);
	res.send({message: err.message});
});

app.listen(app.get('port'), function(){
	console.log('Express server listening on port '+ app.get('port'));
});
