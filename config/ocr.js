/* Module Import */
const axios = require('axios');
const fs = require('fs');

const {OCR_API_URL, OCR_SECRET_KEY} = require("./secret");

exports.processOCR = function (imageURL) {

    /* Definition of Constant Variable */
    const MY_OCR_API_URL = OCR_API_URL;
    const MY_OCR_SECRET_KEY = OCR_SECRET_KEY;

    /* Definition of Headers, Required Variable */
    let config = {
        headers: {
            "Content-Type": "application/json",
            "X-OCR-SECRET": MY_OCR_SECRET_KEY
        }
    }

    let timestamp = new Date().getTime();

    /* Axios URL Call & Work Response Data */
    return axios.post(MY_OCR_API_URL,
        {
            "images": [
                {
                    "format": "png",
                    "name": "medium",
                    "data": null,
                    "url": imageURL,
                }
            ],
            "lang": "ko",
            "requestId": "string",
            "resultType": "string",
            "timestamp": timestamp,
            "version": "V1"
        }, config)
        // .then(function (response) {
        //
        //     /* Make Response Data to Text Data */
        //     response.data.images[0].fields.forEach(element => {
        //         console.log(element.inferText);
        //         sumText += " " + element.inferText;
        //     });
        //
        //     // console.log("-------------------");
        //     // console.log(sumText);
        //     // console.log("-------------------");
        //     //
        //     // /* Save Text File */
        //     // fs.writeFileSync('ncp_ocr.txt', sumText, 'utf-8');
        //
        //     /* Return sumText */
        //     return sumText;
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
}


