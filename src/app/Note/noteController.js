const jwtMiddleware = require("../../../config/jwtMiddleware");
const noteProvider = require("../../app/Note/noteProvider");
const noteService = require("../../app/Note/noteService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// console.log("수정 완료")
/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
//exports.getTest = async function (req, res) {
//     console.log("테스트 성공2")
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 노트 생성 API
 * [POST] /app/note
 * body : title, user_id
 */
 exports.postNotes = async function (req, res) {

    // 노트 제목,부제목,이미지 받아 오기
    const title = req.body.title;
    const img  = req.body.img;
    //const userId = req.query.userId;

    //userId 꺼내기
    const userIdResult = req.verifiedToken.userId;
    if(!title) return res.send(errResponse(baseResponse.NOTE_TITLE_EMPTY));

    //if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

     const signUpResponse = await noteService.createNote(
         title,
         img,
         userIdResult
              );

     return res.send(signUpResponse);
 }

/**
 * API No. 2
 * API Name : 사용자 별 노트 조회 API (+ user_id로 검색 조회)
 * [GET] /app/notes
 * body : userId
 */
exports.getNotes = async function (req, res) {

    /**
     * Query String: user_id
     */
    const userId = req.query.userId;
    console.log(userId)

    //if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userIdResult = req.verifiedToken.userId;
        // 노트 전체 조회
        const noteListResult = await noteProvider.retrieveNoteList(userIdResult);
        return res.send(response(baseResponse.SUCCESS, noteListResult));

};

/**
 * API No. 3
 * API Name : 특정 노트 조회 API
 * [GET] /app/note
 * params : noteId
 */
exports.getNoteById = async function (req, res) {

    const id = req.query.noteId;

    console.log(id);

    if (!id) return res.send(errResponse(baseResponse.NOTE_TITLE_EMPTY));

    // DB에 있는 노트인지 확인

    const availableNote = await noteProvider.availableNote(id);

    if (!availableNote) return res.send(errResponse(baseResponse.INAVALIABLE_NOTE_ID));
        //console.log("aaaa");

    // TODO: 요청한 사용자가 실제 노트 사용자와 같은지 확인
    const userId = await noteProvider.availableUser(id);
    console.log("userId1",userId[0]);
    const userIdResult = req.verifiedToken.userId;
    console.log("userIdResult1",userIdResult);

    if(userId[0].user_Id != userIdResult) return res.send(errResponse(baseResponse.USER_ACCESS_PROHIBIT));

    const noteByNoteId = await noteProvider.retrieveNote(id);

    return res.send(response(baseResponse.SUCCESS, noteByNoteId));
};

/**
 * API No. 5
 * API Name : 노트 수정 API
 * [PATCH] /app/note/:noteIdx
 * query : noteIdx
 */
exports.patchNote = async function (req, res) {

    // 바꿀 제목,이미지
    const title = req.body.title;
    const img = req.body.img;
    // 바꿀 노트의 번호
    const id = req.query.noteIdx;
    console.log("here1",id);
    if (!id) return res.send(errResponse(baseResponse.NOTE_ID_EMPTY));
    if (!title) return res.send(errResponse(baseResponse.NOTE_TITLE_EMPTY));
    console.log("here2",title)
    console.log("img",img)
    // DB에 있는 노트인지 확인
    const availableNote = await noteProvider.availableNote(id)
    console.log(availableNote)
    if (!availableNote) return res.send(errResponse(baseResponse.INAVALIABLE_NOTE_ID));

    console.log("avail",availableNote)


    // 요청한 사용자가 실제 노트 사용자와 같은지 확인
    const userId = await noteProvider.availableUser(id);
    console.log("userId1",userId[0]);
    const userIdResult = req.verifiedToken.userId;
    console.log("userIdResult1",userIdResult);

    if(userId[0].user_Id != userIdResult) return res.send(errResponse(baseResponse.USER_ACCESS_PROHIBIT));

        const editNoteInfo = await noteService.editNote(title,img,id)
        return res.send(editNoteInfo);
}

///**
// * API No. 6
// * API Name : 노트 표지 수정 API
// * [PATCH] /app/note/img
// * body : title, img
// */
//exports.patchImg = async function (req, res) {
//
//    const title = req.body.title;
//    const img = req.body.img;
//
//    if (!title) return res.send(errResponse(baseResponse.NOTE_TITLE_EMPTY));
//    if (!img) return res.send(errResponse(baseResponse.NOTE_IMG_EMPTY));
//
//        const editNoteInfo = await noteService.editNoteImg(title, img)
//        return res.send(editNoteInfo);
//}

/**
 * API No. 7
 * API Name : 노트 삭제 API
 * [PATCH] /app/note/:noteIdx/status
 * path variable : noteIdx
 */
 exports.deleteNote = async function (req, res) {

     const id = req.params.noteIdx;
     //console.log("id",id);

    // noteTitle 비어있는지 확인
     if (!id) return res.send(errResponse(baseResponse.NOTE_TITLE_EMPTY));

     //console.log("ok1");

   // DB에 있는 노트인지 확인

    const availableNote = await noteProvider.availableNote(id)

    if (!availableNote) return res.send(errResponse(baseResponse.INAVALIABLE_NOTE_ID));
        //console.log("aaaa");

    // 요청한 사용자가 실제 노트 사용자와 같은지 확인
    const userId = await noteProvider.availableUser(id);
    console.log("userId1",userId[0]);
    const userIdResult = req.verifiedToken.userId;
    console.log("userIdResult1",userIdResult);

    if(userId[0].user_Id != userIdResult) return res.send(errResponse(baseResponse.USER_ACCESS_PROHIBIT));

         const deleteNoteInfo = await noteService.deleteNote(id);

         return res.send(response(baseResponse.DSUCCESS, deleteNoteInfo));
 }