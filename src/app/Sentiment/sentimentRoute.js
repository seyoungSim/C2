module.exports = function(app){
    const sent = require('./sentimentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/app/sentiment', sent.postSent);

};