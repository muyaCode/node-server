/*服务端业务逻辑的核心文件*/
/*处理各种请求*/
const queryString = require('querystring');
const goodsRouterHandle = require('./router/goods');
const userRouterHandle = require('./router/user');
const staticServer = require('./utils/staticServer');
const path = require('path');
const rootPath = path.join(__dirname, 'public');
const {redisGet} = require('./db/redis');
const writeLog = require('./utils/log');

require('./db/sync');
/*
1.什么是日志?
- 日志在企业开发中有着不可或缺的作用，
  它可以用以记录用户操作、系统运行状态和错误信息
  日志记录的好坏直接关系到系统出现问题时定位的速度
- 如果没有日志, 那么就相当于人没有眼睛
  日志可以很好的帮助我们分析用户行为
  日志可以很好的帮助我们排查项目上线之后的一些错误
  ... ...

2.常见日志有哪些?
2.1访问日志
2.2错误日志
2.3安全日志
... ...

3.如何记录日志?
后端开发中有很多现成的框架可以帮助我们很好的记录日志
但今天我们要了解的是如何自己手动实现日志的记录
* */
/**
 * 生成Cookie过期时间
 * @returns {*}
 */
const getCookieExpires = () =>{
    let date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    return date.toGMTString();
}
/**
 * 准备各种请求参数
 * @param req 请求对象
 * @param res 响应对象
 * @returns {Promise<any>}
 */
const initParams = (req, res) =>{
    // 准备 请求方式 / 请求路径 / 请求参数
    // 1.处理请求方式
    req.method = req.method.toLowerCase();
    // 2.处理请求路径
    req.path = req.url.split('?')[0];
    // 5.处理请求参数
    return new Promise((resolve, reject)=>{
        if(req.method === 'get'){
            let params = req.url.split('?')[1];
            req.query = queryString.parse(params);
            resolve();
        }else if(req.method === 'post'){
            let params = '';
            req.on('data', (chunk)=>{
                params += chunk;
            });
            req.on('end', ()=>{
                console.log(params);
                req.body = queryString.parse(params);
                resolve();
            });
        }
    });
}
/**
 * 初始化Cookie和Session
 * @param req 请求对象
 * @param res 响应对象
 */
const initCookieSession =async (req, res) =>{
    // 1.处理Cookie
    req.cookie = {};
    if(req.headers.cookie){
        req.headers.cookie.split(';').forEach((item)=>{
            let keyValue = item.split('=');
            req.cookie[keyValue[0]] = keyValue[1];
        });
    }
    // 2.获取用户的唯一标识
    req.userId = req.cookie.userId;
    if(!req.userId){
        req.userId = `${Date.now()}_${Math.random()}_it666`;
        // 给当前用户分配容器
        // SESSION_CONTAINER[req.userId] = {};
        req.session = {};
        res.setHeader('Set-Cookie',`userId=${req.userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
    }
    if(!req.session){
        req.session = await redisGet(req.userId) || {};
    }
    console.log(req.session);
}
/**
 * 封装返回数据方法
 * @param res  响应对象
 * @param data 返回的数据
 */
const setEnd = (res, data) =>{
    res.writeHead(200, {
        'Content-Type':'application/json; charset=utf-8;'
    });
    res.end(JSON.stringify(data));
}
// 处理各种请求
const serverHandle = async (req, res)=>{
    writeLog(`${req.method}--${req.url}--${req.headers['user-agent']}`)
    // 0.准备cookie和session
    await initCookieSession(req, res);
    // 1.返回静态网页
    await staticServer.readFile(req, res, rootPath);
    // 2.处理API请求
    res.setEnd = setEnd;
    // 1.准备各种请求参数
    initParams(req, res).then( async ()=>{
        // 2.处理各种路由
        // 2.1处理商品相关路由
        let goodsData = goodsRouterHandle(req, res);
        if(goodsData){
            res.setEnd(res, goodsData);
            return
        }
        // 2.2处理用户相关路由
        let userData = await userRouterHandle(req, res);
        if(userData){
            res.setEnd(res, userData);
            return
        }
        // 2.3没有匹配到任何路由
        res.writeHead(404, {
            'Content-Type':'text/plain; charset=utf-8;'
        });
        res.end('404 Not Found');
    });
};
module.exports = serverHandle;