/*服务端配置文件*/
/*在这个文件中提供一个最简单的服务端服务即可*/
const http = require('http');
const serverHandle = require('../app');
const PORT = 3000;
const server = http.createServer();
server.on('request', serverHandle);
server.listen(PORT);