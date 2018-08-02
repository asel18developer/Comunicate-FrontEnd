var socket = io.connect();
var url_params;

socket.on('obtain_chat', function(messages) {

  $("#preload").remove();

  if (messages.data.inLine) {
    $("#online").empty();
    $("#online").append('<img class="online_offline" src="img/online.png" alt="">');
  }

  $("#username").text(url_params.nameUser);

  for (var i = 0; i < messages.data.listMessages.length; i++) {

    paint(messages.data.listMessages[i]);

  }

});

socket.on('obtain_rating', function(rating) {

  $("#rating").show();
  $("#star-"+ rating.data.averageRating).prop( "checked", true );

});

socket.on('receive_message', function(message) {

  paint(message);

});

socket.on('token_expired', function() {

  closeSesion();

});

function paint(message){

  //alert(message._timestamp);

  var data = "";

  if (message.userID == localStorage.getItem("userID")) {
    data += '<div class="row row_card"><div class="card-panel teal darken-1 message_card right"><div class="right"><p class="white-text message_text">'+ message.message +'</p><p class="white-text datetime">'+ message.sendTimestamp +'</p></div></div></div>';
  }else {
    data += '<div class="row row_card"><div class="card-panel cyan darken-1 message_card left"><div class="left div_100"><p class="white-text left message_text">'+ message.message +'</p></div><div><p class="white-text datetime">'+ message.sendTimestamp +'</p></div></div></div>';
  }

  $("#containerM").append(data);
  //$("#online").empty();
  //$("#online").append('<img class="online_offline" src="img/online.png" alt="">');

  window.scrollBy(0, 1000);

}

function search(){

  $('#containerM>div').css("display", "block");

  $('#modal_search').modal('close');

  var cards = $('#containerM').children();
  var search = $('#search').val().toUpperCase();

  if (search.length > 0) {

    var cont = 0;

    for (var i = 0; i < cards.length; i++) {

      var message = cards[i].getElementsByClassName("message_text")[0].innerText.toUpperCase();

      if (!message.includes(search)){

        $(cards[i]).css("display", "none");

      }else {

        cont++;

      }

    }

    if (cont == 0) {

      noResult = '<center><h4 class="no_result">No se encontró ningún chat</h4></center>';
      $("#containerM").append(noResult);

    }

  }

}

function send(){

  if (!$('#message').val().trim()) return;

  var message = {userID: localStorage.getItem("userID"), accessToken: localStorage.getItem("token"), chatID: url_params.idChat, chatUserID: url_params.idUser, message: $('#message').val()};
  socket.emit("send_message", message);

  var sendMessage = {userID: localStorage.getItem("userID"), message: $('#message').val(), sendTimestamp: new Date().toJSON().substring(0,16).replace('T',' ')};
  paint(sendMessage);

  $('#message').val("");
  Materialize.updateTextFields();

}

function url_to_array(url) {

    var request = {};

    var pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        if(!pairs[i])
            continue;
        var pair = pairs[i].split('=');
        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
     }
     return request;
 }

function inicialize(){

  url_params = url_to_array(window.location.href);

  $("#notes").attr("href", "/notes.html?idUser="+url_params.idUser);

  socket.emit("pairing", localStorage.getItem("userID"));

  var credentials = {userID: localStorage.getItem("userID"), chatID: url_params.idChat};
  socket.emit("get_chat", credentials);
  socket.emit("get_rating", {userID: url_params.idUser});

}

function sendValoration(id) {

  var rating = id.split("-")[1];

  socket.emit("set_rating", {userID: url_params.idUser, value: rating});

}

function closeSesion(){

  localStorage.removeItem("userID");
  localStorage.removeItem("token");

  $("#containerM").append('<a id="link" style="display:none" href="/"></a>');
  document.getElementById("link").click();

}

$(document).ready(function(){

    $('.modal').modal();

    inicialize();

});
