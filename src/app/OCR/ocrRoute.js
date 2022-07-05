module.exports = function(app){
    const ocr = require('./ocrController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    app.post('/app/ocr', ocr.postOCR);

};