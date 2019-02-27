import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const {TextArea} =Input
class FBInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findFBInfo(0,50);
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50,
          fbData:[],
          loading:false,
          fb_name:'',
          isAdd:true,
        fbVisible:false,
        fbTitle:''
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
        this.findFBInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 分页查询FB 信息
     */
    findFBInfo=(page,size)=>{
        this.setState({loading:true});
        const data = new FormData();
        data.append("fbname",this.state.fb_name);
        data.append("page",page);
        data.append("size",size);
        HttpUtils.post(API.FB_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({fbData:result.data.content,total:result.data.count});
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
                var url = this.state.isAdd?API.FB_ADD:API.FB_EDIT;
                HttpUtils.postJson(url,values)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({fbVisible:false,page:1,pageSize:50});
                        this.findFBInfo(0,50);
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
                width:'15%'
            },
            {
                title: 'Facebookid',
                dataIndex: 'fb_name',
                key: 'fb_name',
                width:'25%'
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                key: 'remark',
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
                                this.setState({fbTitle:'编辑信息',fbVisible:true,isAdd:false})
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "fb_name": record.fb_name,
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
                            <Input placeholder="FacebookId" onChange={(e)=>{
                                this.setState({fb_name:e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50});
                            this.findFBInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                            this.props.form.resetFields();
                            this.setState({fbTitle:'添加信息',fbVisible:true,isAdd:true})
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.fbData} scroll={{ x: 700, y: 720 }} row
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
                title={this.state.fbTitle}
                visible={this.state.fbVisible}
                onOk={this.handleSubmit}
                onCancel={()=>{this.setState({fbVisible:false})}}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="Facebookid:"
                        >
                            {getFieldDecorator('fb_name', {
                                rules: [{ required: true, message: 'Facebookid不能为空..' }],
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

export default Form.create()(FBInfoView)