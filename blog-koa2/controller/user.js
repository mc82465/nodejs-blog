const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
    username = escape(username)
    
    // 生成加密密码
    //escape  转义特殊符号，防止sql注入
    password = genPassword(password)
    password = escape(password)

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    // console.log('sql is', sql)
    const row = await exec(sql);
    return rows[0] || {}
}

module.exports = {
    login
}