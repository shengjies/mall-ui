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
                    <Row>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="订单编号" onChange={(e)=>{
                                
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="产品" onChange={(e)=>{
                                this.setState({name:e === undefined?'':e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="客户名称" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="订单状态" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="时间" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="采购状态" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="物流状态" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="手机号码" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="国家" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50});
                            this.findProductInfo(0,50);
                        }}>查询</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default Form.create()(orderInfoView)