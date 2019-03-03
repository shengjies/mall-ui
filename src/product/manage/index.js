import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
import {Link} from 'react-router-dom'
const confirm = Modal.confirm;
const Option = Select.Option;
class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findProductInfo(0,50);
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50,
          infoData:[],
          loading:false,
          id:0,
          name:'',
          user_id:-1,
          copyid:-1,
          copyVisible:false,
          okLoading:false
      }
    }
    findProductInfo=(page,size)=>{
        this.setState({loading:true})
        const data = new FormData();
        data.append("page",page);
        data.append("size",size);
        data.append("id",this.state.id);
        data.append("name",this.state.name);
        data.append("user_id",this.state.user_id);
        HttpUtils.post(API.PRODUCT_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({infoData:result.data.content,total:result.data.count});
            }else{
                message.error('操作异常',3)
            }
            this.setState({loading:false})
        }).catch((error)=>{
            message.error("操作异常",3);
            this.setState({loading:false})
        })
    }
    /**
     * 产品表格改变
     */
    productInfoTableChange=(pagination, filters, sorter)=>{
        this.setState({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
        this.findProductInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 复制产品
     */
    copyProductInfo =()=>{
        var iten =this;
        confirm({
            title: '提示信息',
            content: '即将复制改产品信息，确认继续...',
            onOk() {
                iten.setState({copyVisible:true})
            },
            onCancel() {
                iten.setState({copyid:-1})
            },
          });
    }
    /**
     * 提交表单
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({okLoading:true});
                const data = new FormData();
                data.append("id",this.state.copyid);
                data.append("country",values.country);
                HttpUtils.post(API.PRODUCT_COPY,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3)
                        this.setState({copyVisible:false,page:1,pageSize:50})
                        this.findProductInfo(0,50);
                    }else{
                        message.error("操作异常",3)
                    }
                    this.setState({okLoading:false})
                }).catch((error)=>{
                    message.error("操作异常",3)
                    this.setState({okLoading:false})
                })
            }
        })
    }
    render(){
        const columns=[
            {
                title: '产品编号',
                dataIndex: 'id',
                key: 'id',
                width:'15%'
            },
            {
                title: '产品主图',
                dataIndex: 'main_image_id',
                key: 'main_image_id',
                width:'15%',
                render:(text,record)=>{
                    if(record.mainImage){
                        return(
                            <img src ={record.mainImage.url} width="100" height="100" />
                        )
                    }else{
                        return("--");
                    }
                }
            },
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                width:'15%'
            },
            {
                title: '采购链接',
                dataIndex: 'purchase_url',
                key: 'purchase_url',
            },
            {
                title: '创建者',
                dataIndex: 'id',
                key: 'id',
                width:'10%',
                render:(text,record)=>{
                    if(record.userEntity){
                        return(record.userEntity.username)
                    }else{
                        return("--");
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:140,
                render:(text,record)=>{
                    return(
                        <span>
                            <Link to={{ pathname: '/home/product/info' , query : { add: false,id:record.id }}}>
                                <a href="javascript:void(0);">查看</a>
                            </Link>
                            <Divider type="vertical"/>
                            <a href="javascript:void(0);" onClick={()=>{
                                this.setState({copyid:record.id})
                                this.copyProductInfo()
                            }}>复制</a>
                            <Divider type="vertical"/>
                            <Link to={{ pathname: '/home/product/comment' , query : { id:record.id }}}>
                                <a href="javascript:void(0);">评论</a>
                            </Link>
                        </span>
                    )
                }
            } 
        ]
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 19 },
            },
          };
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{backgroundColor:"#fff"}}>
                <div className='example-input'>
                    <Row>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="产品编号" onChange={(e)=>{
                                this.setState({id:e === undefined?0:e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="产品名称" onChange={(e)=>{
                                this.setState({name:e === undefined?'':e.target.value})
                            }} />
                        </Col>
                        {/* <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="创建者" onChange={(e)=>{
                                    
                            }} />
                        </Col> */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50});
                            this.findProductInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                         <Link to={{ pathname: '/home/product/info' , query : { add: true,id:-1 }}}><Button type="primary" icon="plus">添加</Button></Link>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.infoData} scroll={{ x: 700, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.productInfoTableChange} />
                </div>
                <Modal
                    title="请选择国家"
                    maskClosable={false}
                    confirmLoading={this.state.okLoading}
                    visible={this.state.copyVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.setState({
                            copyVisible:false
                        })
                    }}
                    >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item
                            {...formItemLayout}
                            label="国家:"
                            >
                            {getFieldDecorator('country', {
                                rules: [{ required: true, message: '国家不能为空..' }],
                            })(
                                <Select allowClear={true} style={{ width: '100%' }}>
                                    <Option value="TW">TW-台湾</Option>
                                    <Option value="MY">MY-马来</Option>
                                    <Option value="TH">TH-泰国</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(ProductInfoView)