import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
class orderInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }
    render(){
        return(
            <div style={{backgroundColor:"#fff"}}>
                <div className='example-input'>
                    订单中心
                </div>
            </div>
        )
    }
}
export default Form.create()(orderInfoView)