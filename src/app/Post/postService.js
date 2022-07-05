const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const postProvider = require("./postProvider");
const postDao = require("./postDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 글 생성
exports.createPost = async function (title,subtitle,content,img,note_id) {

    try {
        const insertPostInfoParams = [title,subtitle,content,img,note_id];
        const connection = await pool.getConnection(async (conn) => conn);
        const PostMakeResult = await postDao.insertPostInfo(connection, insertPostInfoParams);
        console.log(`추가된 글 : ${PostMakeResult[0].insertId}`)
        var postnum = {'postId':PostMakeResult[0].insertId};
        connection.release();
        return response(baseResponse.SUCCESS,postnum);
    } catch (err) {
        logger.error(`App - createNote Service error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 글 내용 수정
exports.editContents = async function (content,title,sub,img, id) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        console.log(content)
        const editPostInfoParams = [content,title,sub,img,id];
        const editPostContentsResult = await postDao.updateContentsInfo(connection, editPostInfoParams)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
}

//// 노트 표지 수정
//exports.editNoteImg = async function (img, title) {
//    try {
//        //console.log(change)
//        const connection = await pool.getConnection(async (conn) => conn);
//        const editNoteResult = await noteDao.updateNoteImg(connection, img, title)
//        connection.release();
//
//        return response(baseResponse.SUCCESS);
//
//    } catch (err) {
//        logger.error(`App - editUser Service error\n: ${err.message}`);
//        return errResponse(baseResponse.DB_ERROR);
//    }
//}

// 글 삭제
exports.deletePost = async function (title) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const postResults = await postDao.deletePost(connection, title);
        connection.release();
      return postResults[0];

      } catch (err) {
              logger.error(`App - editUser Service error\n: ${err.message}`);
            connection.release();
              return errResponse(baseResponse.DB_ERROR);

      }
};