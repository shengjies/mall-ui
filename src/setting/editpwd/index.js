import React,{Component} from 'react'
import NProgress from 'nprogress'
import {
    Form, Input, Icon, Button,Upload,Modal
  } from 'antd';
import {Editor} from '@tinymce/tinymce-react'
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
        super(props);
        this.state={
            keys:[0,1,2],
            label:["434","3434"],
            fileList: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'http://127.0.0.1:8090/img/Ts1VZTCNSVa42KwfGuKIJA.jpg',
              }],
              editor:null,
              addImageVisible:false,
              imageList:[]
        }
    }
    handleChange = ({ file,fileList }) => {
        this.setState({ 
            imageList:fileList
         })
    };
    onSave=(list)=>{
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
        this.setState({imageList:[]})
    }
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
    
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    
      add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
          keys: this.state.keys,
        });
      }
    
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            alert(JSON.stringify(values));
          }
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
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const plugins = ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount']

          const toolbar = ['bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | blockquote undo redo removeformat subscript superscript code codesample',
  ' fontsizeselect forecolor backcolor | hr bullist numlist | link  charmap  table  anchor pagebreak   emoticons  | myimage  |']

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Passengers' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`label[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue:this.state.label[k],
              rules: [{
                required: true,
                whitespace: true,
                message: "请填写内容",
              }],
            })(
              <Input  style={{ width: '30%', marginRight: 8 }} />
              
            )}
            {getFieldDecorator(`value[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请填写内容",
              }],
            })(
              <Input  style={{ width: '30%', marginRight: 8 }} />
            )}
            <Upload
                action="http://localhost:8080/upload"
                listType="picture-card"
                fileList={this.state.fileList}
                >
                {this.state.fileList.length >= 3 ? null : uploadButton}
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
        );
      }
}
export default Form.create()(EditPwdView);