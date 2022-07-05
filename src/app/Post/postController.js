const jwtMiddleware = require("../../../config/jwtMiddleware");
const postProvider = require("../../app/Post/postProvider");
const postService = require("../../app/Post/postService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");

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
 * API Name : 글 생성 API
 * [POST] /app/post
 * body : title, subtitle, content, img, note_id
 **/
 exports.postPost = async function (req, res) {

    //글 내용 받아오기
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const content = req.body.content;
    const img = req.body.img;
    const noteId = req.query.noteId;

    if(!title) return res.send(errResponse(baseResponse.POST_TITLE_EMPTY));
    if(!subtitle) return res.send(errResponse(baseResponse.POST_SUBTITLE_EMPTY));
    if(!content) return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY));
    if(!noteId) return res.send(errResponse(baseResponse.NOTE_ID_EMPTY));

     const signUpResponse = await postService.createPost(
         title,
         subtitle,
         content,
         img,
         noteId
     );

     return res.send(signUpResponse);
 }

/**
 * API No. 2
 * API Name : 노트 별 글 조회 API (+ noteIdx로 검색 조회)
 * [GET] /app/notes/:noteIdx/posts
 * path variable : noteIdx
 */
exports.getPosts = async function (req, res) {

    /**
     * Path Variable: noteIdx
     */
    const noteId = req.params.noteIdx;

    if(!noteId) return res.send(errResponse(baseResponse.NOTE_ID_EMPTY));
    console.log("id",noteId);

    // 존재하지 않는 노트일경우 사용자 조회 안됨으로 노트 조회 먼저 확인
    // 노트 존재여부 DB 확인
    const availableNote = await postProvider.availableNote(noteId);
    console.log("available",availableNote);
        if (!availableNote) return res.send(errResponse(baseResponse.INAVALIABLE_NOTE_ID));

    // 접근 가능 사용자 확인
    // 노트 소유 userId 값 가져오기
    const userId = await postProvider.availableUser(noteId);
        console.log("userId1",userId[0]);
    // 요청한 userId 값 가져오기
    const userIdResult = req.verifiedToken.userId;
        console.log("userIdResult1",userIdResult);

        if(userId[0].user_Id != userIdResult) return res.send(errResponse(baseResponse.USER_ACCESS_PROHIBIT));

        // 글 전체 조회
        const postListResult = await postProvider.retrievePostList(noteId);

        return res.send(response(baseResponse.SUCCESS, postListResult));

};

/**
 * API No. 4
 * API Name : 특정 날짜 글 조회 API (+ createdAt 로 검색 조회)
 * [GET] /app/get/Date
 * query : createAt
 */
exports.getDateByPost = async function (req, res) {

    /**
     * Path Variable: createAt
    **/
    const createdAt = req.query.createdAt;
    const noteList = [];
    // 접근 가능 사용자 확인

    // 요청한 userId 값 가져오기
        const userIdResult = req.verifiedToken.userId;
        //console.log("userIdResult1",userIdResult);

        // 사용자 노트 id 가져오기
        const noteListResult = await postProvider.retrieveNote(userIdResult);
        //console.log(noteListResult);
        noteListResult.forEach((item) => {
                    noteList.push(item.id);

                });
console.log(noteList);
console.log(noteList[0])
console.log("====================")
    // 노트별 포스트 정보 가져오기
        const postListResult =[];
        // noteListResult(노트 번호 배열) 원소에 포함되는 post를 조회
        for (var value of noteList) {
            console.log('value',value)
            const temp = await postProvider.retrievePost(`${value}`,createdAt);
            //todo: 빈값 들어가는 문제 해결
            if(temp != null) {
            //console.log("temp",temp)
                postListResult.push(...temp);
            }
        }

        console.log(postListResult)

        return res.send(response(baseResponse.SUCCESS, postListResult));

};

/**
 * API No. 5
 * API Name : 글 내용 수정 API
 * [PATCH] /app/posts/:postIdx
 * path variable : postIdx
 * body: change
 */
exports.patchContents = async function (req, res) {

    const id = req.params.postIdx;
    const content = req.body.content;
    const title = req.body.title;
    const sub = req.body.subtitle;
    const img = req.body.img;

    //if (!id) return res.send(errResponse(baseResponse.POST_ID_EMPTY));
    if (!content) return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY));
    if (!title) return res.send(errResponse(baseResponse.POST_TITLE_EMPTY));
    if (!sub) return res.send(errResponse(baseResponse.POST_SUBTITLE_EMPTY));

        const editPostContentsInfo = await postService.editContents(content, title,sub,img,id);
        return res.send(editPostContentsInfo);
}

/**
 * API No. 7
 * API Name : 글 삭제 API
 * [PATCH] /app/posts/:postIdx/status
 * path variable : postIdx
 */
 exports.deletePost = async function (req, res) {

     const id = req.params.postIdx;

         if (!id) return res.send(errResponse(baseResponse.POST_ID_EMPTY));

         const deletePostInfo = await postService.deletePost(id);

         return res.send(response(baseResponse.DSUCCESS, deletePostInfo));

 }