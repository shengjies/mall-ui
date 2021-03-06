import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const {TextArea} =Input
class DomainInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findDomainInfo(0,50);
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50,
          domainData:[],
          loading:false,
          domainVisible:false,
          domainTitle:'',
          isAdd:true,
          domain_name:''
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
        this.findDomainInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 表单提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
               var url = this.state.isAdd?API.DOMAIN_ADD:API.DOMAIN_EDIT;
               HttpUtils.postJson(url,values)
               .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({domainVisible:false,page:1,pageSize:50});
                        this.findDomainInfo(0,50);
                    }else{
                        message.error("操作异常",3);
                    }
               }).catch((error)=>{
                   message.error("操作异常",3);
               })
            }
        })
    }
    /**
     * 分页查询
     */
    findDomainInfo=(page,pageSize)=>{
        this.setState({loading:true});
        const data = new FormData();
        data.append("domain_name",this.state.domain_name);
        data.append("page",page);
        data.append("size",pageSize);
        HttpUtils.post(API.DOMAIN_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({domainData:result.data.content,total:result.data.count});
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false})
        }).catch((error)=>{
            message.error("操作异常",3)
            this.setState({loading:false})
        })
    }
    render(){
        const columns=[
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width:'15%'
            },
            {
                title: '域名',
                dataIndex: 'domain_name',
                key: 'domain_name',
                width:'25%'
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                key: 'remark'
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
                            <a href="javascript:void(0);" onClick={()=>{
                                this.setState({domainTitle:'编辑信息',domainVisible:true,isAdd:false})
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "domain_name": record.domain_name,
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
                            <Input placeholder="域名" onChange={(e)=>{
                                    this.setState({domain_name:e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50})
                            this.findDomainInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                                this.props.form.resetFields();
                                this.setState({domainTitle:'添加信息',domainVisible:true,isAdd:true})
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.domainData} scroll={{ x: 700, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.infoTableChange} />
                </div>
                <Modal
                maskClosable={false}
                title={this.state.domainTitle}
                visible={this.state.domainVisible}
                onOk={this.handleSubmit}
                onCancel={()=>{this.setState({domainVisible:false})}}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="域名:"
                        >
                            {getFieldDecorator('domain_name', {
                                rules: [{ required: true, message: '域名不能为空..' }],
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="备注:"
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
export default Form.create()(DomainInfoView);
