var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CFlexSchema = new Schema(
  {
    /*sid: {
      type: String
      //required: true,
      //unique: true
    },*/
	coursecode: {
      type: String
      //requried: true
    },
    // coursename: {
    //   type: String
    //   //requried: true
    // },
    numflex: {
      type: Number,
      default: 0
	    //required: true
    },
    // username: {
    //   type: String
    // }
  },
  {
    collection: 'courseflexes'
  }
);

//mongoose.connect('mongodb://localhost/studentflex');

var CourseFlexes = module.exports = mongoose.model('CourseFlexes', CFlexSchema);

/*module.exports.addUser = function(ts, callback){
  StudentFlex.create(ts, callback);
}*/
module.exports.getCFlex = function(cc, callback, limit){
  CourseFlexes.find(cc, callback).limit(limit);
}

module.exports.updateCFlex = function(cc, flex, options, callback){
  var query = {coursecode: cc};
  /*var update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      program: user.program,
      username: user.username,
      password: user.password
  }*/
  CourseFlexes.update(query, flex,{upsert:true}, callback);
}

module.exports.deleteCFlex = function(id, callback){
  var query = {_id: id};
  CourseFlexes.remove(query, callback);
}
