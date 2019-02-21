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
    FB_FIND_ALL:API_ADDRESS+"/fb/findAll",//查询所有FB

    /** 域名管理 */
    DOMAIN_FIND_ALL:API_ADDRESS+"/domain/findAll",//查询所有域名

    /** 图片操作 */
    IMAGE_UPLOAD:API_ADDRESS+"/upload",
    /**
     * 产品
     */
    PRODUCT_ADD:API_ADDRESS+"/product/add",//产品添加
    PRODUCT_FIND:API_ADDRESS+"/product/find",//产品分页查询
}

export default API;