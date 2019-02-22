import React,{Component} from 'react'
import { Row, Col,Icon,Input,Button,Select,Table,Modal,Form,message,Divider,Card,Carousel,Upload,Switch} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
import {Editor} from '@tinymce/tinymce-react'
const { TextArea } = Input;
const Option = Select.Option;
const plugins = ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount']
const toolbar = ['bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | blockquote undo redo removeformat subscript superscript code codesample',
  ' fontsizeselect forecolor backcolor | hr bullist numlist | link  charmap  table  anchor pagebreak   emoticons  | myimage  |']
let sizeindex =0;
let typeindex =0;
const uploadButtonDatail = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
);
class ProductInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
        if(!this.state.isAdd){
            HttpUtils.get(API.PRODUCT_FIND_BY_ID+this.props.location.query.id)
            .then((result)=>{
                if(result.status === 200){
                    const {form} = this.props;
                    form.setFieldsValue({
                        id:result.data.id,
                        name:result.data.name,
                        country:result.data.country,
                        templ:result.data.templ,
                        o_price:result.data.templ,
                        price:result.data.price,
                        lang:result.data.lang,
                        sold:result.data.sold,
                        comment_num:result.data.comment_num,
                        max_buy_num:result.data.max_buy_num,
                        comment:result.data.comment,
                        purchase_url:result.data.purchase_url,
                        remark:result.data.remark,
                        facebook:result.data.facebook.split(","),
                        introduction:result.data.introduction,
                    })
                    var mainImage=[];//主图
                    if(result.data.mainImage){
                        mainImage.push(result.data.mainImage);
                    }
                    var roundImage =[];//轮播图
                    if(result.data.roundImageList && result.data.roundImageList.length >0){
                        roundImage = result.data.roundImageList;
                    }
                    this.setState({
                        id:result.data.id,
                        description:result.data.description,
                        main_image_id:result.data.main_image_id,
                        mainImage:mainImage,
                        roundImage:roundImage
                    })
                    
                    //尺码
                    if(result.data.sizes && result.data.sizes.length > 0 ){
                        var sizekeys =[],zlabel =[],zvalue =[];
                        var item = result.data.sizes;
                        for(sizeindex = 0;sizeindex < item.length;sizeindex ++){
                            sizekeys.push(sizeindex);
                            zlabel.push(item[sizeindex].size_label);
                            zvalue.push(item[sizeindex].size_value);
                        }
                        this.setState({
                            zlabel:zlabel,
                            zvalue:zvalue
                        })
                        form.setFieldsValue({
                            sizekeys: sizekeys,
                        });
                    }
                    //属性
                    if(result.data.types && result.data.types.length > 0){
                        var typekeys =[],tlabel =[],tvalue =[],timg=[];
                        var item = result.data.types;
                        for(typeindex = 0;typeindex < item.length;typeindex ++){
                            typekeys.push(typeindex);
                            tlabel.push(item[typeindex].type_lable);
                            tvalue.push(item[typeindex].type_value);
                            timg.push(item[typeindex].img_id)
                        }
                        this.setState({
                            tlabel:tlabel,
                            tvalue:tvalue,
                            timg:timg
                        })
                        form.setFieldsValue({
                            typekeys: typekeys,
                        });
                    }
                }else{
                    message.error('操作异常',3)  
                }
            }).catch((error)=>{
                message.error('操作异常',3)
            })
        }
    }
    constructor(props){
        super(props)
        this.state={
            previewVisible: false,
            previewImage: '',
            fileList: [],
            id:-1,
            isAdd:this.props.location.query.add===undefined?true:this.props.location.query.add,
            // isAdd:true,
            mainImage:[],//产品主图,
            main_image_id:-1,//主图编号
            roundImage:[],//轮播图,
            /**
             * 营销策略
             */
            cl_id:1,//营销策略ID

            /**
             * 详情编辑
             */
            editor:null,//编辑器
            addImageVisible:false,
            detailsImageList:[],
            description:'',
            /**
             * 尺码属性
             */
            sizeListForm:[],
            sizeKeys:[],
            zlabel:[],
            zvalue:[],
            /**
             * 类别属性
             */
            tlabel:[],
            tvalue:[],
            timg:[]
        }
    }
    /**
     * 产品主图操作
     */
    mainImageChange = ({ file,fileList }) => {
        this.setState({ 
            mainImage:fileList
        })
        if (file.status !== 'uploading') {
            if(file.response.status === 200){
                this.setState({ 
                    main_image_id:file.response.data.uid
                })
            }
        }
    };
    mainImageRemove =(file)=>{
        this.setState({ 
            main_image_id:-1,
            mainImage:[]
        })
    }
    /**
     * 轮播图操作
     */
    roundImageChange=({ file,fileList }) => {
        this.setState({ 
            roundImage:fileList
        })
    };
    getRoundeImage=(d)=>{
        var  a =[];
            for (let i = 0; i < d.length; i++) {
                if(d[i].response){
                    var item = d[i].response.data;
                    a.push(<img  src={item.url} width='100%' height='340px'/> );
                }else{
                    a.push(<img  src={d[i].url} width='100%' height='340px'/> );
                }
            }
            return a
    }
    /**
     * 提交表单数据
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                // var data ={};
                // data.id=this.state.id;
                // data.main_image_id=this.state.main_image_id;
                // data.name=values.name;
                // data.introduction=values.introduction;
                // data.description=this.state.editor.getContent();
                // data.cl_id=this.state.cl_id;
                // data.price=values.price;
                // data.o_price=values.o_price;
                // data.country=values.country;
                // data.unit=values.unit;
                // data.sold=values.sold;
                // data.comment_num=values.comment_num;
                // data.max_buy_num=values.max_buy_num;
                // data.facebook=JSON.stringify(values.facebook);
                // data.comment=values.comment === undefined ?false:values.comment;
                // data.templ=values.templ;
                // data.lang=values.lang;
                // data.purchase_url=values.purchase_url;
                // data.remark=values.remark;
                // var round = this.state.roundImage;
                // var roundId =[];
                // for(let i=0;i<round.length;i++){
                //     if(round[i].response){
                //         roundId.push(round[i].response.data.uid);
                //     }else{
                //         roundId.push(round[i].uid);
                //     }
                // }
                // data.roundImage=roundId;
                // if(values.sizekeys && values.sizekeys.length >0){
                //     var size =[];
                //     for(let i =0;i<values.sizekeys.length;i++){
                //         var index = values.sizekeys[i];
                //         var item ={
                //             size_label:values.zlabel[index],
                //             size_value:values.zvalue[index]
                //         }
                //         size.push(item);
                //     }
                //     data.sizes=size;
                // }
                // if(values.typekeys && values.typekeys.length > 0){
                //     var type =[];
                //     for(let i= 0;i<values.typekeys.length;i++){
                //         var index = values.typekeys[i];
                //         var item ={
                //             type_lable:values.tlabel[index],
                //             type_value:values.tvalue[index],
                //             img_id:values.timg[index],
                //         }
                //         type.push(item);
                //     }
                //     data.types=type;
                // }
                // var url = this.state.isAdd?API.PRODUCT_ADD:API.PRODUCT_EDIT;
                // HttpUtils.postJson(url,data)
                // .then((result)=>{
                //     if(result.status === 200){
                //         message.success('操作成功',3)
                //     }else{
                //         message.error('操作异常',3)
                //     }
                // }).catch((error)=>{
                //     message.error('操作异常',3)
                // })
            }
        })
    }
    /**
     * 编辑详情
     */
    detailsHandleChange= ({ file,fileList }) => {
        this.setState({ 
            detailsImageList:fileList
         })
    };
    
    onDetailsSave=(list)=>{
        var content = this.state.editor.getContent();
        for(var i=0;i<list.length;i++){
        var item = list[i].response.data;
          if(item.url.indexOf('.mp4')>0){
            var text ='<p align="center" >' +
              '<video style="object-fit: fill" poster="'+item.min_url+'" class="edui-upload-video  vjs-default-skin  video-js" controls="" preload="auto" width="100%"\n' +
              '               height="360" src="'+item.url+'">\n' +
              '            <source src="'+item.url+'" type="video/mp4">\n' +
              '        </video>' +
              '</p>'
            content+=text;
          }else{
            var text='<p align="center" ><img src="'+item.url+'"/></p>';
            content+=text;
          }
        }
        this.state.editor.setContent(content);
        this.setState({detailsImageList:[]})
    }
    /**
     * 尺码属性操作
     */
    addSizeForm=()=>{
        const { form } = this.props;
        const keys = form.getFieldValue('sizekeys');
        const nextKeys = keys.concat(sizeindex++);
        form.setFieldsValue({
            sizekeys: nextKeys,
        });
    }
     sizeFormItem = (getFieldDecorator,getFieldValue)=>{
        getFieldDecorator('sizekeys', { initialValue: [] });
        const keys = getFieldValue('sizekeys');
         var a =[];
         for(let i=0;i<keys.length;i++){
            a.push(
                <Form.Item>
                    {getFieldDecorator(`zlabel[${keys[i]}]`,{
                        initialValue:this.state.zlabel[keys[i]],
                        rules: [{ required: true, message: '不能为空..' }],
                    })(
                        <Input   style={{width:'35%'}}/>
                    )}
                    {getFieldDecorator(`zvalue[${keys[i]}]`,{
                        initialValue:this.state.zvalue[keys[i]],
                        rules: [{ required: true, message: '不能为空..' }],
                        })(
                            <Input  style={{width:'40%'}}/>
                    )}
                    {(
                        <Icon
                            style={{ fontSize: '28px' }}
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => {this.removeSizeFormItem(keys[i])}}
                        />
                        )}
                </Form.Item>
            )
         }
    return a};
    removeSizeFormItem =(k)=>{
        const { form } = this.props;
        const keys = form.getFieldValue('sizekeys');
        form.setFieldsValue({
            sizekeys: keys.filter(key => key !== k),
        });
    }

    /**
     * 类别操作
     */
    addTypeForm = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('typekeys');
        const nextKeys = keys.concat(typeindex++);
        form.setFieldsValue({
            typekeys: nextKeys,
        });
      }
    typeFormItem =(getFieldDecorator,getFieldValue)=>{
        getFieldDecorator('typekeys', { initialValue: [] });
        const keys = getFieldValue('typekeys');
         var a =[];
         for(let i=0;i<keys.length;i++){
            a.push(
                <Form.Item>
                    {getFieldDecorator(`tlabel[${keys[i]}]`,{
                        initialValue:this.state.tlabel[keys[i]],
                        rules: [{ required: true, message: '不能为空..' }],
                    })(
                        <Input  style={{width:'25%'}}/>
                    )}
                    {getFieldDecorator(`tvalue[${keys[i]}]`,{
                        initialValue:this.state.tvalue[keys[i]],
                        rules: [{ required: true, message: '不能为空..' }],
                        })(
                            <Input  style={{width:'25%'}}/>
                    )}
                    {getFieldDecorator(`timg[${keys[i]}]`, {
                        initialValue:this.state.timg[keys[i]]
                    })(
                        <Input   style={{ width: '10%', marginRight: 8 }} />
                    )}
                    <Upload
                        action={API.IMAGE_UPLOAD}
                        listType="picture-card"
                        data={{key:keys[i]}}
                        fileList={this.state.fileList[keys[i]]}
                        onChange={this.handleTypeImageChange}
                        onRemove={this.onRemoveTypeImage}
                        >
                        {this.getUploadButton(keys[i])}
                    </Upload>
                    {(
                    <Icon
                        style={{ fontSize: '28px' }}
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => {this.removeTypeFormItem(keys[i])}}
                    />
                    )}
                </Form.Item>
            )
         }
    return a
    }
    getUploadButton=(k)=>{
        if(this.state.fileList[k]){
          return this.state.fileList[k].length >= 1?null:uploadButtonDatail;
        }else{
          return uploadButtonDatail;
        }
      }
      handleTypeImageChange =({file,fileList,event})=>{
        const list = this.state.fileList;
        if(list.indexOf(fileList)<0){
          list.push(fileList)
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
    onRemoveTypeImage=(file)=>{
        const list = this.state.fileList;
        const { form } = this.props;
        const timg = form.getFieldValue('timg');
        timg[file.response.data.product_id] = undefined;
        console.log(list[file.response.data.product_id])
        list[file.response.data.product_id] = undefined;
        this.setState({ 
          fileList: list
        })
        form.setFieldsValue({
          'timg':timg
        });
      }
      removeTypeFormItem =(k)=>{
        const { form } = this.props;
        const keys = form.getFieldValue('typekeys');
        form.setFieldsValue({
            typekeys: keys.filter(key => key !== k),
        });
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
          const { getFieldDecorator,getFieldValue } = this.props.form;
          /**
           * 尺码属性
           */                                          
        return(
            <div style={{backgroundColor:"#fff"}}>
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Card
                                title="产品主图">
                                    <div className="mainimg">
                                    <Upload
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
                        <Col xs={24} sm={24} md={24} lg={24}>
                        <Card style={{ height: 640 }}
                            title="轮播图片">
                            <Carousel autoplay >
                                {
                                    this.getRoundeImage(this.state.roundImage)
                                }
                            </Carousel>
                            <div className="lbdiv">
                            <Upload
                            action={API.IMAGE_UPLOAD}
                            listType="picture-card"
                            fileList={this.state.roundImage}
                            onChange={this.roundImageChange}
                            >
                            {this.state.roundImage.length > 3 ? null : uploadButton}
                            </Upload>
                        </div>
                        </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Card style={{ height: 242 }}
                                title="营销策略">
                                    <Select defaultValue={`${this.state.cl_id}`} style={{ width: 120 }} onChange={(e)=>{
                                        this.setState({cl_id:e})
                                    }}>
                                        <Option value="1">无营销策略</Option>
                                        <Option value="2">自定义</Option>
                                    </Select>
                                    &nbsp;&nbsp;&nbsp;
                                    {
                                        this.state.cl_id === "2" ?<Button type="primary"> 查看</Button>:null
                                    }
                            </Card>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                        title="产品信息">
                        
                        <div>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('id')(
                                        <Input type="hidden" />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="产品名称:"
                                    >
                                        {getFieldDecorator('name',{
                                            rules: [{ required: true, message: '产品名称不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="国家名称:"
                                    >
                                        {getFieldDecorator('country',{
                                            rules: [{ required: true, message: '国家名称不能为空..' }],
                                        })(
                                            <Select  style={{ width: '100%' }}>
                                                <Option value="TW">TW-台湾</Option>
                                                <Option value="MY">MY-马来</Option>
                                                <Option value="TH">TH-泰国</Option>
                                            </Select>
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="页面模板:"
                                    >
                                        {getFieldDecorator('templ',{
                                            rules: [{ required: true, message: '页面模板不能为空..' }],
                                        })(
                                            <Select  style={{ width: '100%' }}>
                                                <Option value="1">模板一</Option>
                                                <Option value="2">模板二</Option>
                                                <Option value="3">模板三</Option>
                                            </Select>
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="模板语言:"
                                    >
                                        {getFieldDecorator('lang',{
                                            rules: [{ required: true, message: '模板语言不能为空..' }],
                                        })(
                                            <Select  style={{ width: '100%' }}>
                                                <Option value="zh_TW">中文繁体</Option>
                                                <Option value="zh_CN">中文简体</Option>
                                                <Option value="th">泰语</Option>
                                                <Option value="en">英语</Option>
                                            </Select>
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="原价:"
                                    >
                                        {getFieldDecorator('o_price',{
                                            rules: [{ required: true, message: '原价不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="单价:"
                                    >
                                        {getFieldDecorator('price',{
                                            rules: [{ required: true, message: '单价不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="已经售出:"
                                    >
                                        {getFieldDecorator('sold',{
                                            rules: [{ required: true, message: '已经售出不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="评论数量:"
                                    >
                                        {getFieldDecorator('comment_num',{
                                            rules: [{ required: true, message: '评论数量不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="最大购买数量:"
                                    >
                                        {getFieldDecorator('max_buy_num',{
                                            rules: [{ required: true, message: '最大购买数量不能为空..' }],
                                        })(
                                            <Input />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="Facebook像素Id:"
                                    >
                                        {getFieldDecorator('facebook',{
                                            rules: [{ required: true, message: 'Facebook像素Id不能为空..' }],
                                        })(
                                            <Select mode="multiple" style={{ width: '100%' }} onChange={()=>{}}>
                                                <Option value="475864357">475864357</Option>
                                                <Option value="5435453">5435453</Option>
                                                <Option value="53454535">53454535</Option>
                                                <Option value="5345345">5345345</Option>
                                            </Select>
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="是否显示评论"
                                    >
                                        {getFieldDecorator('comment')(
                                            <Switch checkedChildren="是" unCheckedChildren="否"/> 
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="采购链接:"
                                    >
                                        {getFieldDecorator('purchase_url',{
                                            rules: [{ required: true, message: '采购链接不能为空..' }],
                                        })(
                                            <TextArea  rows={3} />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="产品简介:"
                                    >
                                        {getFieldDecorator('introduction',{
                                            rules: [{ required: true, message: '产品简介不能为空..' }],
                                        })(
                                            <TextArea  rows={3} />
                                        )}
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    label="备注信息:"
                                    >
                                        {getFieldDecorator('remark')(
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
                                <div className="typeimg">
                                    <Form onSubmit={this.handleSubmit}>
                                        {this.typeFormItem(getFieldDecorator,getFieldValue)}
                                        <Form.Item>
                                        <Button type="dashed" onClick={this.addTypeForm} style={{ width: '100%' }}>
                                            <Icon type="plus" /> 添加类别属性
                                        </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Card
                                title="尺码属性">
                                <div className="mainimg">
                                    <Form onSubmit={this.handleSubmit}>
                                        {this.sizeFormItem(getFieldDecorator,getFieldValue)}
                                        <Form.Item>
                                        <Button type="dashed" onClick={this.addSizeForm} style={{ width: '100%' }}>
                                            <Icon type="plus" /> 添加尺码属性
                                        </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                   <Col span={24}>
                   <Card title="产品详情">
                        <Editor apiKey='tiny'
                        initialValue={this.state.description}
                        init={{
                            height: 700,
                            plugins: plugins,
                            toolbar: toolbar,
                            object_resizing : false,
                            image_dimensions: false,
                            setup:editor=> {
                                this.setState({ editor });
                                let item = this;
                                editor.ui.registry.addButton('myimage', {
                                    text:'添加素材',
                                    onAction: function(){
                                        item.setState({ addImageVisible:true });
                                    }
                                }); 
                            }
                            
                        }} 
                        onChange={this.handleEditorChange}/>
                    </Card>
                   
                   </Col>
                </Row>
                <Button className='subBtn' onClick ={this.handleSubmit} type="primary">{this.state.isAdd?'添加':'编辑'}</Button>
                <Modal
                    title="添加素材"
                    visible={this.state.addImageVisible}
                    onOk={()=>{this.onDetailsSave(this.state.detailsImageList)}}
                    onCancel={()=>{this.setState({addImageVisible:false})}}
                    >
                        <Upload
                        action={API.IMAGE_UPLOAD}
                        listType="picture-card"
                        multiple={true}
                        fileList={this.state.detailsImageList}
                        onChange={this.detailsHandleChange}
                        >
                        {uploadButtonDatail}
                        </Upload>
                    </Modal>
            </div>
        )
    }
}
export default Form.create()(ProductInfoView);