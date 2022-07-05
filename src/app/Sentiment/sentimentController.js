const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const axios = require("axios")
const sentimentService = require("../../app/Sentiment/sentimentService")
/**
 * API No. 40
 * API Name : 감정분석 API
 * [GET] /app/sentiment
 * body : content
 **/
exports.postSent = async function (req, res) {

const content = req.body.content;
const id = req.body.id;

axios({
  method: 'post',
  url: 'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze',
  'headers': { 'X-NCP-APIGW-API-KEY-ID' : '4gojpwbnmd',
               'X-NCP-APIGW-API-KEY' : 'UuAi4OYGuxcBvX9wNNozBbtOgu1JxPPwRSXgJRRH',
               'Content-Type' : 'application/json'
                },
  'data' : {
            'content' : `${content}`
  },
})
  .then(async function(response){
    console.log(response.data.document)
    const data = response.data.document.sentiment;
    console.log(data)
    const moodResponse = await sentimentService.createSent(
        id,
        data
    );
      return res.send(moodResponse);
  })
 .catch((response) => {
 console.log(response);
 //return
 })
}