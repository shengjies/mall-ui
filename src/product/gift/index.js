import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
export default class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50
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
    render(){
        const columns=[
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width:100,
            },
            {
                title: '赠品主图',
                dataIndex: 'id',
                key: 'id',
                width:'15%'
            },
            {
                title: '赠品名称',
                dataIndex: 'id',
                key: 'id',
                width:'15%'
            },
            {
                title: '采购链接',
                dataIndex: 'id',
                key: 'id',
                width:100,
            },
            {
                title: '单价',
                dataIndex: 'id',
                key: 'id',
                width:100,
            },
            {
                title: '备注信息',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '创建者',
                dataIndex: 'id',
                key: 'id',
                width:'10%'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:100,
                render:(text,record)=>{
                    return(
                        <span>
                            <a href="javascript:void(0);" onClick={()=>{}}>查看</a>
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
                            <Input placeholder="赠品编号" onChange={(e)=>{
                                
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="赠品名称" onChange={(e)=>{
                                
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="创建者" onChange={(e)=>{
                                    
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                                
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.vmData} scroll={{ x: 700, y: 720 }} row
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