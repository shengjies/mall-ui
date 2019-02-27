import React,{Component} from 'react'
import { Form, Input, Icon, Button,message } from 'antd';
import "antd/dist/antd.css";
import "./index.css"
import NProgress from 'nprogress'
import HttpUtils from '../http/HttpUtils';
import API from '../api';
const FormItem = Form.Item;

 class LoginView extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        // document.addEventListener()
        NProgress.done();
    }
    toLogin=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = new FormData();
                formData.append("username",values.username);
                formData.append("password",values.password);
                HttpUtils.post(API.USER_LOGIN,formData)
                .then((res)=>{
                    if(res.status === 200){
                        window.sessionStorage.setItem('token',res.data.token);
                        window.sessionStorage.setItem('role',res.data.role);
                        window.sessionStorage.setItem('isLogin','1');
                        // this.props.history.push(res.data.role === 'role_admin'?'/home/fb_user':'home/virtualmachine');
                        this.props.history.push('/home/product/manage');
                    }else if(res.status === 401){
                        message.warn("用户名或者密码错误",3);
                    }
                }).catch((error)=>{
                    message.error("操作异常",3);
                })
            }
          });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{width:'100%',height:'100%',backgroundRepeat:'no-repeat fixed',backgroundSize:'100% 100%',backgroundImage: "url(" + require("./img/login2.jpg") + ")"}}>
                <div style={{width:'100%',height:'100%',background: "rgba(0,0,0,.6)"}}>
                    <div className='box'>
                        <div className='login'>
                            <Form onSubmit={this.toLogin}>
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入登录登录密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="登录密码" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}> 登录 </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(LoginView)