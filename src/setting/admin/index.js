import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
export default class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findUserInfo(0,50);
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          username:'',
          total:0,
          page:1,
          pageSize:50,
          userData:[],
          loading:false
      }
    }
    /**
     * 产品表格改变
     */
    productInfoTableChange=()=>{

    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 查询用户信息
     */
    findUserInfo=(page,pageSize)=>{
        this.setState({loading:true})
        const formData = new FormData();
        formData.append("username",this.state.username);
        formData.append("page",page);
        formData.append("size",pageSize);
        HttpUtils.post(API.USER_FIND,formData)
        .then((result)=>{
            if(result.status === 200){
                this.setState({userData:result.data.content,total:result.data.count})
            }else{
                message.error('操作异常',3);
            }
            this.setState({loading:false});
        }).catch((error)=>{
            message.error('操作异常',3);
            this.setState({loading:false})
        })
    }
    render(){
        const columns=[
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width:100
            },
            {
                title: '登录名称',
                dataIndex: 'username',
                key: 'username',
                width:'15%'
            },
            {
                title: '域名 & Facebbokid分配',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '创建时间',
                dataIndex: 'c_date',
                key: 'c_date',
                width:'18%'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:100,
                render:(text,record)=>{
                    return(
                        <span>
                            <a href="javascript:void(0);" onClick={()=>{}}>编辑</a>
                        </span>
                    )
                }
            } 
        ]
        return(
            <div style={{backgroundColor:"#fff"}}>
                <div className='example-input'>
                    <Row>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="登录名称" onChange={(e)=>{
                                    this.setState({username:e.target.value});
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({
                                page:1,
                                pageSize:50
                            })
                            this.findUserInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                                
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.userData} scroll={{ x: 700, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.productInfoTableChange} />
                </div>
            </div>
        )
    }
}