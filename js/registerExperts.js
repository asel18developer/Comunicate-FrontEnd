var socket = io.connect();

socket.on('register_user', function(response) {

  if (response.status.message == "User created") {

    Materialize.toast('Se ha creado la cuenta del experto..', 5000, 'indigo rounded');

    $('#username').val("");
    $('#pass').val("");
    $('#email').val("");
    Materialize.updateTextFields();

  }else {

    Materialize.toast('Ya existe un usuario con este nombre.', 5000, 'indigo rounded');

  }

});

function register(){

  var expert = {username: $("#username").val(), email: $("#email").val(), pass: $("#pass").val(), isExpert: 1};
  socket.emit("add_user", expert);

}

$(document).ready(function(){

    $('.modal').modal();

});
