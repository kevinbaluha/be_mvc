'use strict'

let terms = require('../model/terms');
let Client = require('node-rest-client').Client;
let config = require('config');

/*
 * GET /book route to retrieve all the books.
 */

function RestCall( r_parms, url , restcb, cb_options) {
    let client = new Client();
    let args = {
        path: r_parms,
        headers: { "Content-Type": "application/json" }
        };

    let rest_req = client.get(url, args, function (data, response) {
        restcb(data,response,cb_options);
        });

    rest_req.on('error', function (err) {
        //console.log('request error', err);
        cb_options.res.status(503).send(''/*Vocabulary Request Has No Data'*/); 
        });

    }



function HandleVocabulary(data, response, options) {
    if (parseInt(data.response.$.totalCount) < 1) {
        options.res.status(404).send(''/*Vocabulary Request Has No Data'*/); 
        return;
        }

    let idx = config.get('Vocabulary.index');
    options.item = data.response.terms.term[idx];
    
    RestCall({ tid: options.item.$.tid }, 
            config.get('Services.videos'),
            VideoScan,   
            options);
    }

function VideoScan(data, response, options) {
    if (parseInt(data.response.$.totalCount) < 1) {
        options.res.status(404).send('item tid ' + options.item.$.tid + ' Has No Data'); 
        return;
        }

    data.response.titles.title.forEach(function ( title, t_idx, a ) {
        if (title.preview == undefined || title.preview.$ == undefined)  {
            return;
            }

        let f = title.preview.$;
        options.answer.titleNid = title.$.nid;
        //options.answer.featureNid = title.feature.nid;
        if (f.duration != undefined && options.answer.previewDuration < parseInt(f.duration) ) {
            options.answer.previewNid = f.nid;
            options.answer.previewDuration = f.duration;
            } 
        });

    RestCall(options.answer, 
            config.get('Services.media'),
            ReturnResponse,
            options);

    }

function ReturnResponse(data, response, options) {
    if (data.response == undefined || 
        data.response.mediaUrls == undefined ||
        data.response.mediaUrls.$ == undefined ||
        data.response.mediaUrls.$.bcHLS == undefined ) {
        options.res.status(404).send('mediaUrl not found'); 
        return;
        }
        
    options.answer.bcHLS = data.response.mediaUrls.$.bcHLS;
    options.res.setHeader('Content-Type', 'application/json');
    options.res.json(options.answer);
    }

function getLongestPreviewMediaURL(req, res) {
    //console.log(req);
    res.setHeader('Content-Type', 'application/json');

    let answer  = new terms.MediaUrl({"bcHLS": '', "titleNid": -1, "previewNid": -1, "previewDuration": -1});

    RestCall({ tid: req.params.tid }, 
            config.get('Services.vocabulary'),
            HandleVocabulary,   
            { "answer": answer, "res": res });
    }

module.exports = { getLongestPreviewMediaURL };
