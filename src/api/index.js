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
    DOMAIN_FIND_LIST_ALL:API_ADDRESS+"/domain/list/all",//查询对应用户分配的域名

    /** 图片操作 */
    IMAGE_UPLOAD:API_ADDRESS+"/upload",
    /**
     * 产品
     */
    PRODUCT_ADD:API_ADDRESS+"/product/add",//产品添加
    PRODUCT_EDIT:API_ADDRESS+"/product/edit",//产品修改
    PRODUCT_FIND:API_ADDRESS+"/product/find",//产品分页查询
    PRODUCT_FIND_BY_ID:API_ADDRESS+"/product/find/",//按照编号查询产品信息
    PRODUCT_FIND_LIST_ALL:API_ADDRESS+'/product/list/all',//查询所有产品用于下拉列表
    /**
     * 链接管理
     */
    URL_ADD:API_ADDRESS+"/urls/add",//添加链接
    URL_EDIT:API_ADDRESS+"/urls/edit",//修改链接
    URL_FIND:API_ADDRESS+"/urls/find",//分页查询
}

export default API;