import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,Switch,Upload,Icon} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const {TextArea} = Input;
class CommentInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        if(this.props.location.query && this.props.location.query.id !== undefined){
            this.setState({product_id:this.props.location.query.id})
            this.findCommentInfo(0,50);
        }
       
        NProgress.done();
    }
    constructor(props){
        super(props)
        this.state={
            total:0,
            page:1,
            pageSize:50,
            commentData:[],
            loading:false,
            commentVisible:false,
            commentTitle:'',
            fileList: [],
            img_id:-1,
            product_id:-1,
            isAdd:true,
            token:{
                token:window.sessionStorage.getItem('token')
            }
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
        this.findCommentInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    handleChange=({file,fileList,event})=>{
        const list = this.state.fileList;
        const index = list.indexOf(file);
        if(index < 0){
          this.setState({ 
            fileList: fileList
          })
        }
        if(fileList[0] && fileList[0].status === "done"){
          if(fileList[0].response){
            this.setState({img_id:fileList[0].response.data.uid})
          }
        }
    }
    /**
     * 表单提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var data ={}
                data.id = values.id;
                data.comment_name = values.comment_name;
                data.comment_content = values.comment_content;
                data.img_id = this.state.img_id;
                data.product_id = this.state.product_id;
                var url = this.state.isAdd?API.COMMENT_ADD:API.COMMENT_EDIT;
                HttpUtils.postJson(url,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({
                            commentVisible:false,
                            img_id:-1,
                            page:1,
                            pageSize:50,
                            fileList:[]
                        })
                        this.findCommentInfo(0,50);
                    }else{
                        message.error("操作异常",3);
                    }
                }).catch((error)=>{
                    message.error("操作异常",3);
                })
            }
        })
    }
    onRemoveImage=()=>{
        this.setState({
            fileList:[],
            img_id:-1,
        })
    }
    /**
     * 分页查询
     */
    findCommentInfo=(page,pageSize)=>{
        this.setState({loading:true});
        const data = new FormData();
        data.append("page",page);
        data.append("size",pageSize);
        data.append("product_id",this.props.location.query.id);
        HttpUtils.post(API.COMMENT_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({commentData:result.data.content,total:result.data.count});
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false});
        }).catch((error)=>{
            message.error("操作异常",3);
            this.setState({loading:false});
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
                title: '评论者',
                dataIndex: 'comment_name',
                key: 'comment_name',
                width:'15%'
            },
            {
                title: '评论图片',
                dataIndex: 'imageEntity',
                key: 'imageEntity',
                width:160,
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
                title: '评论内容',
                dataIndex: 'comment_content',
                key: 'comment_content',
            },
            
            {
                title: '创建时间',
                dataIndex: 'c_date',
                key: 'c_date',
                width:160
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
                                this.setState({
                                    commentTitle:'编辑评论',
                                    commentVisible:true,
                                    isAdd:false
                                })
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "comment_name": record.comment_name,
                                    "comment_content":record.comment_content,
                                });
                                if(record.imageEntity){
                                    var list = [];
                                    list.push(record.imageEntity);
                                    this.setState({
                                        img_id:record.imageEntity.uid,
                                        fileList:list
                                    })
                                }
                            }}>编辑</a>
                        </span>
                    )
                }
            } 
        ]
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
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
                        <Col xs={24} sm={12} md={8} lg={6}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({
                                page:1,
                                pageSize:50
                            })
                            this.findCommentInfo(0,50);
                        }}>查询</Button>
                            &nbsp; &nbsp;
                        <Button type="primary" icon="plus" onClick={()=>{
                            this.props.form.resetFields();
                            this.setState({
                                commentVisible:true,
                                commentTitle:'添加评论',
                                isAdd:true
                            })
                        }}>添加</Button>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.commentData} scroll={{ x: 700, y: 720 }} row
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
                title={this.state.commentTitle}
                visible={this.state.commentVisible}
                onOk={this.handleSubmit}
                onCancel={()=>{
                    this.setState({
                        commentVisible:false,
                        img_id:-1
                    })
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
                            label="评论者:"
                            >
                            {getFieldDecorator('comment_name', {
                                rules: [{ required: true, message: '评论者不能为空..' }],
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="评论内容:"
                            >
                            {getFieldDecorator('comment_content', {
                                rules: [{ required: true, message: '评论内容不能为空..' }],
                            })(
                                    <TextArea  rows={4} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="评论图片:"
                            >
                            {getFieldDecorator('img_id')(
                                    <Upload
                                    data={this.state.token}
                                    action={API.IMAGE_UPLOAD}
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onChange={this.handleChange}
                                    onRemove={this.onRemoveImage}
                                    >
                                        {this.state.fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(CommentInfoView)