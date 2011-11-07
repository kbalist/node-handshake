/** Middleware for mockup management */

var path = require('path'),
    fs   = require('fs');

function getMockup(fileName){
    var confpath = path.join(process.cwd(), 'mockups', fileName + '.json' );  
    var fileContents = fs.readFileSync(confpath,'utf8'); 
    var schema = JSON.parse(fileContents);
    return schema;
}

exports.getMockup = getMockup;