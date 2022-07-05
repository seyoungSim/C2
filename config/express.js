const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');

var whitelist = ['http://localhost:3006','http://sph.elogdiary.club']

var corsOptions = {
  origin: function(origin, callback){
  var isWhitelisted = whitelist.indexOf(origin) !== -1;
  callback(null, isWhitelisted);
  // callback expects two parameters: error and options
  },
  credentials:true
}

module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors(corsOptions));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    require('../src/app/Note/noteRoute')(app);
    require('../src/app/Post/postRoute')(app);

    require('../src/app/OCR/ocrRoute')(app);
    require('../src/app/Sentiment/sentimentRoute')(app);

    return app;
};