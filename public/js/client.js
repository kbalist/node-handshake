var searchControl = {
    formId : '#search-form',
    searchBarId : '#search-bar',
    reset : function(){
        socket.emit('resetSearch');
        this.hideSearchBar();
    },
    showSearchBar : function(query){
        $(this.searchBarId+' span').html("Results for '" + query + "'");
        $(this.searchBarId).show();
    },
    hideSearchBar : function(){
        $(this.searchBarId).hide();        
    }
}
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
    var searchValue = $('#search-input').val();
    socket.emit('search', searchValue);
    searchControl.showSearchBar(searchValue);
    $('#search-input').val('');
    return false;
});
$('#search-bar a').click(function(e){
    searchControl.reset();
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
    console.log(items);
    for(i=0; i<items.length; i++){
        itemsArea.append('<section>' + items[i].name + '</section>');
    }
}

function resetItems(){
    itemsArea.empty();
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
//    alert('BIG Error: ' + error);
})
.on('search', function (model) {
    resetItems();
    addItems(model);
})
.on('model', function (model) {
    addItems(model)
})
.on('newmodel', function (model) {
     resetItems();
    addItems(model)
})

