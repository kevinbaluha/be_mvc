'use strict'

let terms = require('../model/terms');
var Client = require('node-rest-client').Client;

/*
 * GET /book route to retrieve all the books.
 */

function getLongestPreviewMediaURL(req, res) {
    var answer  = new terms.MediaUrl({"bcHLS": '', "titleNid": -1, "previewNid": -1, "previewDuration": -1});
    let client = new Client();
    var args = {
        path: { tid: req.params.tid },
        headers: { "Content-Type": "application/json" }
        };

    let url = 'http://d6api.gaia.com/vocabulary/1/${tid}';

    client.get(url, args, function (data, response) {
        let item = data.response.terms.term[0];
        
        let c2 = new Client();
        let a2 = {
            path: { tid: item.$.tid },
            headers: { "Content-Type": "application/json" }
            };

        let u2 = 'http://d6api.gaia.com/videos/term/${tid}';

        c2.get(u2, a2, function (d2, r2) {
            d2.response.titles.title.forEach(function (title,t_idx,a) {
                if (title.preview == undefined || title.preview.$ == undefined)  {
                    return;
                    }
                let f = title.preview.$;
                answer.titleNid = title.$.nid;
                answer.featureNid = title.feature.nid;
                if (f.duration != undefined && answer.previewDuration < parseInt(f.duration) ) {
                    answer.previewNid = f.nid;
                    answer.previewDuration = f.duration;
                    } 
                });

            let c3 = new Client();
            let a3 = {
                path: answer,
                headers: { "Content-Type": "application/json" }
                };

            let u3 = 'http://d6api.gaia.com/media/${previewNid}';
            c3.get(u3, a3, function (d3, r3) {
                answer.bcHLS = d3.response.mediaUrls.$.bcHLS;
                res.send(answer);
                });
            });
        });
    }

module.exports = { getLongestPreviewMediaURL };
