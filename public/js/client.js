var searchControl = {
    formId : '#search-form',
    searchBarId : '#search-bar',
    searchInput : '#search-input',
    query : function(searchValue){
        socketControl.search( searchValue );
        $(this.searchBarId+' span').html("Results for '" + searchValue + "'");
        $(this.searchBarId).show();
    },
    reset : function(){
        socketControl.resetSearch();
        $(this.searchBarId).hide();
        $(this.searchInput).val('');
    }
};

var socketControl = {
    write : function(msg){
        socket.emit('write', msg);
    },
    search : function(){
        
    },
    resetSearch : function(){
        
    },
};

/* locators */
var messagesArea = $('#messages');
var itemsArea = $('#leftCol');

/* Form */
$('#message-form').submit(function () {
    var messageInput = $('#message-input');
    socketControl.write( messageInput.val() );
    messageInput.val('');
    return false;
})
$('#search-form').submit(function () {
    var searchValue = $('#search-input').val();
    searchControl.query( searchValue );
    return false;
});
$('#search-bar a').click(function(e){
    searchControl.reset();
});

/* Display */
function addMessage(username, message, time) {
    $.jGrowl('<strong>' + username + '</strong>: ' + message, { life: 10000 });
}

/* Display */
function addItems(items) {
    console.log(items);
    for(i=0; i<items.length; i++){
        itemsArea.append('<section class="media"><img src="/images/media.png" alt="' + items[i].name + '"><h1>' + items[i].name + '</h1><div class="tools"><button>X</button></div></section>');
        
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

