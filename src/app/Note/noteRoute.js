module.exports = function(app){
    const note = require('./noteController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

   // 0. 테스트 API
   //app.get('/app/test', note.getTest);

   // 1. 노트 생성 API
   app.post('/app/note',jwtMiddleware, note.postNotes);

   // 2. 노트 조회 API (+ 검색)
   app.get('/app/notes',jwtMiddleware,note.getNotes);

   // 3. 특정 노트 조회 API
   app.get('/app/note', jwtMiddleware,note.getNoteById);

   // 4. title 수정 API
   app.patch('/app/note', jwtMiddleware,note.patchNote);

   // 5. 표지 수정 API
   //app.patch('/app/note/img', jwtMiddleware,note.patchImg);

   // 6. 노트 삭제 API
   app.patch('/app/note/:noteIdx/status', jwtMiddleware,note.deleteNote);
};