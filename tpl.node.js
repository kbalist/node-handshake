const path = require('path'),
      express = require('express'),
      mockup = require('./mockups/mockup'),
      app = module.exports = express.createServer(),
      port = process.env.PORT || 1337;
      
/** Configuration */
app.configure(function() {
  this.set('views', path.join(__dirname, 'views'));
  this.set('view engine', 'ejs');
  this.use(express.static(path.join(__dirname, '/public')));
});
/** Routes */


/** Home page (requires authentication) */
app.get('/:tpl', function (req, res, next) {
    tpl = req.params.tpl;
  res.render(tpl, getMockup(session));
});
app.get('/', function (req, res, next) {
  res.render('index', getMockup(session));
});

/** Start server */
if (!module.parent) {
  app.listen(port)
}
