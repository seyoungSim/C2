const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (name) {

  if (!name) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, name);
    connection.release();

    return userListResult;
  }
};

// kakao 아이디 조회
exports.retrieveUser = async function (userId) {

  const connection = await pool.getConnection(async (conn) => conn);

  let userIdx = 0;
  const userResult = await userDao.kakaoIdInfo(connection, userId);
  console.log("userResult: " + userResult);

    // 사용자가 기존에 없다면 회원가입
    if(userResult[0] == null){

//    console.log("userResult::: " + userResult.count)
     const addUser = await userDao.insertUserInfo(connection,userId);
     userIdx = addUser[0].insertId;
     console.log("insert" + userId);
      //console.log("userResult:",userResult);

    }else {
//      const userResult = await userDao.kakaoIdInfo(connection,userId);
        console.log(userResult)
      userIdx = userResult[0].id;

    }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
    connection.release();
    return response(baseResponse.SUCCESS,{'userId': userResult[0].id, 'jwt': token});

};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};