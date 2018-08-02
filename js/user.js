var socket = io.connect();

function modifyUser(){

  var user = {username: $("#username").val(), pass: $("#pass").val(), passTrap: $("#passFalse").val(), email: $("#email").val(), userID: localStorage.getItem("userID")};
  socket.emit("modify_user", user);

  openChats();

}

function openChats() {

  $("#container").append('<a id="link_chats" style="display:none" href="/chats.html"></a>');
  document.getElementById("link_chats").click();

}

$(document).ready(function(){

    $('#username').val(localStorage.getItem("username"));
    $('#email').val(localStorage.getItem("email"));

});
