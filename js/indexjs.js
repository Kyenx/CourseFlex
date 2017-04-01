$(document).ready(function() {

  $( "#button" ).click(function() {
    $( "#login_effect" ).effect( "drop", {direction : "right"}, "slow", function() {
      $( "#signup_effect" ).effect( "drop", {direction: "right", mode: "show"}, "slow");
    });
  });


$(".loginForm").submit(function( event ) {
//$(document).on("click", ".logBut", function() {
  // Stop form from submitting normally
  event.preventDefault();
  var user = $('#username').val();
  var pass = $('#password').val();
  console.log(user);
  var posting = $.post("/api/login", {username: user, password: pass})
                  .done(function(data){
                    //$(".logOut").css("visibility", "visible");
                    //alert("Hello "+data.firstname);

                    $(location).attr('href','/profile.html');
                  })
                  .fail(function(data){
                    alert("Sorry: Incorrect User or Password");
                  });

});
//$(".registerForm").submit(function( event ) {
$(document).on("click", ".regBut", function() {
  // Stop form from submitting normally
  //alert("yo");
  //event.preventDefault();
  var first = $('#firstName').val();
  var last = $('#lastName').val();
  var user = $('#regusername').val();
  var pass = $('#regpassword').val();
  console.log(pass);
  var rpass = $('#repassword').val();
  var prog = $('#Program').val();
  var posting = $.post("/api/signUp", {firstname: first, lastname: last, program: prog, username: user, password: pass})
                  .done(function(data){
                    //$(".logOut").css("visibility", "visible");
                    alert("Welcome new user");

                    $(location).attr('href','/profile.html');
                  })
                  .fail(function(data){
                    alert("Something went wrong :(");
                  });

});

});
