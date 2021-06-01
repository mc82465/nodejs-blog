
const {exec} = require('../db/mysql')

const getList= (author,keyword) => {
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
    return exec(sql)
 
}

const getDetail= (id) => {
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
    return exec(sql).then( rows => {
        return rows[0];
    })
 
}

const newBlog = (blogData={}) =>{
    //博客对象包含title,content...
    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createTime = Date.now();

    const sql = ` 
        insert into blogs (title,content,createtime,author) values( '${title}','${content}',${createTime},'${author}')
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })

    /* return{
        id:3,   
    } */
}

const updateBlog = (id,blogData={}) =>{
    const title = blogData.title;
    const content = blogData.content;

    const sql = `
        update blogs set title = '${title}', content = '${content}' where id=${id}
    `
    return exec(sql).then(updateData => {
        if(updateData.affectedRows > 0){
            return true;
        } 
        return false;
    })

    //return   true;
}

const deleteBlog = (id,author) =>{

    const sql =`delete from blogs where id=${id} and author=${author}`
    
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
    
    //return true;
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}