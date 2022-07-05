const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const axios = require("axios")
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const jwt = require("jsonwebtoken");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
 exports.getTest = async function (req, res) {
     console.log("테스트 성공")
     return res.send(response(baseResponse.SUCCESS))
 }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, pw, name} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        pw,
        name
    );

    return res.send(signUpResponse);
};

  exports.getToken = async function (req,res) {

    const token = getCookie('authorize-access-token')
    if(token) {
      Kakao.Auth.setAccessToken(token)
      Kakao.Auth.getStatusInfo(({ status }) => {
        if(status === 'connected') {
          document.getElementById('token-result').innerText = 'login success. token: ' + Kakao.Auth.getAccessToken()
        } else {
          Kakao.Auth.setAccessToken(null)
        }
      })
    }
  }
/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const name = req.query.name;

    if (!name) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByName = await userProvider.retrieveUserList(name);
        return res.send(response(baseResponse.SUCCESS, userListByName));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.query.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};

// * API Name : 로그인 API
// * [POST] /app/login
// * body : validation code

exports.login = async function (req,res) {

const access = req.body.access;

if(!access) return res.send(errResponse(baseResponse.USER_TOKEN_NOT_EXIST));

axios({
  method: 'post',
  url: 'https://kapi.kakao.com/v2/user/me',
  'headers': { 'Authorization' : `Bearer ${access}`}
  })
  .then(async function(response){
    // 사용자 아이디 kakao에서 받기
    const userId = response.data.id;
    console.log('respnse',response);
    const signInResponse = await userProvider.retrieveUser(userId);
    console.log("signInResponse:",signInResponse);
    return res.send(signInResponse);
  })
 .catch((response) => {
 //console.log(response);
    return res.send(errResponse(baseResponse.USER_TOKEN_NOT_EXIST));
 })

};

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId
    const email = req.body.email;
    //const password = req.body.pw;
    //const name = req.body.name;
    // 위에까지 성공
    // 오류 내용 userid 안들어감

    const userId = req.body.userId;

    console.log(userId)

    //const userIdFromJWT = req.verifiedToken.userId;

    //if (userIdFromJWT != userId) {

        //res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} else {

        const editUserInfo = await userService.editUser(userId, email)
        return res.send(editUserInfo);
   // }
};


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
