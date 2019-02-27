import React,{Component} from 'react'
import NProgress from 'nprogress'
import { Form, Input, Icon,Select, Button,Upload,Modal,Switch } from 'antd';
  import HttpUtils from '../../http/HttpUtils';
  import API from '../../api';
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const Option = Select.Option;
let id = 0;
let zpindex =0;
 class EditPwdView extends Component{
    constructor(props){
      super(props)
      this.state={
        visible:false,
        zpuqkey:-1,
        zpname:[],
        zpnum:[]
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
      remove1 = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const zpkeys = form.getFieldValue('zpkeys');
        // We need at least one passenger
        if (zpkeys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          zpkeys: zpkeys.filter(key => key !== k),
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
      add2 = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('zpkeys');
        const nextKeys = keys.concat(zpindex++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          zpkeys: nextKeys,
        });
      }
    
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var param={};
            if(values.keys){
                var item =[];
                values.keys.map((i,index)=>{
                  var a ={
                    tcname:values.tcname[i],
                    tcnum:values.tcnum[i],
                    tcmoney:values.tcmoney[i],
                    tcattr:values.tcattr[i],
                    tczp:values.tczp[i]
                  }
                  item.push(a);
                })
                param.tc = item;
            }
            console.log('Received values of form: ', param);
          }
        });
      }

      handleSubmit1 =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if(!err){
            if(values.zpkeys){
              var item =[];
              values.zpkeys.map((i,index)=>{
                var a ={
                  zpname:values.zpname[i],
                  zpnum:values.zpnum[i]
                }
                item.push(a);
              })
              const { form } = this.props;
              const tczp = form.getFieldValue('tczp');
              tczp[this.state.zpuqkey] = item
              form.setFieldsValue({
                'tczp':tczp
              });
              this.setState({visible:false})
            }
          }
        })
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
            {getFieldDecorator(`tcname[${k}]`, {
              validateTrigger: ['onChange', 'onBlur']
            })(
              <Input placeholder="套餐名称" style={{ width: '20%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`tcnum[${k}]`, {
              validateTrigger: ['onChange', 'onBlur']
            })(
              <Input placeholder="总数量" style={{ width: '8%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`tcmoney[${k}]`, {
              validateTrigger: ['onChange', 'onBlur']
            })(
              <Input placeholder="总金额" style={{ width: '8%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`tczp[${k}]`, {
              validateTrigger: ['onChange', 'onBlur']
            })(
              <Input type="hidden" style={{ width: '8%', marginRight: 8 }} />
            )}
            {getFieldDecorator(`tcattr[${k}]`)(
                <Switch defaultChecked={true} checkedChildren="显示属性" unCheckedChildren="不显示属性" defaultChecked />
            )}
            {
                <Button type="primary" size="small" onClick={()=>{
                  this.setState({
                    zpname:[],
                    zpnum:[],
                    zpuqkey:k
                  })
                  getFieldDecorator('zpkeys', { initialValue: [] });
                  zpindex =0;
                  const { form } = this.props;
                  form.setFieldsValue({
                    zpkeys: [],
                  });
                  const tczp = getFieldValue('tczp');
                  if(tczp.length >0 && tczp[k]){
                    var zpkeys =[],zpname=[],zpnum=[];
                    tczp[k].map((i,index)=>{
                      if(i){
                        zpkeys.push(zpindex);
                        zpname.push(i.zpname);
                        zpnum.push(i.zpnum);
                        zpindex++;
                      }
                    })
                    this.setState({
                      zpname:zpname,
                      zpnum:zpnum,
                    })
                    form.setFieldsValue({
                      zpkeys: zpkeys,
                      zpname:zpname,
                      zpnum:zpnum,
                    });
                  }
                  this.setState({visible:true})
                }}>赠品</Button>
            }
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
        getFieldDecorator('zpkeys', { initialValue: [] });
        const zpkeys = getFieldValue('zpkeys');
        const zpItems = zpkeys.map((k, index) => (
        <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '赠品' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`zpname[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue:this.state.zpname[k],
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空...",
              }]
            })(
              <Select allowClear={true}  placeholder="赠品" style={{ width: '50%', marginRight: 8 }}>
                <Option key="1" value="1">赠品1</Option>
                <Option key="2" value="2">赠品2</Option>
                <Option key="3" value="3">赠品3</Option>
                <Option key="4" value="4">赠品4</Option>
              </Select>
            )}
            {getFieldDecorator(`zpnum[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue:this.state.zpnum[k],
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空...",
              }]
            })(
              <Input placeholder="总数量"  style={{ width: '40%', marginRight: 8 }} />
            )}
            {zpkeys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={zpkeys.length === 1}
                onClick={() => this.remove1(k)}
              />
            ) : null}
          </Form.Item>
        ))
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
            <Modal
              maskClosable={false}
              title="赠品信息"
              visible={this.state.visible}
              onOk={this.handleSubmit1}
              onCancel={()=>{this.setState({visible:false})}}
            >
              <Form onSubmit={this.handleSubmit1}>
              {zpItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={this.add2} style={{ width: '90%' }}>
                    <Icon type="plus" /> 添加赠品
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
      }
}
export default Form.create()(EditPwdView);