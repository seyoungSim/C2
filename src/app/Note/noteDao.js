// 노트 생성
// title과 유저 id 받아 오기
async function insertNoteInfo(connection, insertNoteInfoParams) {
  const insertNoteInfoQuery = `
        INSERT INTO note(title,img,user_id)
        VALUES (?,?,?);
    `;
  const insertNoteInfoRow = await connection.query(
    insertNoteInfoQuery,
    insertNoteInfoParams
  );

  return insertNoteInfoRow;
}


// 모든 노트 조회(제목, 생성일, 표지)
async function selectNote(connection,userId) {

  const selectNoteListQuery = `
                SELECT title, DATE_FORMAT(created_at,'%Y-%m-%d') as created_at, img, id
                FROM note
                WHERE user_id = ? and status = 'N';`;

  const [noteRows] = await connection.query(selectNoteListQuery,userId);
 //console.log(noteRows);
  //console.log('1');
  return noteRows;
}

// 특정 노트 조회(노트 번호로)
async function selectNoteId(connection,noteId) {

  const selectNoteListQuery = `
                SELECT title, created_at, img
                FROM note
                WHERE id = ? and status='N';`;

 const [noteRows] = await connection.query(selectNoteListQuery,noteId);
 console.log(noteRows);
  console.log('1');
  return noteRows;
}

// 노트 제목 수정
async function updateNoteInfo(connection,title,img,id) {
  const updateNoteQuery = `
  UPDATE note
  SET title = ?,img = ?
  WHERE id = ?;`;
  const updateNoteRow = await connection.query(updateNoteQuery, [title,img, id]);
  return updateNoteRow[0];
}

// 노트 표지 수정
async function updateNoteImg(connection, title, img) {
  const updateNoteQuery = `
  UPDATE note
  SET img = ?
  WHERE title = ?;`;
  const updateNoteRow = await connection.query(updateNoteQuery, [img, title]);
  return updateNoteRow[0];
}

// 노트 삭제
async function deleteNote(connection, id) {

  const deleteNoteQuery = `
  UPDATE note
  SET status = 'Y'
  WHERE id = ? ;`;
  const deleteNoteRow = await connection.query(deleteNoteQuery, id);
// note안의 post 삭제
/*
  const selectIdQuery = `SELECT id FROM note where title = ? ;`;

  id = await connection.query(selectIdQuery, title);
  console.log(id)
  id = parseInt(id)
  console.log(id)

  const deletePostQuery = `
  UPDATE post
  SET status = 'Y'
  WHERE note_id = ? ;`;
  const deletePostRow = await connection.query(deletePostQuery, id);
*/
    console.log("deleteNOte");
  return deleteNoteRow[0];
}


// 특정 노트 조회(노트 번호로)
async function selectNoteById(connection,id) {

  const selectNoteListQuery = `
SELECT id
FROM note
WHERE id = ?
  and status = 'N';`;

  const [noteRows] = await connection.query(selectNoteListQuery,id);

  return noteRows;
}

// 사용자 권한 확인
async function selectUserById(connection,noteIdx) {

    const selectUserByIdQuery = `
    SELECT user_Id
    FROM note
    WHERE id = ?;`;

    const searchNoteUser = await connection.query(selectUserByIdQuery,noteIdx);

    return searchNoteUser[0];
}

module.exports = {
  selectNote,
  selectNoteId,
  deleteNote,
  updateNoteImg,
  insertNoteInfo,
  updateNoteInfo,
  selectNoteById,
  selectUserById,
};
