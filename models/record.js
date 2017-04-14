var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
	city: mongoose.Schema.Types.ObjectId,
	date: Date,
	data:[
		{ aqi: Number, time: Date }
	]
});

recordSchema.methods.avg = function(){
	var avg = 0;
	var readings = 0;
	for (let i in this.data){
		if (this.data[i].aqi != 0) {
			avg = avg + this.data[i].aqi;
			readings++;
		}
	}
	return (readings != 0) ? avg/readings : 0
};

module.exports = mongoose.model('Record', recordSchema);
