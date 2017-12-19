let express = require('express');
let app = express();
let port = 8080;
let terms = require('./app/routes/terms');

app.route("/terms/:tid/longest-preview-media-url")
    .get(terms.getLongestPreviewMediaURL);

app.route("/dude")
    .get(terms.dude);

app.listen(port);

console.log("Listening on port " + port);

module.exports = app;
