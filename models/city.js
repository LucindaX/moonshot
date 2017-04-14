var mongoose = require('mongoose');

var citySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  url: String,
  tz: String,
  geo: { type:[Number], index: '2dsphere' }
}); 

module.exports = mongoose.model('City', citySchema);
