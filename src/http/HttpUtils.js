import { resolve, reject, timeout } from "q";
import {message} from 'antd'
export default class HttpUtils {
    static post=(url,data)=>{
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'post',
                headers: {
                    'token': window.sessionStorage.getItem('token')
                },
                body:data,
            }).then((response)=>response.json())
            .then((result)=>{
                if(result.status === 203){
                    HttpUtils.loginOut()
                }else{
                    resolve(result);
                }
            }).catch((error)=>{
                reject(error);
            })
        })
    }

    static postJson=(url,data)=>{
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': window.sessionStorage.getItem('token')
                },
                body:JSON.stringify(data)
            }).then((response)=>response.json())
            .then((result)=>{
                if(result.status === 203){
                    HttpUtils.loginOut()
                }else{
                    resolve(result);
                }
            }).catch((error)=>{
                reject(error);
            })
        })
    }

    static get = (url) =>{
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'get',
                headers: {
                    'token': window.sessionStorage.getItem('token')
                },
            }).then((response)=>response.json())
            .then((result)=>{
                if(result.status === 203){
                    HttpUtils.loginOut()
                }else{
                    resolve(result);
                }
            }).catch((error)=>{
                reject(error);
            })
        })
    }
     static loginOut =()=>{
        message.warn("您已经被登出，请从新登录..");
        window.sessionStorage.setItem('token','');
        window.sessionStorage.setItem('role','');
        window.sessionStorage.setItem('isLogin','0');
        setTimeout(()=>{
            window.location.href="/"
        },1000)
    }
}