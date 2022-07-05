const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

const postDao = require("./postDao");

// Provider: Read 비즈니스 로직 처리

//  전체 조회
exports.retrievePostList = async function (noteIdx) {

    const connection = await pool.getConnection(async (conn) => conn);

    try{
        const postListResult = await postDao.selectPost(connection,noteIdx);
       // console.log(postListResult);
        connection.release();
        return postListResult;

    } catch (err) {
             logger.error(`App - editUser Service error\n: ${err.message}`);
             connection.release();
             return errResponse(baseResponse.DB_ERROR);

    }
};

// 특정 날짜 전체 조회
exports.retrieveDateList = async function (createdAt) {

    const connection = await pool.getConnection(async (conn) => conn);

    try{
          const postResults = await postDao.selectDate(connection, createdAt);
            connection.release();
            console.log(postResults);
          return postResults[0];

          } catch (err) {
                  logger.error(`App - editUser Service error\n: ${err.message}`);
                connection.release();
                  return errResponse(baseResponse.DB_ERROR);

          }

};

// 특정 노트 조회(사용자 아이디 값으로)
exports.retrieveNote = async function (userId) {

  const connection = await pool.getConnection(async (conn) => conn);

  try{

      const noteResults = await postDao.selectNoteByUser(connection, userId);

      connection.release();

       return noteResults;
        } catch (err) {
                logger.error(`App - editUser Service error\n: ${err.message}`);
                connection.release();
                return errResponse(baseResponse.DB_ERROR);
                }

};

// 글 조회(노트 아이디 값으로)
exports.retrievePost = async function (noteId,createdAt) {

  const connection = await pool.getConnection(async (conn) => conn);

  try{
      const params = [noteId,createdAt]
      const postResults = await postDao.selectDate(connection, noteId,createdAt);

      connection.release();

       return postResults;

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
        const userResult = await postDao.selectUserById(connection,noteIdx);
        connection.release();
        console.log("userReesult",userResult);
        return userResult;

    } catch (err) {
                logger.error(`App - editUser Service error\n: ${err.message}`);
                connection.release();
                return errResponse(baseResponse.DB_ERROR);
    }
};

// 노트 유뮤 확인
exports.availableNote = async function (id) {

  const connection = await pool.getConnection(async (conn) => conn);

  try{
        const noteResult = await postDao.selectNoteById(connection, id);
        connection.release();
        console.log(noteResult)
        return noteResult[0];

  } catch (err) {
            logger.error(`App - editUser Service error\n: ${err.message}`);
            connection.release();
            return errResponse(baseResponse.DB_ERROR);

  }
};


