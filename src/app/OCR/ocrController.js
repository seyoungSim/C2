const jwtMiddleware = require("../../../config/jwtMiddleware");
const ocrProvider = require("./ocrProvider");
const ocrService = require("./ocrService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {processOCR} = require("../../../config/ocr");

const regexImageURL = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

exports.postOCR = async function (req, res) {

    const imageURL = req.body.imageURL;

    // TODO: imageURL 형식 확인
    // 길이 체크
    if (!imageURL)
        return res.send(response(baseResponse.OCR_IMAGE_EMPTY));

//    // 형식 체크 (by 정규표현식)
//    if (!regexImageURL.exec(imageURL))
//        return res.send(response(baseResponse.OCR_IMAGE_TYPE_ERROR));

    try {
        processOCR(imageURL)
            .then(function (data) {

                let sumText = "";

                /* Make Response Data to Text Data */
                data.data.images[0].fields.forEach(element => {
                    // console.log(element.inferText);
                    sumText += " " + element.inferText;
                });

                return res.send(response(baseResponse.PROCESSING_OCR_SUCCESS, sumText));

            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (e) {
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }

}




