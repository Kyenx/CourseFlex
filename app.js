var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
// var search = require('./../search.html');
var cobalt = require('cobalt-uoft');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//app.use(express.static(__dirname + '/'));
app.use(express.static(path.join(__dirname, '/')));

app.use(session({
  secret: "g4a93iugnp9a4n90anp43u93t",
  resave: false,
  saveUninitialized: true
}));
// app.use(express.static(__dirname + '../css'));
// app.use(express.static(__dirname + '../js'));
// app.use(express.static(__dirname + '../image'));

User = require('./schema/users');
//Test = require('./schema/tests');
StudentFlex = require('./schema/studentflex');
WishList = require('./schema/wishlist');
Course = require('./schema/course');
Schedule = require('./schema/schedule');
CourseFlexes = require('./schema/courseflexes');

// app.use('/', search);

//Connect to mongoose
try {
    //mongoose.connect('mongodb://localhost/cobalt');
	mongoose.connect('mongodb://heroku_6hgf6q8p:vmsq1k84q103opadfiqr94aamr@ds147480.mlab.com:47480/heroku_6hgf6q8p/cobalt');
} catch (err) {
    //mongoose.createConnection('mongodb://localhost/cobalt');
	mongoose.createConnection('mongodb://heroku_6hgf6q8p:vmsq1k84q103opadfiqr94aamr@ds147480.mlab.com:47480/heroku_6hgf6q8p/cobalt');
}
var db = mongoose.conncetion;

app.use('/cobalt', cobalt.Server);

//load main page
//req = request
//res = response
//When accesses the url - localhost:3000/ =
// app.get('/index', function(req, res) {
//     res.send("Use api/ for calls");
// });


//Get request on users table by ID
//req = the params we are passing getUsersById(id, callback) - callback is what is returned from /user/id
//req.params =
app.get('/api/users/:_id', function(req, res) {
    User.getUsersById(req.params._id, function(err, user) {
        if (err) {
            throw err;
        }
        console.log(user);
        res.json(user);
    });
});


//Post requests - adds - same url dont matter, as long as calls are different
app.post('/api/signUp', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var user = req.body;
    //console.log(user);
    //users is the "json" file that is returned
    User.createUser(user, function(err, user) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        req.session.user = user.username;
        res.json(user);
    });

});

//UpdateUser by id
app.put('/api/users/', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var user = req.session.user;
    var bod = req.body;

    //users is the "json" file that is returned
    User.updateUser(user, bod, {}, function(err, user) {
        if (err) {
          console.error("404 User not found");
          res.status(404).send('404: User not found');
        }
        res.json(user);
    });
});

//deleteUser by id
app.delete('/api/users/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.id;
    //users is the "json" file that is returned
    User.deleteUser(id, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});

app.get('/api/users', function(req, res) {
    //users is the "json" file that is returned
    if(!req.session.user){
    if(Object.keys(req.query).length == 0){
    // User.getUsers(function(err, gg) {
    //     if (err) {
    //         console.error("404 No users found");
    //         res.status(404).send('404: No users found');
    //     }
    //     console.log(gg);
    //     res.json(gg);
    // });
    } else {
        User.findUsers(req.query, function(err, uss){
          if(err){

            console.error("404 User not found");
            res.status(404).send('404: User not found');
          } else if (!uss.length){
            console.error("404 User not found");
            res.status(404).send('404: User not found');

          } else {
          res.json(uss);
          console.log(uss);
        }
        });

    }
  } else {
    console.log("logged in: "+ req.session.user);
    User.findUsers({username: req.session.user}, function(err, uss){
      if(err){

        console.error("404 User not found");
        res.status(404).send('404: User not found');
      } else if (!uss.length){
        console.error("404 User not found");
        res.status(404).send('404: User not found');

      } else {
      res.json(uss);
      console.log(uss);
    }
  }, 1);
  }
});

app.post('/api/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    //console.log("pas "+password);
    //console.log("us "+username);
    User.login(username, password, function(err, uss){
      if(err){

        console.error("500 Bad");
        res.status(500);
      } else if (!uss){

        console.error("404 User not found "+uss);
        res.status(404).send('404: User not found');

      } else {
      req.session.user = username;
      res.json(uss);

    }
  });
  //console.log(username);
});

app.get('/api/logout', function (req, res){
  console.log('logging out ' + req.session.user);
  req.session.destroy(function(err) {
    if (!err) {
      return res.json({});
    }
  });
});

app.get('/api/checkUser', function (req, res){
  if(!req.session.user){
    res.status(404).send("Logged Out");
  } else {
    res.status(200).send("Logged In");
  }
});

//Student courses
app.get('/api/schedule', function(req, res){

  Schedule.getSchedule(req.session.user, function(err, uss){
    if(err){

      console.error("500 Not Good error");
      res.status(404).send('500: Not Good error');
    } else if (!uss.length){
      console.error("404 User not found");
      res.status(404).send('404: User not found');

    } else {
    res.json(uss);
    //console.log(uss);
  }
});

});

app.post('/api/schedule', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var schedule = {username: req.session.user,
                    coursecode: req.body.coursecode,
                    location: req.body.location,
                    prof: req.body.prof,
                    section: req.body.section,
                    day: req.body.day,
                    time: req.body.time};
    //users is the "json" file that is returned
    Schedule.addSchedule(schedule, function(err, sched) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        res.json(sched);
    });
});

app.delete('/api/schedule/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.id;
    //users is the "json" file that is returned
    Schedule.deleteSchedule(id, function(err, user) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
        res.json(user);
    });
});




//CourseFlexes
app.get('/api/courseflex/:code', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var q = {coursecode: req.params.code};

    CourseFlexes.getCFlex(q, function(err, flex) {
        if (err) {
          //console.error("500 Not Good error");
          res.status(404).send('500: Not Good error');
        } else if (!flex.length){
          //console.error("404 Course not found");
          res.status(404).send('404: Course not found');

        } else{

        res.json(flex);
      }
    });
});

app.put('/api/courseflex/', function(req, res){
    if(!req.session.user){
        res.status(404).send("Logged Out");
    }else {
      var q = req.body.code;
      var fx = req.body.flex;
      var query = {numflex: fx};
      CourseFlexes.updateCFlex(q, query,{}, function(err, bod){
        if(err){
          //console.error("404 Course not found");
          res.status(404);
        } else {

          res.json(bod);
        }
      });
      var query2 = {username: req.session.user, coursecode: q};
      StudentFlex.updateSFlex(query2, query, {}, function(err, bod) {
          if (err) {
            console.error("404 Course not found");
            res.status(404).send('404: Course not found');
          }
          //res.json(bod);
      });
    }
});





app.get('/api/studentflex/', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var q = {username: req.session.user};
    //users is the "json" file that is returned
    StudentFlex.getSFlex(q, function(err, flex) {
        if (err) {
          console.error("500 Not Good error");
          res.status(404).send('500: Not Good error');
        } else if (!flex.length){
          console.error("404 User not found");
          res.status(404).send('404: User not found');

        } else{
        res.json(flex);
      }
    });
});





//StudentFLex calls
app.put('/api/studentflex/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.username;
    var bod = req.body;
    //users is the "json" file that is returned
    StudentFlex.updateFlex(id, bod, {}, function(err, bod) {
        if (err) {
            throw err;
        }
        res.json(bod);
    });
});

app.delete('/api/studentflex/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.id;
    //users is the "json" file that is returned
    StudentFlex.deleteFlex(id, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});




//Wishlist calls
app.post('/api/wishlist', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var wish = req.body;
    //users is the "json" file that is returned
    WishList.addWish(wish, function(err, wish) {
        if (err) {
            throw err;
        }
        res.json(wish);
    });

});
app.delete('/api/wishlist/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.id;
    //users is the "json" file that is returned
    Wishlist.deleteWish(id, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});

//Courses
app.put('/api/courses/:id', function(req, res) {
    //uses body parser to get object from req (form) and put into user object
    var id = req.params.id;
    var csr = req.body;
    //users is the "json" file that is returned
    Course.updateCourse(id, csr, {}, function(err, csr) {
        if (err) {
            throw err;
        }
        res.json(csr);
    });
});

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);
