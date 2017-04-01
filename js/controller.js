$(document).ready(function() {


function ref(selection) {

$.get("/api/checkUser", function(){

      $(".logOut").css("display", "inherit");
      if(selection == "profile"){
        $(location).attr('href','/profile.html');
      }
  })
  .fail(function(){

      $(".logOut").css("display", "none");
      if(selection == "profile"){
        $(location).attr('href','/index.html');
      }
  });
}
ref();
//    $(".logOut").css("visibility", "visible");

$(document).on("click", ".logOut", function() {
  $.get("/api/logout", function() {
    alert("goodbye");
    $(location).attr('href','/index.html');
    $(".logOut").css("display", "inherit");
  })
  .fail(function(){
    alert("hmmm strange");
  });

});

$(document).on("click", ".profileBut", function() {
    //console.log("proff");
    ref("profile");
});


});
