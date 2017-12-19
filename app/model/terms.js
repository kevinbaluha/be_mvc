let  Schema = require('schema-object');

let MediaUrl = new Schema ({
    "bcHLS": String,
    "titleNid": Number,
    "previewNid": Number,
    "previewDuration": Number
    });

module.exports = { MediaUrl };
