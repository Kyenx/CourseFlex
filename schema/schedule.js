var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScheduleSchema = new Schema(
  {
    /*sid: {
      type: Number,
      required: true,
      unique: true
    },*/
    username: {
      type: String,
      required: true
    },
    coursecode: {
      type: String
      //requried: true
    },
    location: {
      type: String
    },
    prof: {
      type: String
    },
    section: {
      type: String
    },
    day: {
      type: String
    },
    time: {
      type: String
    }
  },
  {
    collection: 'schedule'
  }
);

//mongoose.connect('mongodb://localhost/schedule');
var Schedule = module.exports = mongoose.model('schedule', ScheduleSchema);

module.exports.getSchedule = function(info, callback, limit){
  var query = {username: info};
  Schedule.find(query, callback).limit(limit);
}

module.exports.addSchedule = function(info, callback){
  Schedule.create(info, callback);
}

module.exports.deleteSchedule = function(id, callback){
  var query = {_id: id};
  Schedule.remove(query, callback);
}
