module.exports = function(app){
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

   // 0. 테스트 API
     //app.get('/app/test', note.getTest);

    // 1. 글 생성 API
    app.post('/app/post', jwtMiddleware,post.postPost);

    // 2. 전체 글 조회 API (+ 검색)
    app.get('/app/notes/:noteIdx/posts',jwtMiddleware,post.getPosts);
//
//    // 3. 특정 노트 글 조회 API
//   app.get('/app/post/{title}', jwtMiddleware,post.getNoteByTitle);
//
   // 4. 특정 날짜 글 조회 API
   app.get('/app/get/Date', jwtMiddleware,post.getDateByPost);

   // 5. 글 수정 API
   app.patch('/app/posts/:postIdx', jwtMiddleware,post.patchContents);

   // 6. 글 삭제 API
      app.patch('/app/posts/:postIdx/status', jwtMiddleware,post.deletePost);
};