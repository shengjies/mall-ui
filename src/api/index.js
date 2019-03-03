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
    FB_FIND_LIST_ALL:API_ADDRESS+"/fb/list/all",//查询登录用户的所有FB

    /** 域名管理 */
    DOMAIN_FIND_ALL:API_ADDRESS+"/domain/findAll",//查询所有域名
    DOMAIN_FIND_LIST_ALL:API_ADDRESS+"/domain/list/all",//查询对应用户分配的域名
    DOMAIN_ADD:API_ADDRESS+"/domain/add",//添加域名
    DOMAIN_EDIT:API_ADDRESS+"/domain/edit",//修改域名
    DOMAIN_FIND:API_ADDRESS+"/domain/find",//域名分页查询

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
    PRODUCT_COPY:API_ADDRESS+'/product/copy',//复制产品
    /**
     * 链接管理
     */
    URL_ADD:API_ADDRESS+"/urls/add",//添加链接
    URL_EDIT:API_ADDRESS+"/urls/edit",//修改链接
    URL_FIND:API_ADDRESS+"/urls/find",//分页查询

    /**
     * 模板操作
     */
    TEM_ADD:API_ADDRESS+"/tem/add",//添加模板
    TEM_EDIT:API_ADDRESS+"/tem/edit",//修改模板
    TEM_FIND:API_ADDRESS+"/tem/find",//模板分页查询
    TEM_FIND_LIST_ALL:API_ADDRESS+"/tem/list/all",//查询所有模板
    /**
     * 赠品操作
     */
    GIFT_ADD:API_ADDRESS+"/gift/add",//添加赠品
    GIFT_EDIT:API_ADDRESS+"/gift/edit",//编辑赠品
    GIFT_FIND:API_ADDRESS+"/gift/find",//分页查询
    GIFT_FIND_BY_ID:API_ADDRESS+"/gift/find/",//按编号查询赠品信息
    GIFT_LIST_ALL:API_ADDRESS+"/gift/list/all",//查询所有赠品信息

    /**
     * 评论操作
     */
    COMMENT_ADD:API_ADDRESS+"/comment/add",//添加评论
    COMMENT_EDIT:API_ADDRESS+"/comment/edit",//评论编辑
    COMMENT_FIND:API_ADDRESS+"/comment/find",//分页查询评论
    
}

export default API;