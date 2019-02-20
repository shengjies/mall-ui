// var API_ADDRESS='';
var API_ADDRESS='http://localhost:8080';
var API={
    /** 用户信息 */
    USER_FIND:API_ADDRESS+"/user/find",//分页查询用户信息
    USER_ADD:API_ADDRESS+"/user/add",//添加用户信息
    USER_EDIT:API_ADDRESS+"/user/edit",//修改用户信息
    USER_LOGIN:API_ADDRESS+"/user/login",//用户登录

    /** FB管理 */
    FB_FIND:API_ADDRESS+"/fb/find",//分页查询FB信息
    FB_ADD:API_ADDRESS+"/fb/add",//添加FB信息
    FB_EDIT:API_ADDRESS+"/fb/edit",//编辑FB信息
}

export default API;