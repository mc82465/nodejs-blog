const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const {access} = require('./src/utils/log')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}

// // session 数据
const SESSION_DATA = {}

//处理post data
const getPostData = (req)=>{
    const promise = new Promise((resolve,reject)=>{
        if(req.method !== 'POST'){
            resolve({})
            return;
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return;
        }
        let postData ='';
        req.on('data',chunk => {
            postData += chunk.toString();
        })
        req.on('end',() => {
            if (!postData){
                resolve({})
                return;
            }
            resolve(
                JSON.parse(postData)
            ) 
        })
    })
    return promise;
}

const  serverHandle = (req, res) => {

    //记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')
    //path
    const url = req.url
    req.path = url.split('?')[0];
    //query
    req.query = querystring.parse(url.split('?')[1]) 
    
    //解析cookie
    req.cookie = {}; 
    const cookieStr = req.headers.cookie || '';     //k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item =>{
        if(!item){
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })
    //console.log(req.cookie);

    //解析session （获取cookie userId）
    let needSetCookie = false
    let userId = req.cookie.userid
    if(userId){
        if(!SESSION_DATA[userId]){
            SESSION_DATA[userId] = {};
        }
    }else{
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    //处理post data
    // const blogData = handleBlogRouter(req,res)
    // if(blogData){
    //     res.end(
    //         JSON.stringify(blogData)
    //     );
    //     return;
    // }
    getPostData(req).then((postData) =>{
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req,res)
        if(blogResult){
            blogResult.then(blogData =>{
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)    //path=/  设置cookie适用根目录;httpOnly只允许服务端修改
                }
                res.end(
                    JSON.stringify(blogData)
                );
            })
            return;
        }

        // 处理user路由
        // const userData = handleUserRouter(req,res)
        // if(userData){
        //     res.end(
        //         JSON.stringify(userData)
        //     );
        //     return;
        // }
        const userResult = handleUserRouter(req,res);
        if(userResult){
            userResult.then( userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)    //path=/  设置cookie适用根目录;httpOnly只允许服务端修改
                }
                res.end(
                    JSON.stringify(userData)
                );
            })
            return;
        }



        

        // 未命中路由，返回 404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle

// process.env.NODE_ENV
