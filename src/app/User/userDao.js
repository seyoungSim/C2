// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT id, name
                FROM employee;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, name
                FROM user
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// kakao 회원 조회
async function selectUserId(connection, name) {
  const selectUserIdQuery = `
                 SELECT id, email, name
                 FROM user
                 WHERE name = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, name);
  return userRow;
}

// kakao 유저 생성
async function insertUserInfo(connection, userId) {
  const insertUserInfoQuery = `
        INSERT INTO user(kakao)
        VALUES (?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    userId
  );

  return insertUserInfoRow[0];
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, name, password
        FROM user
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM user
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, email, id) {
  const updateUserQuery = `
  UPDATE user
  SET email = ?
  WHERE name = ? ;`;
  const updateUserRow = await connection.query(updateUserQuery, [email, id]);
  return updateUserRow[0];
}

// kakao 아이디 조회
async function kakaoIdInfo(connection,id) {
    const searchKakaoIdQuery = `
    SELECT id, name
    from user
    WHERE kakao = ?;`;
    const searchKakaoIdRow = await connection.query(searchKakaoIdQuery,id);
    console.log(searchKakaoIdRow[0]);

    return searchKakaoIdRow[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  kakaoIdInfo,
};
