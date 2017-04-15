var mongoose = require('mongoose');
var moment = require('moment');

var recordSchema = new mongoose.Schema({
  city: mongoose.Schema.Types.ObjectId,
  date: Date,
  data:[
    { aqi: Number, time: Date , _id: false}
  ]
});

recordSchema.methods.avg = function(){
  var avg = 0;
  var readings = 0;
  for (let i = 0; i < this.data.length; i++){
    if (this.data[i].aqi != 0) {
      avg = avg + this.data[i].aqi;
      readings++;
    }
  }
  return (readings != 0) ? avg/readings : 0
};

recordSchema.statics.findForWeek = function(date, callback){
  
}

recordSchema.statics.findForDay = function(date, callback){
  return this.findOne({ date: {"$gte": date.toDate(), "$lt": moment(date).add(1, 'days').toDate()}},callback);
}

module.exports = mongoose.model('Record', recordSchema);
