import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Popconfirm,Popover} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
import AuthorUtils from '../../utils/AuthorUtils'
const Option = Select.Option;
const { TextArea } = Input;
class UrlInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findUrlInfo(0,50);
        this.initUser();
        NProgress.done();
    }

    constructor(props){
      super(props)
      this.state={
          total:0,
          page:1,
          pageSize:50,
          urlsData:[],
          loading:false,
          user_id:'',
          product_id:-1,
          code:'',
          isInit:true,
          productData:[],//产品下拉列表
          demainData:[],//域名下拉列表
          urlInfoVisible:false,
          urlInfoTitel:'',
          isAdd:true,
          userData:[],
      }
    }
    /**
     * 分页查询
     */
    findUrlInfo=(page,size)=>{
        this.setState({loading:true})
        const data = new FormData();
        data.append("page",page);
        data.append("size",size);
        data.append("code",this.state.code);
        data.append("user_id",this.state.user_id);
        data.append("product_id",this.state.product_id);
        HttpUtils.post(API.URL_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({urlsData:result.data.content,total:result.data.count});
                if(this.state.isInit){
                    this.findProduct();
                    this.findDomain();
                }
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false,isInit:false})
        }).catch((error)=>{
            this.setState({loading:false,isInit:false})
            message.error("操作异常",3);
        })
    }

    /**
     * 查询产品下拉列表信息
     */
    findProduct=()=>{
        HttpUtils.get(API.PRODUCT_FIND_LIST_ALL)
        .then((result)=>{
            if (result.status === 200) {
                const children = [];
                for (let i = 0; i < result.data.length; i++) {
                    children.push(<Option key={result.data[i].id} value={result.data[i].id}>{result.data[i].name}</Option>);
                }
                this.setState({
                    productData: children
                })
            } else {
                message.error('操作异常', 3);
            }
        }).catch((error)=>{
            message.error("操作异常",3);
        })
    }
    /**
     * 域名下拉列表
     */
    findDomain=()=>{
        HttpUtils.get(API.DOMAIN_FIND_LIST_ALL)
        .then((result)=>{
            if (result.status === 200) {
                const children = [];
                for (let i = 0; i < result.data.length; i++) {
                    children.push(<Option key={result.data[i].domain_name}>{result.data[i].domain_name}</Option>);
                }
                this.setState({
                    demainData: children
                })
            } else {
                message.error('操作异常', 3);
            }
        }).catch((error)=>{
            message.error("操作异常",3);
        })
    }
    /**
     * 产品表格改变
     */
    infoTableChange=(pagination, filters, sorter)=>{
        this.setState({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
        this.findUrlInfo(pagination.current - 1, pagination.pageSize);
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
    handleSubmit =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                var url = this.state.isAdd?API.URL_ADD:API.URL_EDIT;
                HttpUtils.postJson(url,values)
                .then((result)=>{
                    if(result.status === 200){
                        this.setState({urlInfoVisible:false,page:1,pageSize:50});
                        message.success("操作成功",3)
                        this.findUrlInfo(0,50);
                    }else{
                        message.error("操作异常",3)
                    }
                }).catch((error)=>{
                    message.error("操作异常",3)
                })
            }
        })
    }
    getDomain=(formItemLayout,getFieldDecorator)=>{
        if(this.state.isAdd){
            return(
                <Form.Item
                    {...formItemLayout}
                        label="域名:"
                        >
                        {getFieldDecorator('domaim', {
                                rules: [{ required: true, message: '域名不能为空..' }],
                            })(
                                <Select allowClear={true} style={{ width: '100%' }}>
                                     {this.state.demainData}
                                </Select>
                             )}
                 </Form.Item>
            )
        }
       
    }
    /**
       * 初始化用户
       */
      initUser=()=>{
        if(!AuthorUtils.isAuthor("role_user")){
          HttpUtils.get(API.USER_LIST_ALL)
          .then((result)=>{
              if(result.status === 200){
                  var users =[];
                  for(let i=0;i<result.data.length;i++){
                      users.push(<Option value={result.data[i].id}>{result.data[i].username}</Option>)
                  }
                  this.setState({userData:users});
              }else{
                  message.error("操作异常",3);
              }
          }).catch((error)=>{
              message.error("操作异常",3)
          })
        }
    }
    initUserSelect=()=>{
        if(!AuthorUtils.isAuthor("role_user")){
           return(
               <Col xs={24} sm={12} md={6} lg={4}>
                   <Select placeholder="业务员" style={{ width: '95%' }}
                   allowClear={true}
                   onChange={(e)=>{
                       this.setState({user_id:e === undefined?'':e})
                   }}>
                       {this.state.userData}
                   </Select>
               </Col>
           )
         }
     }
     /**
      * 删除操作
      */
    hx=()=>{
        if(AuthorUtils.isAuthor("role_admin")){
           return(
            <Divider type="vertical"/>
           )
        }
     }
    del(record){
        if(AuthorUtils.isAuthor("role_admin")){
            return(
            <Popconfirm title="确认删除，数据无法恢复?" onConfirm={()=>{
                HttpUtils.get(API.URL_DEL+record.id)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({
                            page:1,
                            pageSize:50
                        })
                        this.findUrlInfo(0,50);
                    }else{
                        message.error("操作异常",3)
                    }
                }).catch((error)=>{
                    message.error("操作异常",3)
                })
            }} onCancel={()=>{message.info("操作取消",3)}} okText="确认" cancelText="取消">
                <a href="javascript:void(0);" >删除</a>
            </Popconfirm>
            )
        }
    }
    render(){
        const columns=[
            {
                title: '链接编号',
                dataIndex: 'id',
                key: 'id',
                width:240
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width:200
            },
            {
                title: '产品名称',
                dataIndex: 'productEntity.name',
                key: 'productEntity.name',
                width:200
            },
            {
                title: '预览链接',
                dataIndex: 'preview_url',
                key: 'preview_url',
                width:100,
                render:(text,record)=>{
                    return(
                        <Popover content={record.preview_url} >
                            <Button type="primary" onClick={()=>{
                                window.open(`${record.preview_url}`);
                            }}>预览</Button>
                        </Popover>
                        
                    )
                }
            },
            
            {
                title: '创建时间',
                dataIndex: 'c_date',
                key: 'c_date',
                width:200
            },
            {
                title: '创建者',
                dataIndex: 'userEntity.username',
                key: 'userEntity.username',
                width:100
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
               
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:120,
                render:(text,record)=>{
                    return(
                        <span>
                            <a href="javascript:void(0);" onClick={()=>{
                               
                                this.setState({
                                    isAdd:false,
                                    urlInfoVisible:true,
                                    urlInfoTitel:'编辑信息'
                                })
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "title": record.title,
                                    'product_id':record.product_id,
                                    "remark":record.remark
                                });
                            }}>编辑</a>
                            {this.hx() } 
                            {this.del(record)}
                        </span>
                    )
                },
                fixed: 'right',
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
                            <Input placeholder="链接编号" onChange={(e)=>{
                                this.setState({code:e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Select placeholder="产品" allowClear={true}
                             style={{ width: '90%' }} onChange={(e)=>{
                                this.setState({product_id:e===undefined?-1:e})
                            }}>
                            {this.state.productData}
                            </Select>
                        </Col>
                        {this.initUserSelect()}
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({
                                page:1,
                                pageSize:50
                            })
                            this.findUrlInfo(0,50)
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                            this.props.form.resetFields();
                            this.setState({urlInfoTitel:'添加信息',urlInfoVisible:true,isAdd:true})
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.urlsData} scroll={{ x: 1400, y: 720 }} row
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.infoTableChange} />
                </div>
                <Modal
                title={this.state.urlInfoTitel}
                visible={this.state.urlInfoVisible}
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={()=>{
                    this.setState({urlInfoVisible:false})
                }}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>
                        <Form.Item
                        {...formItemLayout}
                        label="链接标题:"
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '链接标题不能为空..' }],
                            })(
                                    <Input  />
                            )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="产品:"
                        >
                            {getFieldDecorator('product_id', {
                                rules: [{ required: true, message: '产品不能为空..' }],
                            })(
                                <Select allowClear={true} style={{ width: '100%' }}>
                                    {this.state.productData}
                               </Select>
                            )}
                    </Form.Item>
                    {this.getDomain(formItemLayout,getFieldDecorator)}
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

export default Form.create()(UrlInfoView);