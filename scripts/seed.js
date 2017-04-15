var mongoose = require('mongoose'),
    moment = require('moment'),
    async = require('async'),
    config = require('../config');

var City = require('../models/city'),
    Record = require('../models/record');

mongoose.Promise = require('bluebird');

const AQI_MAX = 160
const AQI_MIN = 75

function connectToDb(callback){
  mongoose.connect(config.database);
  mongoose.connection.on('error', function(){
    console.log('Error: Could not connect to DB');
  });
  callback();
}

function cleanDb(callback){
  City.remove({}, function(err){
    console.log('City collection purged.');
    Record.remove({}, function(err){
      console.log('Record collection purged.');
      console.log('DB cleaned.');
      callback();
    });
  });
}

function seedCities(callback){
  var amsterdam = {
    name: 'amsterdam',
    tz: '+02:00',
    geo: [ 52.3702, 4.8952 ]
  };
  var obj = new City(amsterdam);
  obj.save(function(err, doc){
    if (err) {
      callback(err);
    }
    console.log("Saved City.");
    callback();
  });
}


function seedRecords(callback){
  
  City.find({}).exec(function(err, cities){
    
    if(err){
      callback(err)
    }
    
    var records = [];

    for (var i = 0; i < cities.length; i++){
      
      var city = cities[i];
      
      start_date = moment(new Date()).utcOffset(city.tz).startOf('month');
      end_date = moment(new Date()).utcOffset(city.tz).endOf('month');
      
      // generating ranges for a month
      for ( var d = start_date; d <= end_date; d.add(1,'days') ){
        
        var data = []
        
        for ( var j = 0; j < 24; j++ ){
          
          data.push({
            aqi: Math.random() * (AQI_MAX - AQI_MIN) + AQI_MIN,
            time: moment(d).add(j,'hours').toDate()
          });

        }
        records.push({ city: city.id, date: d.toDate(), data: data });  
      }
    }
          
    Record.create(records, function(err, obj){
      
      if(err){
        callback(err);
      }

      console.log('Records seed done.');
      callback();
      
    });

  });
}

function seed(){
  async.series([
    connectToDb,
    cleanDb,
    seedCities,
    seedRecords
  ], function(err, results){
    mongoose.disconnect();
    if (err) return console.log(err)
    console.log('All Done!!!');
  });
}

seed();
