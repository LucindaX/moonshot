var mongoose = require('mongoose'),
    CronJob = require('cron').CronJob,
    moment = require('moment'),
    winston = require('winston'),
    request = require('request'),
    path = require('path'),
    config = require('../config'),
    Record = require('../models/record'),
    City = require('../models/city');

var apiToken = config.apiToken;

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({filename: path.join(__dirname, '../cron.log') })
 ]
});

function callback(log,obj){
  if(log == 'info') logger.info(obj);
  else logger.error(obj);
  mongoose.disconnect();
}

function getAqiData(){

  mongoose.connect(config.database);

  var baseUrl = 'http://api.waqi.info/feed/';
  
  City.find({},function(err, cities){
    
    if(err) return callback('error', err);

    if(!cities.length) return;
    
    for (var i = 0; i < cities.length; i++){
      
      var city = cities[0];
      
      var url = baseUrl+city.name+'?token='+apiToken;
 
      request.get({uri: url, json: true}, function(err, req, data){
        
        if(err) return callback('error',err);
   
        if(data.status == "error") return callback('info',"Error returned for request "+ url);
        

        try{
          var aqi = data.data.aqi;
          var time = data.data.time.s
        }
        catch(e){
          return callback('error',e);
        }

        var date = moment(time).utcOffset(city.tz).startOf('day');
        time = moment(time).utcOffset(city.tz).startOf('hour');

        var conditions = {
          city: city.id,
          date: date.toDate(),
          'data.time': { $ne: time.toDate() }
        };

        var update = {
          $addToSet: { data: { aqi: aqi, time: time.toDate() }}
        };

        Record.findOneAndUpdate(conditions, update, {upsert: true}, function(err, record){
          
          if (err) return callback('error',err);
          return callback('info','Schedules data pull for '+city.name);

        });       
        
      });
    }
  });
}

var job = new CronJob({
  cronTime: '* 1 * * *',
  onTick: getAqiData,
  start: true,
  onComplete: function(){ mongoose.disconnect(); }
});
