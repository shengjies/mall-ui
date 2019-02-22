import React,{Component} from 'react'
import NProgress from 'nprogress'
import {
    Form, Input, Icon, Button,Upload,Modal
  } from 'antd';
  import HttpUtils from '../../http/HttpUtils';
  import API from '../../api';
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
let id = 0;
 class EditPwdView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }
    handleEditorChange=(e)=>{
        
    }
    constructor(props){
      super(props)
      this.state={
        fileList:[],
      }
    }
    remove = (k) => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }
  
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    }
  
    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }
    handleChange =({file,fileList,event})=>{
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
    getUploadButton=(k)=>{
      if(this.state.fileList[k]){
        return this.state.fileList[k].length >= 1?null:uploadButton;
      }else{
        return uploadButton;
      }
    }
    onRemoveImage=(file)=>{
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
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      
      const formItems = keys.map((k, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Passengers' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`tlabel[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "不能为空",
            }],
          })(
            <Input placeholder="passenger name" style={{ width: '15%', marginRight: 8 }} />
          )}
          {getFieldDecorator(`tvalue[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "不能为空",
            }],
          })(
            <Input placeholder="passenger name" style={{ width: '15%', marginRight: 8 }} />
          )}
          {getFieldDecorator(`timg[${k}]`, {
            validateTrigger: ['onChange', 'onBlur']
          })(
            <Input   style={{ width: '10%', marginRight: 8 }} />
          )}
          <Upload
              action={API.IMAGE_UPLOAD}
              listType="picture-card"
              data={{key:k}}
              fileList={this.state.fileList[k]}
              onChange={this.handleChange}
              onRemove={this.onRemoveImage}
            >
            {this.getUploadButton(k)}
          </Upload>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ));
      return (
        <div>
          <Form onSubmit={this.handleSubmit}>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
          
        </div>
      );
    }
}
export default Form.create()(EditPwdView);