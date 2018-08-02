var socket = io.connect();

socket.on('send_data_user', function(response) {

  if (response.data.isValidUser == 1) {

    localStorage.setItem("userID", response.data.userID);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.userName);
    localStorage.setItem("email", response.data.email);

    openChats();

  }else {

    Materialize.toast('El usuario o la contraseña introducida no es correcta', 5000, 'indigo rounded');

  }

});

socket.on('pass_changed', function(response) {

  if (response.status.message == "Email send") {

    Materialize.toast('Se ha enviado un email con la contraseña nueva', 5000, 'indigo rounded');

  }else {

    Materialize.toast('El nombre de usuario no existe', 5000, 'indigo rounded');

  }


});

function login(){

  var user = {username: $("#username").val(), pass: $("#pass").val()};
  socket.emit("check_user", user);

}

function openChats() {

  $("#container").append('<a id="link_chats" style="display:none" href="/chats.html"></a>');
  document.getElementById("link_chats").click();

}

function recoveryPass() {

  $("#modal_pass").modal('close');

  if ($("#emailRecovery").val()) {
    socket.emit("recovery_pass", {username: $("#emailRecovery").val()});
  }

}

$(document).ready(function(){

    $('.modal').modal();

});
