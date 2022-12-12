// 1.导入Redis模块
const redis = require("redis");
const {REDIS_CONFIG} = require('../config/db');

// 2.建立Redis连接
const client = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);
client.on("error", function(error) {
    console.error(error);
});

// 3.封装保存数据和获取数据的方法
function redisSet(key, value){
    if(typeof value === 'object'){
        value = JSON.stringify(value);
    }
    client.set(key, value, redis.print);
}
function redisGet(key){
    return new Promise((resolve, reject)=>{
        client.get(key, (err, value)=>{
            if(err){
                reject(err);
            }
            try {
                resolve(JSON.parse(value));
            }catch (e) {
                resolve(value);
            }
        });
    });
}

module.exports = {
    redisSet,
    redisGet
}
