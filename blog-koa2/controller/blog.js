
const {exec} = require('../db/mysql')

const xss = require('xss');

const getList= async (author,keyword) => {
    //假数据,格式
    /* return [
        {
            id:1,
            title:'标题A',
            content:'内容A',
            createTime:'1617027338234',
            author:'张三'
        },
        {
            id:2,
            title:'标题B',
            content:'内容B12',
            createTime:'1617027409682',
            author:'李四'
        }
    ] */

    let sql = `select * from blogs where 1=1 `
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){ 
        sql += `and title like '%${keyword}&' `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
 
}

const getDetail= async (id) => {
    //假数据,格式
    /* return [
        {
            id:1,
            title:'标题A',
            content:'内容A',
            createTime:'1617027338234',
            author:'张三'
        },
    ] */

    const sql = `select * from blogs where id='${id}' `;
    const rows = await exec(sql);
    return rows[0];
}

const newBlog = async (blogData={}) =>{
    //博客对象包含title,content...
    const title = xss(blogData.title);          //防止xss攻击，主要script脚本<,>号，要转义特殊符号
    const content = xss(blogData.content);
    const author = blogData.author;
    const createTime = Date.now();

    const sql = ` 
        insert into blogs (title,content,createtime,author) values( '${title}','${content}',${createTime},'${author}')
    `;

    const insertData = await exec(sql);
    return {
        id: insertData.insertId
    };

}

const updateBlog = async (id,blogData={}) =>{
    const title = xss(blogData.title);
    const content = xss(blogData.content);

    const sql = `
        update blogs set title = '${title}', content = '${content}' where id=${id}
    `;
    const updateData = await exec(sql);
    if(updateData.affectedRows > 0){
        return true;
    } 
    return false;
    //return   true;
}

const deleteBlog = async (id,author) =>{

    const sql =`delete from blogs where id=${id} and author=${author}`
    const delData = await exec(sql);
    if (delData.affectedRows > 0) {
        return true
    }
    return false;
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}