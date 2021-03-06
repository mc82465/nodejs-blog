const { login } = require('../controller/user');
const { SuccessModel,ErrorModel } = require('../model/resModel');

//获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    return d.toGMTString();
}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
    const url = req.url
    const path = url.split('?')[0];
    // 登录
    if (method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body;
        //const { username, password } = req.query;     //get测试
        const result = login(username,password)
        return result.then( data => {
            if(data.username){

                req.session.username = data.username;
                req.session.realname = data.realname;

                //操作cookie  用了session后，写在app.js中
                //res.setHeader('Set-Cookie',`username=${data.username}; path=/; httpOnly; expires=${getCookieExpires}`)  //path=/  设置cookie适用根目录;httpOnly只允许服务端修改

                // console.log('req session:')
                // console.log(req.session)

                return new SuccessModel()
            }else{
                return new ErrorModel('登录失败')
            }
        })

        // if(result){
        //     return new SuccessModel()
        // }else{
        //     return new ErrorModel('登录失败')
        // }
    }

        // 登录验证的测试
    /* if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    } */

}

module.exports = handleUserRouter
