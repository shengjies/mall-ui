import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
import {Link} from 'react-router-dom'
export default class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findGiftInfo(0,50);
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50,
          name:'',
          giftData:[],
          loading:false
      }
    }
    /**
     * 产品表格改变
     */
    infoTableChange=(pagination, filters, sorter)=>{
        this.setState({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
        this.findGiftInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 分页查询赠品信息
     */
    findGiftInfo=(page,pageSize)=>{
        this.setState({loading:true});
        const data = new FormData();
        data.append("name",this.state.name);
        data.append("page",page);
        data.append("size",pageSize);
        HttpUtils.post(API.GIFT_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({giftData:result.data.content,total:result.data.count});
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false})
        }).catch((error)=>{
            message.error("操作异常",3);
            this.setState({loading:false})
        })
    }
    render(){
        const columns=[
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width:80,
            },
            {
                title: '赠品主图',
                dataIndex: 'imageEntity',
                key: 'imageEntity',
                width:120,
                render:(text,record)=>{
                    if(record.imageEntity){
                        return(
                            <img src ={record.imageEntity.url} width="100" height="100" />
                        )
                    }else{
                        return("--");
                    }
                }
            },
            {
                title: '赠品名称',
                dataIndex: 'name',
                key: 'name',
                width:'15%'
            },
            {
                title: '采购链接',
                dataIndex: 'cgurl',
                key: 'cgurl',
               
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                width:100,
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                key: 'remark',
                width:180,
            },
            {
                title: '创建者',
                dataIndex: 'userEntity.username',
                key: 'userEntity.username',
                width:100
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:100,
                render:(text,record)=>{
                    return(
                        <span>
                             <Link to={{ pathname: '/home/product/zpinfo' , query : { add: false,id:record.id }}}>
                                <a href="javascript:void(0);">查看</a>
                             </Link>
                        </span>
                    )
                }
            } 
        ]
        return(
            <div style={{backgroundColor:"#fff"}}>
                <div className='example-input'>
                    <Row>
                        {/* <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="赠品编号" onChange={(e)=>{
                                
                            }} />
                        </Col> */}
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="赠品名称" onChange={(e)=>{
                                this.setState({name:e.target.value})
                            }} />
                        </Col>
                        {/* <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="创建者" onChange={(e)=>{
                                    
                            }} />
                        </Col> */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50})
                            this.findGiftInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Link to={{ pathname: '/home/product/zpinfo' , query : { add: true,id:-1 }}}><Button type="primary" icon="plus">添加</Button></Link>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.giftData} scroll={{ x: 1200, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.infoTableChange} />
                </div>
            </div>
        )
    }
}