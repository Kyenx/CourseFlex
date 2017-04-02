var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FlexSchema = new Schema(
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
      type: Number
	    //required: true
    },
    username: {
      type: String
    }
  },
  {
    collection: 'studentflex'
  }
);

//mongoose.connect('mongodb://localhost/studentflex');

var StudentFlex = module.exports = mongoose.model('StudentFlex', FlexSchema);

/*module.exports.addUser = function(ts, callback){
  StudentFlex.create(ts, callback);
}*/
module.exports.getSFlex = function(cc, callback, limit){
  //var q = {username: cc};
  StudentFlex.find(cc, callback).limit(limit);
}

module.exports.updateSFlex = function(id, flex, options, callback){
  //var query = {username: id};
  /*var update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      program: user.program,
      username: user.username,
      password: user.password
  }*/
  StudentFlex.update(id, flex,{upsert:true}, callback);
}

module.exports.deleteSFlex = function(id, callback){
  var query = {_id: id};
  StudentFlex.remove(query, callback);
}
