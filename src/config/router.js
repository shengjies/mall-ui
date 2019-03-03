import Loadable from 'react-loadable'
const LoadableAdmin = Loadable({
    loader: () => import('../setting/admin'),
    loading: ()=>(''),
})
const LoadableRole = Loadable({
    loader: () => import('../setting/role'),
    loading: ()=>(''),
})
const LoadableMenu = Loadable({
    loader: () => import('../setting/menu'),
    loading: ()=>(''),
})
const LoadableEdit = Loadable({
    loader: () => import('../setting/test'),
    loading: ()=>(''),
})
const LoadableMain = Loadable({
    loader: () => import('../main'),
    loading: ()=>(''),
})
const ProductManegeoView = Loadable({
    loader: () => import('../product/manage'),
    loading: ()=>(''),
})
const GiftInfoView = Loadable({
    loader: () => import('../product/gift'),
    loading: ()=>(''),
})
const GiftInfoEditView = Loadable({
    loader: () => import('../product/giftinfo'),
    loading: ()=>(''),
})
const UrlInfoView = Loadable({
    loader: () => import('../product/urls'),
    loading: ()=>(''),
})
const ProductInfoView = Loadable({
    loader: () => import('../product/info'),
    loading: ()=>(''),
})
const orderInfoView = Loadable({
    loader: () => import('../order/info'),
    loading: ()=>(''),
})
const CommentInfoView =Loadable({
    loader: () => import('../product/comment'),
    loading: ()=>(''),
})
const TemplateView = Loadable({
    loader: () => import('../product/template'),
    loading: ()=>(''),
})
const ROUTERS =[
    // {
    //     title:'首页',
    //     icon:'appstore',
    //     key:'sub1',
    //     auths:['role_admin'],
    //     key:'/home',
    //     to:'/home',
    //     auths:['role_admin'],
    //     component:LoadableMain,
    //     show:true,
    // },
    {
        title:'产品管理',
        icon:'appstore',
        key:'sub1',
        auths:['role_admin'],
        show:true,
        childrens:[
            {
                title:'产品信息',
                icon:'exception',
                key:'/home/product/manage',
                to:'/home/product/manage',
                auths:['role_admin'],
                component:ProductManegeoView,
                show:true,
            },
            {
                title:'赠品信息',
                icon:'exception',
                key:'/home/product/gift',
                to:'/home/product/gift',
                auths:['role_admin'],
                component:GiftInfoView,
                show:true,
            },
            {
                title:'链接管理',
                icon:'paper-clip',
                key:'/home/product/urls',
                to:'/home/product/urls',
                auths:['role_admin'],
                component:UrlInfoView,
                show:true,
            },
            {
                title:'模板管理',
                icon:'file-text',
                key:'/home/product/tem',
                to:'/home/product/tem',
                auths:['role_admin'],
                component:TemplateView,
                show:true,
            },
            {
                title:'产品操作',
                icon:'form',
                key:'/home/product/info',
                to:'/home/product/info',
                auths:['role_admin'],
                component:ProductInfoView,
                show:false,
            },
            {
                title:'赠品操作',
                icon:'form',
                key:'/home/product/zpinfo',
                to:'/home/product/zpinfo',
                auths:['role_admin'],
                component:GiftInfoEditView,
                show:false,
            },
            {
                title:'产品评论',
                icon:'form',
                key:'/home/product/comment',
                to:'/home/product/comment',
                auths:['role_admin'],
                component:CommentInfoView,
                show:false,
            },
        ]
    },
    {
        title:'订单中心',
        icon:'appstore',
        key:'sub2',
        auths:['role_admin'],
        show:true,
        childrens:[
            {
                title:'订单信息',
                icon:'file-search',
                key:'/home/order/info',
                to:'/home/order/info',
                auths:['role_admin'],
                component:orderInfoView,
                show:true,
            }
        ]
    },
    {
        title:'报表管理',
        icon:'appstore',
        key:'sub3',
        auths:['role_admin'],
        show:false,
        childrens:[
            {
                title:'产品分析报表',
                icon:'file-search',
                key:'/home/order/info',
                to:'/home/order/info',
                auths:['role_admin'],
                component:ProductManegeoView,
                show:true,
            }
        ]
    },
    {
        title:'物态管理',
        icon:'appstore',
        key:'sub4',
        auths:['role_admin'],
        show:false,
        childrens:[
            {
                title:'物态上传',
                icon:'tool',
                key:'/home/wt/info',
                to:'/home/wt/info',
                auths:['role_admin'],
                component:ProductManegeoView,
                show:true,
            }
        ]
    },
    {
        title:'后台设置',
        icon:'setting',
        key:'sub5',
        auths:['role_admin'],
        show:true,
        childrens:[
            {
                title:'用户信息',
                icon:'user',
                key:'/home/admin',
                to:'/home/admin',
                auths:['role_admin'],
                component:LoadableAdmin,
                show:true,
            },
            {
                title:'FBID管理',
                icon:'code',
                key:'/home/role',
                to:'/home/role',
                auths:['role_admin'],
                component:LoadableRole,
                show:true,
            },
            {
                title:'域名管理',
                icon:'hdd',
                key:'/home/menu',
                to:'/home/menu',
                auths:['role_admin'],
                component:LoadableMenu,
                show:true,
             }
             ,
            {
                title:'测试',
                icon:'file-text',
                key:'/home/edit',
                to:'/home/edit',
                auths:['role_admin'],
                component:LoadableEdit,
                show:false,
            }
        ]
    }
];
export default ROUTERS;