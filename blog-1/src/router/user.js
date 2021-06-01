const { login } = require('../controller/user');
const { SuccessModel,ErrorModel } = require('../model/resModel');



const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
    const url = req.url
    const path = url.split('?')[0];
    // 登录
    if (method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body;
        const result = login(username,password)

        return result.then( data => {
            if(data.username){

                //操作cookie
                //res.setHeader('Set-Cookie',`username=${data.username};path=/;httpOnly`)  //path=/  设置cookie适用根目录;httpOnly只允许服务端修改


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
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }

}

module.exports = handleUserRouter
