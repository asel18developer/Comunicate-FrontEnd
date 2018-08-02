var socket = io.connect();

socket.on('obtain_messages', function(chats) {

  //alert(JSON.stringify(chats));

  $("#elements").empty();

  for (var i = 0; i < chats.data.listMessages.length; i++) {

      chat = chats.data.listMessages[i];

      var data = '<div id="card-'+chat.chatID+'" class="col s12 m6 l4"><div class="card circular_border hoverable white z-depth-3"><div class="card-content content_card_user"><div class="row valign-wrapper row-title"><div><a href="messages.html?idChat='+chat.chatID+'&idUser='+ chat.chatUserID +'&nameUser='+ chat.chatUsername +'"><img src="/img/avatar.png" alt="" class="circle img_user"></a></div><div class="col s10 left_position"><a class="card-title text_title_card truncate" href="messages.html?idChat='+chat.chatID+'&idUser='+ chat.chatUserID +'&nameUser='+ chat.chatUsername +'">'+ chat.chatUsername +'</a></div></div><div class="col s7"><br><p class="truncate text_content_card_user">'+ chat.message +'</p></div><div class="boton_margin_top"><button class="btn-floating tooltipped waves-effect waves-light teal right" data-position="bottom" data-delay="50" data-tooltip="Eliminar chat" onclick = deleteChat("'+ chat.chatID +'")><i class="fa fa-trash-o" aria-hidden="true"></i></button></div></div></div></div>';

      $("#elements").append(data);
  }

});

socket.on('receive_message', function(message) {

  var credentials = {userID: localStorage.getItem("userID"), accessToken: localStorage.getItem("token"), isExpert: 1};
  socket.emit("get_user_last_messages", credentials);

});

socket.on('token_expired', function() {

  closeSesion();

});

function search(){

  $('#elements>div').css("display", "block");

  $('#modal_search').modal('close');

  var cards = $('#elements').children();
  var search = $('#search').val().toUpperCase();

  if (search.length > 0) {

    var cont = 0;

    for (var i = 0; i < cards.length; i++) {

      var nameChat = cards[i].getElementsByClassName("card-title text_title_card truncate")[0].innerText.toUpperCase();

      if (!nameChat.includes(search)){

        $(cards[i]).css("display", "none");

      }else {

        cont++;

      }

    }

    if (cont == 0) {

      noResult = '<center><h4 class="no_result">No se encontró ningún chat</h4></center>';
      $("#elements").append(noResult);

    }

  }

}

function deleteChat(idChat) {

  socket.emit("delete_chat", {chatID: idChat});
  $("#card-"+ idChat).remove();
  
}

function closeSesion(){

  localStorage.removeItem("userID");
  localStorage.removeItem("token");

  $("#elements").append('<a id="link" style="display:none" href="/"></a>');
  document.getElementById("link").click();

}

function inicialize(){

  socket.emit("pairing", localStorage.getItem("userID"));

  var credentials = {userID: localStorage.getItem("userID"), accessToken: localStorage.getItem("token"), isExpert: 1};
  socket.emit("get_user_last_messages", credentials);

}

$(document).ready(function(){

    $('.modal').modal();

    inicialize();

});
