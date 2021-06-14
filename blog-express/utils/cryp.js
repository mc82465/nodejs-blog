const crypto = require('crypto');

//密匙
const SECRET_key = 'wJiol_8766#';

//md5 加密
function md5(content){
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex'); 
}

//加密函数
function genPassword(password){
    const  str = `password=${password}$key=${SECRET_key}`
    return md5(str)
}

//console.log(genPassword('123'))     //4e9b456fde78d587981c73228ccf3ce6


module.exports = {
    genPassword
}