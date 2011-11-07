/** Middleware for mockup management */

function getMockup(fileName){
    return getJSON('mockups/' + fileName + '.json');
    var confpath = path.join(process.cwd(), 'mockups', fileName + '.json' );  
    var fileContents = require('fs').readFileSync(confpath,'utf8'); 
    var schema = JSON.parse(fileContents);
    return schema;
}

exports.getMockup = getMockup;