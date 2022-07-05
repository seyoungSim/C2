async function insertSentInfo(connection, id,sent) {
  const insertSentInfoQuery = `
         UPDATE post
                SET mood = ?
                WHERE id = ?;
    `;
  const insertSentInfoRow = await connection.query(
    insertSentInfoQuery,
    [sent,id]
  );

  return insertSentInfoRow;
}

module.exports = {
  insertSentInfo
};