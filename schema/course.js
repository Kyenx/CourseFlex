var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema(
  {
    coursecode: {
      type: String,
      requried: true
    },
    coursename: {
      type: String,
      requried: true
    },
	description: {
	  type: String,
	  required: true
	},
	department: {
	  type: String,
	  required: true
	},
	prerequisites: {
	  type: String,
	  required: true
	},
	exclusions: {
	  type: String,
	  required: true
	},
	level: {
      type: Number,
      requried: true
    },
	campus: {
	  type: String,
	  required: true
	},
	term: {
	  type: String,
	  required: true
	},
	breadths: {
      type: [Number],
      requried: true
    },
	meeting_sections: {
	  type: [{
	    code: { type: String },
        instructors: { type: [String] },
        times: {
		  type: [{
            day: { type: String },
            start: { type: Number },
            end: { type: Number },
            duration: { type: Number },
            location: { type: String }
          }]
		},
        size: { type: Number},
        enrolment: { type: Number }
      }]
	},
    numflex: {
      type: Number,
      requried: true
    },
    rating: {
      type: Number,
      requried: true
    }
  },
  {
    collection: 'course'
  }
);

//mongoose.connect('mongodb://localhost/course');

var Course = module.exports = mongoose.model('Course', CourseSchema);

module.exports.updateCourse = function(id, course, options, callback){
  var query = {_id: id};
  /*var update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      program: user.program,
      username: user.username,
      password: user.password
  }*/
  Course.update(query, course,{upsert:true}, callback);
}
