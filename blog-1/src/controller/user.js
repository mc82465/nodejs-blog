const { exec, escape } = require('../db/mysql')

const login=(username,password) => {

    //escape  转义特殊符号，防止sql注入
    username = escape(username);
    password = escape(password);

    const sql =`
        select username, realname from users where username=${username} and password=${password}
    `
    return exec(sql).then( rows => {
        //console.log(rows)
        return rows[0] || {}
    })
    /* if(username === 'zhangsan' && password === '123'){
        return true;
    }
    return false; */
}

module.exports={
    login
}