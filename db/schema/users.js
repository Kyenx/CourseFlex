var mongoose = require('mongoose');
//var  autoIncrement = require('mongoose-auto-increment');
//User schema - not needed for db but useful for application
//var Schema = mongoose.Schema;
var studentF = require('./studentflex');
//autoIncrement.initialize(mongoose);
//var ObjectId = mongoose.Schema.ObjectId;
var UserSchema = mongoose.Schema(
  {
    /*sid: {
      type: Number,
      required: true,
      unique: true,
      default: 0
    },*/
    firstname: {
      type: String,
      requried: true
    },
    lastname: {
      type: String
	     //required: true
    },
    /*email: {
      type: String,
      required: true,
      unique: true
    },*/
    program: {
      type: String
	    //required: true
    },
    username: {
      type: String,
      unique: true,
      requried: true
    },
    password: {
      type: String,
	    required: true
    },
    pictureurl: {
      type: String
    }
  },
  {
    collection: 'users'
  }
);

//mongoose.connect('mongodb://localhost/user');

//To access object outside
var User = module.exports = mongoose.model('User', UserSchema);
//UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'sid'});
//To Get users
//access outside
module.exports.getUsers = function(callback, limit){
  User.find(callback).limit(limit);
}
//By Id
module.exports.getUsersById = function(id, callback){
  User.findById(id, callback);
}

module.exports.createUser = function(user, callback){
  User.create(user, callback);
}

module.exports.findUsers = function(info, callback, limit){
  User.find(info, callback).limit(limit);
}

module.exports.updateUser = function(user, useradd, options, callback){
  var query = {username: user};
  /*var update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      program: user.program,
      username: user.username,
      password: user.password
  }*/
  User.update(query, useradd,{upsert:true}, callback);
}

module.exports.deleteUser = function(id, callback){
  var query = {_id: id};
  User.remove(query, callback);
}

module.exports.login = function(user, pass, callback){
  var query = {username: user, password: pass};
  User.findOne(query, callback);
}
