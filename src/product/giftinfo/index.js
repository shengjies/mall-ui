import React,{Component} from 'react'
import { Row, Col,Icon,Input,Button,Select,Table,Modal,Form,message,Divider,Card,Carousel,Upload,Switch} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
const { TextArea } = Input;
let sizeindex =0;
let typeindex =0;
const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
class GiftInfoEditView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        if(this.props.location.query && this.props.location.query.add !== undefined){
            this.setState({isAdd:this.props.location.query.add});
            if(!this.props.location.query.add){
                HttpUtils.get(API.GIFT_FIND_BY_ID+this.props.location.query.id)
                .then((result)=>{
                    if(result.status === 200){
                        
                        const {form} = this.props;
                        form.setFieldsValue({
                            id:result.data.id,
                            name:result.data.name,
                            price:result.data.price,
                            cgurl:result.data.cgurl,
                            remark:result.data.remark,
                        })
                        var mainImage=[];//主图
                        if(result.data.imageEntity){
                            mainImage.push(result.data.imageEntity);
                        }
                        this.setState({
                            id:result.data.id,
                            mainImage:mainImage,
                            zp_image_id:result.data.zp_image_id,
                        })
                        //尺码
                        if(result.data.zpsizes && result.data.zpsizes.length > 0 ){
                            var zkeys =[],zlabel =[],zvalue =[];
                            var item = result.data.zpsizes;
                            for(sizeindex = 0;sizeindex < item.length;sizeindex ++){
                                zkeys.push(sizeindex);
                                zlabel.push(item[sizeindex].zpzlable);
                                zvalue.push(item[sizeindex].zpzvalue);
                            }
                            this.setState({
                                zlabel:zlabel,
                                zvalue:zvalue
                            })
                            form.setFieldsValue({
                                zkeys: zkeys,
                            });
                        }
                        //属性
                        if(result.data.zptypes && result.data.zptypes.length > 0){
                            var tkeys =[],tlabel =[],tvalue =[],timg=[];
                            var item = result.data.zptypes;
                            const list = this.state.fileList;
                            for(typeindex = 0;typeindex < item.length;typeindex ++){
                                tkeys.push(typeindex);
                                tlabel.push(item[typeindex].zptlable);
                                tvalue.push(item[typeindex].zptvalue);
                                timg.push(item[typeindex].zptimg);
                                
                                if(item[typeindex].imageEntity){
                                    var img =[];
                                    item[typeindex].imageEntity.product_id=typeindex;
                                    img.push(item[typeindex].imageEntity);
                                    list[typeindex] = img;
                                }
                            }
                            this.setState({
                                tlabel:tlabel,
                                tvalue:tvalue,
                                timg:timg,
                                fileList:list
                            })
                            form.setFieldsValue({
                                tkeys: tkeys,
                            });
                        }
                    }else{
                        message.error("操作异常",3);
                    }
                }).catch((error)=>{
                    message.error("操作异常",3);
                })
            }
        }
        NProgress.done();
    }
    constructor(props){
        super(props)
        this.state={
            id:'',
            mainImage:[],
            zp_image_id:-1,
            isAdd:true,
            fileList:[],
            /**
             * 尺码
             */
            zlabel:[],
            zvalue:[],
            /**
             * 类别
             */
            tlabel:[],
            tvalue:[],
            timg:[],
            token:{
                token:window.sessionStorage.getItem('token')
            }
        }
    }
    mainImageChange=({ file,fileList })=>{
        this.setState({ 
            mainImage:fileList
        })
        if (file.status !== 'uploading') {
            if(file.response.status === 200){
                this.setState({ 
                    zp_image_id:file.response.data.uid
                })
            }
        }
    }
    mainImageRemove=()=>{
        this.setState({ 
            zp_image_id:-1,
            mainImage:[]
        })
    }
    /**
     * 表单提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({okLoading:true})
                var data = {};
                data.id = this.state.id;
                data.zp_image_id = this.state.zp_image_id;
                data.name = values.name;
                data.price = values.price;
                data.cgurl = values.cgurl;
                data.remark = values.remark;
                if(values.tkeys && values.tkeys.length >0){
                    var type =[];
                    for(let i =0;i<values.tkeys.length;i++){
                        var index = values.tkeys[i];
                        var item ={
                            zptlable:values.tlabel[index],
                            zptvalue:values.tvalue[index],
                            zptimg:values.timg[index],
                        }
                        type.push(item);
                    }
                    data.zptypes = type;
                }
                if(values.zkeys && values.zkeys.length > 0){
                    var size =[];
                    for(let i =0;i < values.zkeys.length;i++){
                        var index = values.zkeys[i];
                        var item = {
                            zpzlable:values.zlabel[index],
                            zpzvalue:values.zvalue[index]
                        }
                        size.push(item);
                     }
                    data.zpsizes = size;
                }
                var url = this.state.isAdd?API.GIFT_ADD:API.GIFT_EDIT;
                HttpUtils.postJson(url,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
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
     * 类别
     */
    handleChange =({file,fileList,event})=>{
        const list = this.state.fileList;
        const index = list.indexOf(fileList);
        if(index <= 0){
          list.map((item,index) => {
            if(item !== undefined && item[0].uid === fileList[0].uid){
                list[index] = fileList
            }
          })
          this.setState({ 
            fileList: list
          })
        }
        if(fileList[0] && fileList[0].status === "done"){
          const { form } = this.props;
          const timg = form.getFieldValue('timg');
          timg[fileList[0].response.data.product_id] = fileList[0].response.data.uid
          form.setFieldsValue({
            'timg':timg
          });
        }
    }
    onRemoveImage=(file)=>{
        const list = this.state.fileList;
        const { form } = this.props;
        const timg = form.getFieldValue('timg');
        if(file.response){
            timg[file.response.data.product_id] = undefined;
            list[file.response.data.product_id] = undefined;
        }else{
            timg[file.product_id] = undefined;
            list[file.product_id] = undefined;
        }
        this.setState({ 
          fileList: list
        })
        form.setFieldsValue({
          'timg':timg
        });
    }
    getUploadButton=(k)=>{
        if(this.state.fileList[k]){
          return this.state.fileList[k].length >= 1?null:uploadButton;
        }else{
          return uploadButton;
        }
    }
    addType = () => {
        const { form } = this.props;
        const tkeys = form.getFieldValue('tkeys');
        const nextKeys = tkeys.concat(typeindex++);
        form.setFieldsValue({
            tkeys: nextKeys,
        });
    }
    removeType = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('tkeys');
        form.setFieldsValue({
            tkeys: keys.filter(key => key !== k),
        });
    }
    /**
     * 尺码
     */
    addSize = () => {
        const { form } = this.props;
        const zkeys = form.getFieldValue('zkeys');
        const nextKeys = zkeys.concat(sizeindex++);
        form.setFieldsValue({
            zkeys: nextKeys,
        });
    }
    removeSize = (k) => {
        const { form } = this.props;
        const zkeys = form.getFieldValue('zkeys');
        form.setFieldsValue({
            zkeys: zkeys.filter(key => key !== k),
        });
    }
    render(){
        const uploadMainButton = (
            <div className='mainimg'>
              <Icon type="plus" />
              <div className="ant-upload-text">赠品主图</div>
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
          /**
       * 类别
       */
        const { getFieldDecorator,getFieldValue } = this.props.form;
        getFieldDecorator('tkeys', { initialValue: [] });
        const tkeys = getFieldValue('tkeys');
        const typeFormItems = tkeys.map((k, index) => (
            <Form.Item
            required={false}
            key={k}
            >
            {getFieldDecorator(`tlabel[${k}]`, {
                initialValue:this.state.tlabel[k],
                validateTrigger: ['onChange', 'onBlur']
            })(
                <Input  style={{ width: '35%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`tvalue[${k}]`, {
                initialValue:this.state.tvalue[k],
                validateTrigger: ['onChange', 'onBlur']
            })(
                <Input  style={{ width: '35%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`timg[${k}]`, {
                initialValue:this.state.timg[k],
                validateTrigger: ['onChange', 'onBlur']
            })(
                <Input type="hidden"  style={{ width: '10%', marginRight: 8 }} />
            )}
            <Upload
                data={this.state.token}
                action={API.IMAGE_UPLOAD}
                listType="picture-card"
                data={{key:k}}
                fileList={this.state.fileList[k]}
                beforeUpload={(file,fileList)=>{
                    const list = this.state.fileList;
                    if(list[k] === undefined){
                    list[k] = fileList;
                    this.setState({ 
                        fileList: list
                    })
                    }
                    return true;
                }}
                onChange={this.handleChange}
                onRemove={this.onRemoveImage}
                >
                {this.getUploadButton(k)}
            </Upload>
            {tkeys.length > 0 ? (
                <Icon
                style={{ fontSize: '28px' }}
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeType(k)}
                />
            ) : null}
            </Form.Item>
        ));
        /**
         * 尺码
         */
        getFieldDecorator('zkeys', { initialValue: [] });
        const zkeys = getFieldValue('zkeys');
        const sizeFormItems = zkeys.map((k, index) => (
            <Form.Item
            required={false}
            key={k}
            >
            {getFieldDecorator(`zlabel[${k}]`, {
                initialValue:this.state.zlabel[k],
                validateTrigger: ['onChange', 'onBlur']
            })(
                <Input  style={{ width: '45%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`zvalue[${k}]`, {
                initialValue:this.state.zvalue[k],
                validateTrigger: ['onChange', 'onBlur']
            })(
                <Input  style={{ width: '45%', marginRight: 8 }} />
            )}
            {zkeys.length > 0 ? (
                <Icon
                style={{ fontSize: '28px' }}
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeSize(k)}
                />
            ) : null}
            </Form.Item>
        ));
        return(
            <div style={{backgroundColor:"#fff"}}>
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card style={{minHeight:420}}
                                title="赠品主图">
                                    <div className="zpmainimg">
                                    <Upload
                                    data={this.state.token}
                                    action={API.IMAGE_UPLOAD}
                                    listType="picture-card"
                                    fileList={this.state.mainImage}
                                    onChange={this.mainImageChange}
                                    onRemove={this.mainImageRemove}
                                    >
                                    {this.state.mainImage.length >= 1 ? null : uploadMainButton}
                                    </Upload>
                                </div>
                            </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card title="赠品信息">
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('id')(
                                        <Input type="hidden" />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="赠品名称:"
                                    >
                                        {getFieldDecorator('name',{
                                            rules: [{ required: true, message: '赠品名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="赠品单价:"
                                    >
                                        {getFieldDecorator('price',{
                                            rules: [{ required: true, message: '赠品单价不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="采购链接:"
                                    >
                                        {getFieldDecorator('cgurl',{
                                            rules: [{ required: true, message: '采购链接不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="备注信息:"
                                    >
                                        {getFieldDecorator('remark')(
                                            <TextArea rows={3} />
                                        )}
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card style={{minHeight:320}}
                                    title="类别属性">
                            <div className="typeimg">
                                <Form onSubmit={this.handleSubmit}>
                                    {typeFormItems}
                                    <Form.Item >
                                    <Button type="dashed" onClick={this.addType} style={{ width: '100%' }}>
                                        <Icon type="plus" /> 添加类型
                                    </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card style={{minHeight:320}}
                                    title="尺码属性">
                                <Form onSubmit={this.handleSubmit}>
                                    {sizeFormItems}
                                    <Form.Item >
                                    <Button type="dashed" onClick={this.addSize} style={{ width: '100%' }}>
                                        <Icon type="plus" /> 添加尺码
                                    </Button>
                                    </Form.Item>
                                </Form>
                        </Card>
                    </Col>
                </Row>
                <Button className='subBtn'  onClick ={this.handleSubmit} type="primary">{this.state.isAdd?'添加':'编辑'}</Button>
            </div>
        )
    }
}
export default Form.create()(GiftInfoEditView)