const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'popi.cgiwbgndhthd.ap-northeast-3.rds.amazonaws.com',
    user: 'C2',
    port: '3306',
    password: 'fighting',
    database: 'C2'
});

module.exports = {
    pool: pool
};