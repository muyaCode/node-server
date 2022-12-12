const fs = require('fs');
const path = require('path');
const readline = require('readline');

function createReadStream() {
    const fullPath = createDirPath();
    const fullFileName = path.join(fullPath, 'access.log');
    const readStream = fs.createReadStream(fullFileName);
    return readStream;
}
function createDirPath() {
    const date = new Date();
    const dirName = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDay()}`;
    const fullPath = path.join(__dirname, '../log', dirName);
    // console.log(fullPath);
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath);
    }
    return fullPath;
}
const readStream = createReadStream();
const readObject =  readline.createInterface({
    input: readStream
});
let totalCount = 0;
let chromeCount = 0;
readObject.on('line', (lineData)=>{
    if(!lineData){
        return
    }
    totalCount++;
    if(lineData.indexOf('Chrome') >= 0){
        chromeCount++;
    }
});
readObject.on('close', ()=>{
    console.log(chromeCount / totalCount);
});
