const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const sentimentDao = require("./sentimentDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 감정 저장
exports.createSent = async function (id,sent) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {

        const insertSentInfoParams = [id,sent];

        const NoteMakeResult = await sentimentDao.insertSentInfo(connection, id,sent);
        connection.release();
        return response(baseResponse.SUCCESS,{'mood':sent});


    } catch (err) {
        logger.error(`App - createNote Service error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};