let express = require('express');
let app = express();
let config = require('config');

let port = 8080;

let terms = require('./app/routes/terms');
let endpoint = config.get('Endpoint');
app.route(endpoint)
    .get(terms.getLongestPreviewMediaURL);

app.listen(port);

console.log("Listening on port " + port);

module.exports = app;
