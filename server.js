process.env.COVERAGE = "true";

let im = require('istanbul-middleware');

let isCoverageEnabled = (process.env.COVERAGE == "true"); 
 
if (isCoverageEnabled) {
    console.log('coverage enabled');
    im.hookLoader(__dirname);
    }
 
let express = require('express');
let app = express();

if (isCoverageEnabled) {
    app.use('/coverage', im.createHandler());
    }
 
let port = 8080;
let terms = require('./app/routes/terms');

app.route("/terms/:tid/longest-preview-media-url")
    .get(terms.getLongestPreviewMediaURL);

app.listen(port);

console.log("Listening on port " + port);

module.exports = app;
