var express = require('express'),
    mongoose = require('mongoose'),
    request = require('request'),
    moment = require('moment'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config');

var City = require('./models/city'),
    Record = require('./models/record');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

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
app.get('/api/feed/:city', function(req, res, next){
  
  var cityName = req.params.city;
  var date = req.query.date;
  var type = req.query.type;

  // check if data type is set
  if (type){
    type = type.toLowerCase();
    if ( type != 'week' && type != 'day' )
      return res.status(400).send({ message: 'Type in invalid . set to either "week" or "day" '});
  }else{
    // if data type not set
    return res.status(400).send({ message: 'Data type not set . set type to "week" or "day" for data returned' });
  } 

  City.findOne({ name: cityName.toLowerCase()}, function(err, city){
    
    if (err) return next(err);
    
    if (!city){
      return res.status(404).send({ message: 'Records for '+ cityName +' not found'});
    }

    // check if date is set
    if (date){

      if (moment(date,'YYYY-MM-DD',true).isValid()){
        
        date = moment(date).utcOffset(city.tz).startOf('day');
      
      }
      else{
        // if date format is invalid
        return res.status(400).send({ message: 'Invalid date format , follow yyyy-mm-dd' });
      }
    }
    else{
      // set for current date in city 
      // if none is set
      date = moment(new Date()).utcOffset(city.tz).startOf('day');
    }

    // format date object for tz
    if ( type == 'day'){

      Record.findForDay(date, function(err, record){
        
          if(err) return next(err);
    
          if(!record){
            return res.status(404).send({ message: "No records found", data:[] });
          }

          res.send({date: date.format('YYYY-MM-DD'), utcOffset: city.tz, data: record.data });
      });
    }
    else{

      Record.findForWeek(date, function(err, records){
        
        if (err) return next(err);

        var data = [];

        for (var i = 0; i < records.length; i++){
          data.push({ date: records[i].date, aqi: records[i].avg() });
        }

        res.send({ date: date.format('YYYY-MM-DD'), utcOffset: city.tz, week: data });
      });

    }
  })

});


app.use(function(err, req, res, next){
  console.log(err.stack);
  res.status(err.status || 500);
  res.send({message: err.message});
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port '+ app.get('port'));
});
