import React,{Component} from 'react'
import { Row, Col,Icon,Input,Button,Select,Table,Modal,Form,message,Divider,Card,Carousel,Upload,Switch} from 'antd'
import NProgress from 'nprogress'
import './index.css'
const { TextArea } = Input;
class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }
    constructor(props){
        super(props)
        this.state={
            previewVisible: false,
            previewImage: '',
            fileList: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              }],
        }
    }
    render(){
        const uploadMainButton = (
            <div className='mainimg'>
              <Icon type="plus" />
              <div className="ant-upload-text">产品主图</div>
            </div>
          );
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">轮播图片</div>
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
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Card
                                title="产品主图">
                                    <div className="mainimg">
                                    <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={{}}
                                    onChange={{}}
                                    >
                                    {this.state.fileList.length >= 1 ? null : uploadMainButton}
                                    </Upload>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                        <Card
                            title="轮播图片">
                            <Carousel autoplay>
                                <img  src="https://dsaf465859jzs.cloudfront.net/files/lvRhdkMBQIOYP5u28_fCyw.gif" />
                                <img  src="https://dsaf465859jzs.cloudfront.net/files/lvRhdkMBQIOYP5u28_fCyw.gif" />
                            </Carousel>
                            <div className="lbdiv">
                            <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={this.state.fileList}
                            onPreview={{}}
                            onChange={{}}
                            >
                            {this.state.fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                        </div>
                        </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Card
                                title="营销策略">
                                    
                            </Card>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                        title="产品信息">
                        
                        <div>
                            <Form onSubmit={this.handleAccountSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('id')(
                                        <Input type="hidden" />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="产品名称:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="国家名称:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="页面模板:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="语言模板:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="原价:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="单价:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="已经售出:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="评论数量:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="最大购买数量:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="Facebook像素Id:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="状态"
                                    >
                                        {getFieldDecorator('loginName')(
                                            <Switch /> 
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否显示评论"
                                    >
                                        {getFieldDecorator('loginName')(
                                            <Switch /> 
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="采购链接:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <TextArea  rows={3} />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="产品简介:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <TextArea  rows={3} />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="备注信息:"
                                    >
                                        {getFieldDecorator('loginName',{
                                            rules: [{ required: true, message: '登录名称不能为空..' }],
                                        })(
                                            <TextArea  rows={3} />
                                        )}
                                </Form.Item>
                            </Form>
                        </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                            title="类别属性">
                                    <div className="mainimg">
                                    <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={{}}
                                    onChange={{}}
                                    >
                                    {this.state.fileList.length >= 1 ? null : uploadMainButton}
                                    </Upload>
                                </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                                title="尺码属性">
                                    <div className="mainimg">
                                    <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={{}}
                                    onChange={{}}
                                    >
                                    {this.state.fileList.length >= 1 ? null : uploadMainButton}
                                    </Upload>
                                </div>
                        </Card>
                    </Col>
                </Row>
                
            </div>
        )
    }
}
export default Form.create()(ProductInfoView);