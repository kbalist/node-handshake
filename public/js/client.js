
/* locators */


var messagesArea = $('#messages');
var itemsArea = $('#leftCol');

/* Form */
$('#message-form').submit(function () {
    var messageInput = $('#message-input');
    socket.emit('write', messageInput.val());
    messageInput.val('');
    return false;
})
$('#search-form').submit(function () {
    var searchInput = $('#search-input');
    socket.emit('search', searchInput.val());
    searchInput.val('');
    return false;
});

/* Display */
function addMessage(username, message, time) {
  if (typeof time != 'string') {
    var date = new Date(time);
    time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  var line = '[' + time + '] <strong>' + username + '</strong>: ' + message + '<br />';
  messagesArea.prepend( line );
}

/* Display */
function addItems(items) {
    for(i=0; i<items.length; i++){
        itemsArea.append('<section>' + item.name + '</section>');
    }
}



////////////////////////////////////////////////////////////////
//
//                  websockets
//
////////////////////////////////////////////////////////////////
/** Socket */
var sio = io.connect(), 
socket = sio.socket.of('/chat');


socket
.on('join', function (username, time) {
// someone joined room
addMessage(username, 'joined room', time);
})
.on('bye', function (username, time) {
// someone left room
addMessage(username, 'left room', time);
})
.on('message', function (username, message, time) {
// someone wrote a message
addMessage(username, message, time);
});

/* new implementation */
socket
.on('connect', function () {
    // I'm connected
    //alert("Welcome <%= username %>");
})
.on('error', function (error) {
    // an error occured
    location.reload();
    alert('BIG Error: ' + error);
})

.on('model', function (model) {
//	console.log(model);
addItems(model)
})

