import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const { TextArea } = Input;
class TemplateView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findTemInfo(0,50);
        NProgress.done();
    }
    constructor(props){
        super(props)
        this.state={
            t_name:'',//模板名称
            page:1,
            pageSize:50,
            loading:false,
            temData:[],
            isAdd:true,
            total:0,
            temVisible:false,
            temTitle:''
        }
    }
    /**
     * 表格改变
     */
    infoTableChange=(pagination, filters, sorter)=>{
        this.setState({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
        this.findTemInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    findTemInfo=(page,pageSize)=>{
        this.setState({loading:true});
        const data = new FormData();
        data.append("page",page);
        data.append("size",pageSize);
        data.append("t_name",this.state.t_name);
        var url = this.state.isAdd?API.TEM_ADD:API.TEM_EDIT;
        HttpUtils.post(API.TEM_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({temData:result.data.content,total:result.data.count})
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false})
        }).catch((error)=>{
            message.error("操作异常",3);
            this.setState({loading:false})
        })
    }
    /**
     * 表单提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                var url = this.state.isAdd?API.TEM_ADD:API.TEM_EDIT;
              HttpUtils.postJson(url,values)
              .then((result)=>{
                  if(result.status === 200){
                    message.success("操作成功",3);
                    this.setState({page:1,pageSize:50,temVisible:false})
                    this.findTemInfo(0,50);
                  }else{
                    message.error("操作异常",3);
                  }
              }).catch((error)=>{
                  message.error("操作异常",3);
              })
            }
        })
    }
    render(){
        const columns=[
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width:80
            },
            {
                title: '名称',
                dataIndex: 't_name',
                key: 't_name',
                width:'15%'
            },
            {
                title: '主页面',
                dataIndex: 't_value',
                key: 't_value',
                width:'15%'
            },
            {
                title: '订单页面',
                dataIndex: 't_order',
                key: 't_order',
                width:100
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '创建时间',
                dataIndex: 'c_date',
                key: 'c_date',
                width:'15%'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:80,
                render:(text,record)=>{
                    return(
                        <span>
                            <a href="javascript:void(0);" onClick={()=>{
                               
                                this.setState({
                                    isAdd:false,
                                    temVisible:true,
                                    temVisible:'编辑信息'
                                })
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "t_name": record.t_name,
                                    't_value':record.t_value,
                                    't_order':record.t_order,
                                    "remark":record.remark
                                });
                            }}>编辑</a>
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
                            <Input placeholder="模板名称" onChange={(e)=>{
                                this.setState({t_name:e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({
                                page:1,
                                pageSize:50
                            })
                            this.findTemInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                            this.props.form.resetFields();
                            this.setState({temTitle:'添加信息',temVisible:true,isAdd:true})
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.temData} scroll={{ x: 800, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.infoTableChange} />
                </div>
                <Modal
                title={this.state.temTitle}
                maskClosable={false}
                visible={this.state.temVisible}
                onOk={this.handleSubmit}
                onCancel={()=>{this.setState({temVisible:false})}}
                >
                     <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="模板名称:"
                        >
                            {getFieldDecorator('t_name', {
                                rules: [{ required: true, message: '模板名称不能为空..' }],
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="主页面:"
                        >
                            {getFieldDecorator('t_value', {
                                rules: [{ required: true, message: '主页面不能为空..' }],
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="订单页面:"
                        >
                            {getFieldDecorator('t_order')(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="备注信息:"
                        >
                            {getFieldDecorator('remark')(
                                <TextArea rows={5}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(TemplateView);