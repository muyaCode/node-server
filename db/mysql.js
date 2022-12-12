// 1.导入mysql驱动
const mysql      = require('db/mysql');
const { MYSQL_CONFIG } = require('../config/db');
// 2.创建连接对象
const connection = mysql.createConnection(MYSQL_CONFIG);
// 3.连接MySQL数据库
connection.connect();

// 4.操作MySQL数据库方法
const exc = (sql) =>{
    return new Promise((resolve, reject)=>{
        connection.query(sql, function (error, results) {
            if (error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
};

module.exports = {
    exc,
    // 把登录用户名的特殊符号转义成普通字符：预防SQL注入
    escape: mysql.escape
};
