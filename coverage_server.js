process.env.COVERAGE = "true";

let im = require('istanbul-middleware');

let isCoverageEnabled = (process.env.COVERAGE == "true"); 
 
if (isCoverageEnabled) {
    console.log('coverage enabled');
    im.hookLoader(__dirname);
    }
 
let app = require('./server');

if (isCoverageEnabled) {
    app.use('/coverage', im.createHandler());
    }
