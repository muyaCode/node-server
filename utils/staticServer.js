const path = require('path');
const fs = require('fs');
const mime = require('./mime');
/**
 * 读取静态资源
 * @param req  请求对象
 * @param res  响应对象
 * @param rootPath 静态资源所在的目录
 */
function readFile(req, res, rootPath) {
    // 1.获取静态资源地址
    // http://127.0.0.1:3000/login.html?name=lnj&pwd=123456;
    let fileName = req.url.split('?')[0];
    let filePath = path.join(rootPath, fileName);
    // 2.判断静态资源是否存在
    let isExists = fs.existsSync(filePath);
    if(!isExists){
        return
    }
    // 3.获取静态资源的后缀名
    let fileExt = path.extname(filePath);
    // 4.根据文件的后缀获取对应的类型
    let type = mime[fileExt];
    // 5.对文本类型进行特殊处理
    if(type.startsWith('text')){
        type += '; charset=utf-8;'
    }
    // 5.告诉客户端返回数据的类型
    res.writeHead(200, {
        'Content-Type': type
    });
    // 6.加载静态资源并返回静态资源
    return new Promise((resolve, reject)=>{
        fs.readFile(filePath, (err, content)=>{
            if(err){
                res.end('Server Error');
                reject(err);
            }else{
                res.end(content);
                resolve();
            }
        });
    });
}
module.exports = {
    readFile
}