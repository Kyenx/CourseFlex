$(document).ready(function() {
    var utorid;
    var post;
    var stuff;
    var uname;
    var $cancel;


// function getData(url, dataDes){
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//
// 	//response finished loading
//     if (this.readyState == 4){
//
//     	// request was successful
//     	if(this.status == 200) {
//
//         	var myObj = JSON.parse(this.responseText);
//
//        		/*if(whichData == "games"){
//         		getGames(myObj);
//         	}
//         	else{
//         		gameDetails(myObj);
//         	}*/
//
//           if(dataDes == "load")
//           {
//               //console.log(myObj[0].username);
//               $("#utorid").val(myObj[0].username);
//               $('#post').val(myObj[0].program);
//               var $name = $(".profile_title input");
//               $name.val(myObj[0].firstname);
//           }
//     	}
//     	// the given url does not exist, therefore no game data
//     	else{
//
//         	// document.getElementById("list_view").innerHTML=
//         	// "There are no games on this date.";
//         }
//
//     }
//
// };
//
// xmlhttp.open("GET", url, true);
// xmlhttp.send();
// }
//
// var currentUser = 'bro';
// var getUser = "http://localhost:3000/api/users?username="+currentUser;
// getData(getUser, "load");

  //console.log(document.getElementById("currentcourses").childElementCount);
function reloaduser() {
  $.get("/api/users", function(data){
    //console.log(data);
    $("#utorid").val(data[0].firstname);
    $('#post').val(data[0].program);
    var $name = $(".profile_title input");
    //$name.val(data[0].firstname+" "+data[0].lastname);
    $name.val(data[0].lastname);
    var $picture = $('.profile_picture');
    if(data[0].pictureurl){
    $picture.css("background-image", "url("+data[0].pictureurl+")");
    }
  })
  .fail(function(){
    alert("User not in session...");
  });
}
reloaduser();
loadCourses();
loadFlexes();

    $(document).on("click", ".editclick", function() {
        var $fields = $(".profile_information input");
        var $name = $(".profile_title input");
        var $confirm = $(".profile_information .confirminfo");
        var $picture = $(".profile_information .editpicture");
        var $editbut = $(this);
        utorid = $("#utorid").val();
        post = $('#post').val();
        stuff = $('#stuff').val();
        uname = $name.val();
        //$fields.animate({background: '#315570'}, '500');
        $fields.css("background", "#315570");
        $name.css("background", "#315570");
        $cancel = $(this);
        // $(this).select();
        $fields.removeAttr("disabled");
        $name.removeAttr("disabled");
        $confirm.css("visibility", "visible").hide().fadeIn("slow");
        $picture.css("visibility", "visible").hide().fadeIn("slow");
        // $editbut.fadeOut(500, function (){
        //   $(this).attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/close2-32.png").fadeIn();
        // });
        $editbut.attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/close2-32.png");
        $editbut.removeClass("editclick").addClass("cancelProfile");
        $fields.addClass("shadow");
        $name.addClass("shadow");

    });
    //Canceled profile information change

    $(document).on("click", ".cancelProfile", function() {
        //alert("aS");
        var $fields = $(".profile_information input");
        var $confirm = $(".profile_information .confirminfo");
        var $picturebut = $(".profile_information .editpicture");
        var $name = $(".profile_title input");
        var $editbut = $(this);
        $cancel = $(this);
        $("#utorid").val(utorid);
        $('#post').val(post);
        $('#stuff').val(stuff);
        $name.val(uname);
        $fields.attr('disabled', 'disabled');
        $fields.css("background", "transparent");
        $name.attr('disabled', 'disabled');
        $name.css("background", "transparent");
        $confirm.css("visibility", "hidden");
        $picturebut.css("visibility", "hidden");
        $editbut.attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png");
        $editbut.removeClass("cancelProfile").addClass("editclick");
        $fields.removeClass("shadow");
        $name.removeClass("shadow");

    });

    //Save profile information change

    $(document).on("click", ".confirminfo, .editpicture", function() {
        var $fields = $(".profile_information input");
        var $confirm = $(".profile_information .confirminfo");
        var $picture = $(".profile_information .editpicture");
        var $name = $(".profile_title input");
        var fname = $("#utorid").val();
        var lname = $(".profile_title input").val();
        var ppost = $('#post').val();
        $.ajax({
                url: '/api/users/',
                type: 'PUT',
                data: {firstname: fname, lastname: lname, program: ppost},
                success: function(result) {
                    // Do something with the result
                    reloaduser();
                    $fields.attr('disabled', 'disabled');
                    $fields.css("background", "transparent");
                    $name.attr('disabled', 'disabled');
                    $name.css("background", "transparent");
                    $confirm.css("visibility", "hidden");
                    $picture.css("visibility", "hidden");
                    $cancel.attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png");
                    // $cancel.fadeOut(500, function (){
                    //     $(this).attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png").fadeIn();
                    //   });
                    $cancel.removeClass("cancelProfile").addClass("editclick");
                    $fields.removeClass("shadow");
                    $name.removeClass("shadow");
                    //alert("saved");
                },
                error: function(req, msg, err){
                  console.log("error "+err);
                }
              });



    });

    $(document).on("click", ".savepicture", function() {
      var $pictureurl = $('#pictureUrl').val();
      var $picture = $('.profile_picture');
      if ($pictureurl !== ""){
          $.ajax({
                  url: '/api/users/',
                  type: 'PUT',
                  data: {pictureurl: $pictureurl},
                  success: function(result) {
                      $picture.css("background-image", "url("+$pictureurl+")");
                  },
                  error: function(req, msg, err){
                      alert("Picture url could not be saved");
                  }
                });
      }

    });

    $(document).on("click", ".cEdit", function() {
      var check = document.getElementById("currentcourses").childElementCount;
      if(check <= 8) {
      $('.addcourse').css("visibility", "visible").hide().fadeIn("slow");
      }
      $('.endcourse').css("visibility", "visible").hide().fadeIn("slow");
      $(this).attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/close2-32.png");
      $(this).removeClass("cEdit").addClass("cSave");
    });
        //change profile picture
        //By file
    $(document).on("click", ".endcourse", function() {

        var $n = $(this).parent().attr('id');
        //var $j = document.getElementById('currentcourses').childElementCount;
        //var $j = document.getElementById($n).first().innerHTML;
        $.ajax({
                url: '/api/schedule/'+$n,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    loadCourses();
                },
                error: function(req, msg, err){
                  console.log("error "+err);
                }
            });
        //alert($n);

    });

    $(document).on("click", ".cSave", function() {
      $('.addcourse').css("visibility", "hidden");
      $('.endcourse').css("visibility", "hidden");
      $(this).attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png");
      $(this).removeClass("cSave").addClass("cEdit");
    });


    $(document).on("click", ".addcourse", function() {

      $('.addcourse').css("visibility", "hidden");
      $('.endcourse').css("visibility", "hidden");
      $('#courseEdit').attr("src", "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png");
      $('#courseEdit').removeClass("cSave").addClass("cEdit");

    });

    $(document).on("click", ".savecourse", function() {
      var x = $('#coursename').val();
      var check = document.getElementById("currentcourses").childElementCount;
      if(check <= 8) {
      if(x.length >= 6){
          $.get("/cobalt/1.0/courses/filter?q=code:'"+x+"'", function(data){
              if(!data.length){
              alert("The course you entered does not exist!");
            } else {


              createCourse(data[0]);
            }
          })
          .fail(function (){
              alert("The course you entered does not exist!");
          });
      } else {
          alert("Invalid course");
      }
    } else{
      alert("You have reached the course limit");
    }

    });

    function createCourse(data){
      //var c = $(".currentcourse");



      var temps = ((data.meeting_sections[0].times[0].start)/60)/60;
      var posting = $.post("/api/schedule", {
                      coursecode: data.code,
                      location: data.meeting_sections[0].times[0].location,
                      prof: data.meeting_sections[0].instructors[0],
                      section: data.meeting_sections[0].code,
                      day: data.meeting_sections[0].times[0].day,
                      time: temps})
                      .done(function(data){
                        //$(".logOut").css("visibility", "visible");

                          //alert("inserted");
                      })
                      .fail(function(data){
                        alert("Something went wrong :(");
                      });

                      loadCourses();
    }
    function courseText(data){
      var post = '<div class="course" id="'+data._id+'"> <h3 class="ctitle">'+ data.coursecode +
      ' <span class="clocation"> - '+ data.location +'</span></h3>' +
      '<p class="ctime"> '+  data.day + ': ' + data.time +
      ':00 <span class="cprof">'+ data.prof +'</span></p><p class="clecture"> Section: '+ data.section +
      '</p><img class="endcourse" src="https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/close2-32.png"></div>';
      $(".currentcourse").append(post);
    }

    function flexText(data){
        var post = '<p>'+data.coursecode+'<span class="score">'+data.numflex+' Flexes</span></p>';
        $(".flexlist").append(post);
    }


    function loadCourses(){
      var post = '<h2><img class="coursepicture" src="https://cdn3.iconfinder.com/data/icons/internet-and-web-4/78/internt_web_technology-05-32.png" alt="">'+
      'Current Courses</h2><div class="line shadow"></div>';
      var post1 = '<img src="https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/setting-32.png" class="editcourse cEdit smoothFade" id="courseEdit" alt="">'+
      '<img src="https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/plus-32.png" class="editcourse addcourse" title="Add course" data-toggle="modal" data-target="#myModal2" alt="Add course">';
      $(".currentcourse").empty();
      $(".currentcourse").append(post);
      $.get("/api/schedule", function(data){

          for(var i = 0; i < data.length; i++){
            courseText(data[i]);
            //console.log(i);
          }

      })
      .fail(function(){
          //console.log("no courses");
      });
      $(".currentcourse").append(post1);
    }

    function loadFlexes(){
      $(".flexlist").empty();
      $.get('/api/studentflex/', function(data){
        for(var i = 0; i < data.length; i++){
          getCourseFlex(data[i].coursecode);
        }
      })
      .fail(function(){
        //console.log("no flexes1");
      });
    }

    function getCourseFlex(data){
      $.get('/api/courseflex/'+data, function(data){
        for(var i = 0; i < data.length; i++){
          flexText(data[i]);
        }
      })
      .fail(function(){
        //console.log("no flexes");
      });

    }


    // $('body').click(function( event ) {
    //     var $tar = event.target;
    //     if($tar.id == "like-button"){
    //       $tar.parentElement.firstChild.innerHTML++;
    //     }
    // });
        // document.getElementById('get_file').onclick = function() {
        //     document.getElementById('my_file').click();
        // };
        //
        // $('input[type=file]').change(function(e) {
        //     $('#pictureUrl').val(($(this).val()));
        // });



});
