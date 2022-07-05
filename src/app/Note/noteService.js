const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const noteProvider = require("./noteProvider");
const noteDao = require("./noteDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 노트 생성
exports.createNote = async function (title, img, user_id) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {

        const insertNoteInfoParams = [title,img,user_id];


        const NoteMakeResult = await noteDao.insertNoteInfo(connection, insertNoteInfoParams);
        console.log(`추가된 노트 : ${NoteMakeResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createNote Service error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 노트 제목,이미지 수정
exports.editNote = async function (title,img, id) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        //console.log(change)
        const editNoteResult = await noteDao.updateNoteInfo(connection, title,img, id)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 노트 표지 수정
exports.editNoteImg = async function (img, title) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const editNoteResult = await noteDao.updateNoteImg(connection, img, title)
        console.log("here");
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally{ connection.release();}
}

// 노트 삭제
exports.deleteNote = async function (id) {

  const connection = await pool.getConnection(async (conn) => conn);

  const noteResults = await noteDao.deleteNote(connection, id);

  console.log("삭제 성공");
  connection.release();

  return noteResults[0];
};