import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Popover,Checkbox,Popconfirm} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const Option = Select.Option;
class AdminInfoView extends Component{
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
          role_code:'',
          total:0,
          page:1,
          pageSize:50,
          userData:[],
          loading:false,
          adminModalVisible:false,
          adminModalTitle:'',
          fbDataAll:[],
          domainDataAll:[],
          isInit:true,
          isAdd:true,
          /**组员分配 */
          groupId:-1,//组长编号
          groups:[],
          groupValue:[]
      }
    }
    /**
     * 产品表格改变
     */
    productInfoTableChange=(pagination, filters, sorter)=>{
        this.setState({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
        this.findUserInfo(pagination.current - 1, pagination.pageSize);
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
        formData.append("role_code",this.state.role_code);
        formData.append("page",page);
        formData.append("size",pageSize);
        HttpUtils.post(API.USER_FIND,formData)
        .then((result)=>{
            if(result.status === 200){
                this.setState({
                    userData:result.data.page.content,
                    total:result.data.page.count,
                    groups:result.data.m
                });
                if(this.state.isInit){
                    this.findAllFbId();
                    this.findAllDomain();
                }
                this.setState({isInit:false})
            }else{
                message.error('操作异常',3);
            }
            this.setState({loading:false});
        }).catch((error)=>{
            message.error('操作异常',3);
            this.setState({loading:false})
        })
    }
    /**
     * 查询FBid
     */
    findAllFbId=()=>{
        HttpUtils.get(API.FB_FIND_ALL)
        .then((result)=>{
            if(result.status === 200){
                var fbs=[];
                for (let i = 0; i < result.data.length; i++) {
                    fbs.push(<Option key={result.data[i].fb_name}  value={result.data[i].id}>{result.data[i].fb_name}</Option>);
                }
                this.setState({fbDataAll:fbs})
            }else{
                message.error('操作异常',3);
            }
        }).catch((error)=>{
            message.error('操作异常',3);
        })
    }
    /**
     * 查询域名
     */
    findAllDomain=()=>{
        HttpUtils.get(API.DOMAIN_FIND_ALL)
        .then((result)=>{
            var demains=[];
            for (let i = 0; i < result.data.length; i++) {
                demains.push(<Option key={result.data[i].domain_name}  value={result.data[i].id}>{result.data[i].domain_name}</Option>);
            }
            this.setState({domainDataAll:demains})
        }).catch((error)=>{
            message.error('操作异常',3);
        })
    }
    /**
     * 表单提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var url = this.state.isAdd?API.USER_ADD:API.USER_EDIT;
              HttpUtils.postJson(url,values)
              .then((result)=>{
                if(result.status === 200){
                    message.success('操作成功',3);
                    this.setState({adminModalVisible:false});
                    this.setState({
                        page:1,
                        pageSize:50
                    })
                    this.findUserInfo(0,50);
                }else{
                    message.error('操作异常',3);
                }
              }).catch((error)=>{
                message.error('操作异常',3);
              })
            }
          });
    }
    /**
     * 域名分配
     */
    getDomain=(d)=>{
        if(d.length>0){
            var  a =[];
            for (let i = 0; i < d.length; i++) {
                a.push(<p>{d[i].domain_name}</p> );
            }
            return a
        }
    }
    getFb=(f)=>{
        if(f.length>0){
            var  a =[];
            for (let i = 0; i < f.length; i++) {
                a.push(<p>{f[i].fb_name}</p> );
            }
            return a
        }
    }
    /**
     * 修改
     */
    openEditWindow=(info)=>{
        this.setState({
            adminModalTitle:'编辑信息',adminModalVisible:true,isAdd:false
        })
        const { setFieldsValue } = this.props.form;
        var fb_id=[];
        for (let i = 0; i < info.fbEtities.length; i++) {
            fb_id.push(info.fbEtities[i].id);
        }
        var domain_id =[];
        for (let i = 0; i < info.domailEntities.length; i++) {
            domain_id.push(info.domailEntities[i].id);
        }
        setFieldsValue({
            "id":info.id,
            "username": info.username,
            "password":info.password,
            "role_code":info.role_code,
            "fb_id":fb_id,
            "domain_id":domain_id
        });
    }
    /**
     * 组员分配
     */
    initGroup=()=>{
       var checkItem=[];
       this.state.groups.map((item,index)=>{
        checkItem.push(<Checkbox value={`${item.id}`}>{item.username}</Checkbox>)
         })
        return checkItem;
    }
    render(){
        const groupItem = <div><div>
            <Checkbox.Group value={this.state.groupValue}  
            style={{ width: '100%' }} onChange={(e)=>{
               this.setState({
                groupValue:e
               })
            }}>
            {
               this.initGroup()
            }
            </Checkbox.Group>
        </div>
        <div style={{marginTop:10}}>
            <Button type="primary" onClick={()=>{
                const data = new FormData();
                data.append("id",this.state.groupId);
                data.append("sales",JSON.stringify(this.state.groupValue));
                HttpUtils.post(API.USER_GROUP,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                    }else{
                        message.error("操作异常",3)
                    }
                }).catch((error)=>{
                    message.error("操作异常",3)
                })
            }}>保存</Button>
        </div>
    </div>;
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
                title: '角色',
                dataIndex: 'role_code',
                key: 'role_code',
                width:100,
                render:(text,record)=>{
                    if(text === 'role_user'){
                        return '业务员';
                    }else if(text === 'role_group'){
                        return(
                            <Popover overlayStyle={{width:400}}
                             placement="bottom" title={'组员分配'} content={groupItem} 
                             onClick={()=>{
                                 this.setState({
                                    groupId:record.id,
                                     groupValue:record.groupId
                                 })
                             }}
                              trigger="click">
                                <Button>组长</Button>
                            </Popover>
                        )
                    }else if(text === 'role_cg'){
                        return '采购员';
                    }else{
                        return '管理员'
                    }
                }
            },
            {
                title: '域名 & Facebbokid分配',
                dataIndex: 'fbdomain',
                key: 'fbdomain',
                render:(text,record)=>{
                    if(record.domailEntities || record.fbEtities){
                        return(
                            <table>
                            <tr>
                                <td>域名分配</td>
                                <td>FB分配</td>
                            </tr>
                            <tr>
                                <td>
                                    {this.getDomain(record.domailEntities)}
                                </td>
                                <td>
                                    {this.getFb(record.fbEtities)}
                                </td>
                            </tr>
                        </table>
                        )
                    }else{
                        return '----'
                    }
                }
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
                                this.openEditWindow(record);
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
                            <Select placeholder="角色" allowClear={true}  style={{ width: '95%' }} onChange={(e)=>{
                                    this.setState({role_code:e===undefined?'':e});
                            }} >
                                <Option value="role_admin">管理员</Option>
                                <Option value="role_group">组长</Option>
                                <Option value="role_user">业务员</Option>
                                <Option value="role_cg">采购员</Option>
                            </Select>
                        </Col>
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
                                this.props.form.resetFields();
                                this.setState({adminModalTitle:'添加信息',adminModalVisible:true,isAdd:true})
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
                <Modal
                maskClosable={false}
                title={this.state.adminModalTitle}
                visible={this.state.adminModalVisible}
                onOk={this.handleSubmit}
                onCancel={()=>{this.setState({adminModalVisible:false})}}
                >
                 <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('id')(
                            <Input type="hidden" />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="角色:"
                        >
                        {getFieldDecorator('role_code', {
                            rules: [{ required: true, message: '角色不能为空..' }],
                        })(
                            <Select  style={{ width: '100%' }} >
                            <Option value="role_admin">管理员</Option>
                            <Option value="role_group">组长</Option>
                            <Option value="role_user">业务员</Option>
                            <Option value="role_cg">采购员</Option>
                          </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="登录名称:"
                        >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '登录名称不能为空..' }],
                        })(
                                <Input  />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="登录密码:"
                        >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '登录密码不能为空..' }],
                        })(
                                <Input  />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="FBID:"
                        >
                        {getFieldDecorator('fb_id', {
                            rules: [{ required: true, message: 'FBID不能为空..' }],
                        })(
                            <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            defaultValue={[]}
                            onChange={()=>{}}
                          >
                            {this.state.fbDataAll}
                          </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="域名:"
                        >
                        {getFieldDecorator('domain_id', {
                            rules: [{ required: true, message: '域名不能为空..' }],
                        })(
                            <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            defaultValue={[]}
                            onChange={()=>{}}
                          >
                            {this.state.domainDataAll}
                          </Select>
                        )}
                    </Form.Item>
                 </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AdminInfoView);