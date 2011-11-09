const path = require('path'),
      express = require('express'),
      mockup = require('./mockups/mockup.node.js'),
      app = module.exports = express.createServer(),
      deviceDetector = require('./node_lib/deviceDetector.js'),
      port = process.env.PORT || 1337;

      function getConf(filePath){
          confpath = path.join(process.cwd(), filePath );  
          var fileContents = require('fs').readFileSync(confpath,'utf8'); 
          var schema = JSON.parse(fileContents);
          return schema;
      }
      
var config = getConf('./conf.json');
console.log(config);

 
/** Configuration */
app.configure(function() {
  this.set('views', path.join(__dirname, 'views'));
  this.set('view engine', 'ejs');
  this.use(express.static(path.join(__dirname, '/public')));
  this.use(express.cookieParser()); // Allow parsing cookies from request headers
  // Session management
  // Internal session data storage engine, this is the default engine embedded with connect.
  // Much more can be found as external modules (Redis, Mongo, Mysql, file...). look at "npm search connect session store"
  this.sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });
  this.use(express.session({
    // Private crypting key
    "secret": "some private string",
    "store":  this.sessionStore
  }));
  // Allow parsing form data
  this.use(express.bodyParser());
});
app.configure('development', function(){
  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  this.use(express.errorHandler());
});
 
/** Routes */
app.get('/session-index', function (req, res, next) {
  req.session.index = (req.session.index || 0) + 1;
  res.render('session-index', {
    "index":  req.session.index,
    "sessId": req.sessionID,
    "userName": req.session.username
  });
});
app.get('/tpl/:tpl', function (req, res, next) {
  req.session.index = (req.session.index || 0) + 1;
  res.render(tpl, getMockup(session));
});

/** Middleware for limited access */
function requireLogin (req, res, next) {
  if (req.session.username) {
    // User is authenticated, let him in
    next();
  } else {
    // Otherwise, we redirect him to login form
    res.redirect("/login");
  }
}

/** Home page (requires authentication) */
app.get('/', [requireLogin], function (req, res, next) {
  res.render('index', { "username": req.session.username });
});

/** Login form */
app.get("/login", function (req, res) {
  // Show form, default value = current username
  res.render("login", { "username": req.session.username, "error": null });

});
app.post("/login", function (req, res) {

  var options = { "username": req.body.username, "error": null };
  if (!req.body.username) {
    options.error = "User name is required";
    res.render("login", options);
  } else if (req.body.username == req.session.username) {
    // User has not changed username, accept it as-is
    res.redirect("/");
  } else if (!req.body.username.match(/^[a-zA-Z0-9\-_]{3,}$/)) {
    options.error = "User name must have at least 3 alphanumeric characters";
    res.render("login", options);
  } else {
    // Validate if username is free
    req.sessionStore.all(function (err, sessions) {
      if (!err) {
        var found = false;
        for (var i=0; i<sessions.length; i++) {
break; //cheat to permit multiple connexions
          var session = JSON.parse(sessions[i]);
          if (session.username == req.body.username) {
            err = "User name already used by someone else";
            found = true;
            break;
          }
        }
      }
      if (err) {
        options.error = ""+err;
        res.render("login", options);
      } else {
        req.session.username = req.body.username;
        var deviceInfo = deviceDetector.getInfos( req.headers['user-agent']);
        console.log( 'isMobile : '+ deviceInfo.isMobile )
        req.session.device = deviceInfo.type;
        res.redirect("/");
      }
    });
  }
});

/** WebSocket */
var sockets = require('socket.io').listen(app).of('/chat');
const parseCookie = require('connect').utils.parseCookie;

sockets.authorization(function (handshakeData, callback) {
    var fields = ['username','device'];
  var cookies = parseCookie(handshakeData.headers.cookie);  // Read cookies from handshake headers
  var sessionID = cookies['connect.sid'];  // We're now able to retrieve session ID
  if (!sessionID) {
    callback('No session', false);
  } else {
    // Store session ID in handshake data, we'll use it later to associate session with open sockets
    handshakeData.sessionID = sessionID;
    // On récupère la session utilisateur, et on en extrait son username
    app.sessionStore.get(sessionID, function (err, session) {
      if (!err && session) {
          for(i=0; i<fields.length; i++){
              
          }
          if(session.device){
              handshakeData.device = session.device; // On stocke ce username dans les données de l'authentification
          }
          if(session.username) {
            handshakeData.username = session.username; // On stocke ce username dans les données de l'authentification
            callback(null, true); // OK, on accepte la connexion
          }
      }
      else {
        callback(err || 'User not authenticated', false); // Session incomplète, ou non trouvée
      }
    });
  }
});
// Active sockets by session
var connections = {};
sockets.on('connection', function (socket) {
  var sessionID = socket.handshake.sessionID; // Store session ID from handshake
  var username = socket.handshake.username; // Same here, to allow event "bye" with username
  var device = socket.handshake.device;
  // create room per user 
  socket.room = username;
  socket.join(socket.room);
  
  if ('undefined' == typeof connections[sessionID]) {
    connections[sessionID] = { "length": 0 };
    // First connection
//    sockets.in(socket.room).emit('join', 'yataa', Date.now());
  }
  sockets.in(socket.room).emit('join', device, Date.now());
  
  
  sockets.in(socket.room).emit('model', mockup.getMockup('media') );
  
  // Add connection to pool
  connections[sessionID][socket.id] = socket;
  connections[sessionID].length ++;
  
  // When user leaves
  socket.on('disconnect', function () {
    // Is this socket associated to user session ?
    var userConnections = connections[sessionID];
    if (userConnections.length && userConnections[socket.id]) {
      // Forget this socket
      userConnections.length --;
      delete userConnections[socket.id];
    }
    if (userConnections.length == 0) {
      // No more active sockets for this user: say bye
      sockets.in(socket.room).emit('bye', username, Date.now());
      
    }
    socket.leave(socket.room);
  });
  // New message from client = "write" event
  socket.on('write', function (message) {
      console.log(username + ' : ' + message);
    sockets.in(socket.room).emit('message', username, message, Date.now());
  });
  // New search from client = "write" event
  socket.on('search', function (query) {
      console.log(username + ' search for ' + query);
    sockets.in(socket.room).emit('search',  mockup.getMockup('search'));
  });
  // New resetSearch from client
  socket.on('resetSearch', function () {
    sockets.in(socket.room).emit('newmodel', mockup.getMockup('media') );
  });
  
});

/** Start server */
if (!module.parent) {
  app.listen(port)
}
