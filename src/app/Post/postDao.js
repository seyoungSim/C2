// 노트 생성
// title과 유저 id 받아 오기
async function insertPostInfo(connection, insertPostInfoParams) {
console.log("여기까지")
  const insertPostInfoQuery = `
        INSERT INTO post(title,subtitle,content,img,note_id)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertPostInfoRow = await connection.query(
    insertPostInfoQuery,
    insertPostInfoParams
  );

  return insertPostInfoRow;
}


// 특정 노트 글 조회(내용,생성일,노트 번호)
async function selectPost(connection,noteIdx) {

  const selectPostListQuery = `
                SELECT DATE_FORMAT(created_at,'%Y-%m-%d') as created_at, title,subtitle,content,img,id,note_id,mood
                FROM post
                WHERE note_id = ? and status = 'N';`;

  const [postRows] = await connection.query(selectPostListQuery,noteIdx);
  console.log(postRows);

  return postRows;
}

// 특정 노트 조회(사용자 별)
async function selectNoteByUser(connection,userId) {

    const selectNoteListQuery = `
        SELECT id
        FROM note
        WHERE user_id = ? and status = 'N';`;

    const [noteRows] = await connection.query(selectNoteListQuery,userId);

    //console.log(noteRows);
    return noteRows;
}

// 특정 날짜 글 조회(내용,생성일,노트 번호)
async function selectDate(connection,noteId,createdAt) {

  const selectPostListQuery = `
                SELECT title, subtitle, content,id, DATE_FORMAT(created_at,'%Y-%m-%d') as created_at,mood, note_id
                FROM post
                WHERE DATE_FORMAT(created_at,'%m') = ? and note_id = ? and status = 'N';`;

  const [postRows] = await connection.query(selectPostListQuery,[createdAt,noteId]);
  return postRows;
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
// 글 내용 수정
async function updateContentsInfo(connection,editPostInfoParams) {

  const editPostInfoQuery = `
        UPDATE post
        SET content = ?,
        title = ?,
        subtitle = ?,
        img = ?
        WHERE id = ?;
    `;
  const editPostInfoRow = await connection.query(
    editPostInfoQuery,
    editPostInfoParams
  );

  return editPostInfoRow[0];
}

// 글 삭제
async function deletePost(connection, id) {
  const deletePostQuery = `
  UPDATE post
  SET status = 'Y'
  WHERE id = ? ;`;
  const deletePostRow = await connection.query(deletePostQuery, id);

  return deletePostRow[0];
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
  insertPostInfo,
  selectPost,
  updateContentsInfo,
  deletePost,
  selectDate,
  selectUserById,
  selectNoteById,
  selectNoteByUser
};
