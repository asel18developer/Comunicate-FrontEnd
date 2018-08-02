var socket = io.connect();
var url_params;

socket.on('obtain_notes', function(notes) {

  if (!notes.data.notesList) {

    var noResult = '<center><h4 id="no_result" class="no_result">Este usuario no tiene notas</h4></center>';
    $("#containerN").append(noResult);

    return;

  }

  for (var i = 0; i < notes.data.notesList.length; i++) {
    paint(notes.data.notesList[i]);
  }

});

function paint(note){

  var data = '<div class="col s12 m6 offset-m3 l4 offset-l4"><div class="card-panel circular_border_55 teal"><span class="white-text"><pre>'+note.noteText.trim()+'</pre></span></div></div>';
  $("#containerN").append(data);

  window.scrollBy(0, 1000);

}

function sendNote(){

  if (!$('#nota').val().trim()) return;

  var note = {userID: url_params.idUser, byUserID: localStorage.getItem("userID"), noteText: $('#nota').val()};
  socket.emit("send_note", note);

  $('#no_result').remove();

  paint(note);

  $('#nota').val("");
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

  socket.emit("get_notes", {userID: url_params.idUser});

}

$(document).ready(function(){

    inicialize();

});
