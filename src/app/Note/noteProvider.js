const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const noteDao = require("./noteDao");

// Provider: Read 비즈니스 로직 처리

// 노트 전체 조회
exports.retrieveNoteList = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try{
        const noteListResult = await noteDao.selectNote(connection,userId);
        console.log(noteListResult);
        connection.release();
        return noteListResult;
        }catch(err){
            logger.error(`App - editUser Service error\n: ${err.message}`);
            connection.release();
            return errResponse(baseResponse.DB_ERROR);
        }



//   else {
//    const connection = await pool.getConnection(async (conn) => conn);
//    const userListResult = await userDao.selectUserEmail(connection, email);
//    connection.release();
//
//    return userListResult;
//  }
};

// 특정 노트 조회
exports.retrieveNote = async function (noteId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try{
      const noteResults = await noteDao.selectNoteId(connection, noteId);
      connection.release();
      return noteResults[0];
  } catch(err) {
            logger.error(`App - editUser Service error\n: ${err.message}`);
            connection.release();
             return errResponse(baseResponse.DB_ERROR);
  }
};

// 노트 유뮤 확인
exports.availableNote = async function (id) {

  const connection = await pool.getConnection(async (conn) => conn);

  try{
        const noteResult = await noteDao.selectNoteById(connection, id);
        connection.release();
        console.log(noteResult)
        return noteResult[0];

  } catch (err) {
            logger.error(`App - editUser Service error\n: ${err.message}`);
            connection.release();
            return errResponse(baseResponse.DB_ERROR);

  }
};

// 사용자 확인
exports.availableUser = async function (noteIdx) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const userResult = await noteDao.selectUserById(connection,noteIdx);
        connection.release();
        console.log("userReesult",userResult);
        return userResult;

    } catch (err) {
                logger.error(`App - editUser Service error\n: ${err.message}`);
                connection.release();
                return errResponse(baseResponse.DB_ERROR);
    }
};
