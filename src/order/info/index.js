import React,{Component} from 'react'
import { Row, Col,Input,Button,Select,Table,Modal,Form,message,Divider,DatePicker,Menu,
    Switch,Icon,Dropdown,notification,Popconfirm,Timeline,Popover,Tooltip} from 'antd'
import NProgress from 'nprogress'
import './index.css'
import HttpUtils from '../../http/HttpUtils';
import API from '../../api';
import moment from 'moment'
import AuthorUtils from '../../utils/AuthorUtils'
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const {TextArea} =Input;
const confirm = Modal.confirm;
let detalindex =0;
const mobileColumns = [{
    title: '订单编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '产品',
    dataIndex: 'productEntity.name',
    key: 'productEntity.name',
  }, {
    title: '客户名称',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
    render:(text,record)=>{
        if(!AuthorUtils.isAuthor("role_admin")){
            var new_mobile = record.mobile.substr(0, 3) + '********';
            return (new_mobile);
        }else{
            return (text);
        }
    }
  }];
  const ipColumns = [{
    title: '订单编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '产品',
    dataIndex: 'productEntity.name',
    key: 'productEntity.name',
  }, {
    title: '客户名称',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: 'Ip',
    dataIndex: 'ip',
    key: 'ip'
  }];
class orderInfoView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        this.findOrderInfo(0,50);
        this.initUser();
        NProgress.done();
    }
    constructor(props){
        super(props)
        let time = moment().subtract(0, 'days').format('YYYY-MM-DD');
        this.state={
            loading:false,
            orderData:[],
            total:0,
            page:1,
            pageSize:50,
            id:'',
            product_id:'',
            username:'',
            order_status:'',
            bTime:time,
            eTime:time,
            cg_status:'',
            country:'',
            wl_status:'',
            ck_status:'',
            user_id:'',
            mobile:'',
            //编辑信息
            orderVisible:false,
            is_edit:false,
            eorder_status:'0',
            typeData:[],//类型
            sizeData:[],//尺码
            type_value:[],
            size_value:[],
            num:[],
            userData:[],
            okLoading:false,
            /**操作 */
            actionsTitle:'',
            actionsVisible:false,
            edit_status:'1',
            actionLoading:false,
            selectKeys:[],
            /**物流信息 */
            wlVisible:false,
            wlBtnLoading:false,
            wlInfo:[],
            wlTitle:'',
            /** 电话 或 ip重复 */
            mobileData:[],
            mobileLoading:false,
            ipData:[],
            ipLoaing:false
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
        this.findOrderInfo(pagination.current - 1, pagination.pageSize);
    }
    /**
     * 表格显示总数
     */
    showTableTotal=(total)=>{
        return `总共 ${total} 条`;
    }
    /**
     * 分页查询
     */
    findOrderInfo=(page,size)=>{
        this.setState({loading:true})
        const data = new FormData();
        data.append("page",page);
        data.append("size",size);
        data.append("id",this.state.id);
        data.append("product_id",this.state.product_id);
        data.append("username",this.state.username);
        data.append("order_status",this.state.order_status);
        data.append("bTime",this.state.bTime);
        data.append("eTime",this.state.eTime);
        data.append("cg_status",this.state.cg_status);
        data.append("country",this.state.country);
        data.append("wl_status",this.state.wl_status);
        data.append("user_id",this.state.user_id);
        data.append("ck_status",this.state.ck_status);
        data.append("mobile",this.state.mobile);
        HttpUtils.post(API.ORDER_FIND,data)
        .then((result)=>{
            if(result.status === 200){
                this.setState({orderData:result.data.content,total:result.data.count});
            }else{
                message.error("操作异常",3);
            }
            this.setState({loading:false})
        }).catch((error)=>{
            this.setState({loading:false})
            message.error("操作异常",3);
        })
    }
    /**
     * 初始化详情
     */
    initDetal=(data)=>{
        var tds=[];
        data.map((item,index)=>{
        tds.push(<tr>
            <td>{item.attr_value}</td>
            <td>{item.attr_size}</td>
            <td>{item.num}</td>
            <td>{item.cattr_value}</td>
            <td>{item.cattr_size}</td>
            <td>{item.cnum == 0?'':item.cnum}</td></tr>)
        })
        var detal =<table border>
            <tr>
                <td>类型</td>
                <td>尺码</td>
                <td>数量</td>
                <td>确认类型</td>
                <td>确认尺码</td>
                <td>确认数量</td>
            </tr>
            {tds}
        </table>
        return detal;
    }
    /**
     * 初始化属性
     */
    initProductAttr=(id)=>{
        HttpUtils.get(API.PRODUCT_ATTR_BY_ID+id)
        .then((result)=>{
            if(result.status === 200){
                if(result.data.type){
                    var type =[];
                    for(let i =0;i<result.data.type.length;i++){
                        type.push(<Option key={result.data.type[i].type_value} value={result.data.type[i].type_value}>{result.data.type[i].type_value}</Option>)
                    }
                    this.setState({typeData:type})
                }
                if(result.data.size){
                    var size =[];
                    for(let i =0;i<result.data.size.length;i++){
                        size.push(<Option key={result.data.size[i].size_value} value={result.data.size[i].size_value}>{result.data.size[i].size_value}</Option>)
                    }
                    this.setState({sizeData:size})
                }
            }else{
                message.error("操作异常",3);
            }
        }).catch((error)=>{
            message.error("操作异常",3);
        })
    }
    /**
     * 移除
     */
    removeAttr = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    addAttr = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(detalindex++);
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
      /**
       * 表单提交
       */
      handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({okLoading:true})
                var data = new FormData();
                data.append("id", values.id);
                data.append("is_edit", this.state.is_edit);
                data.append("postzip",values.postzip);
                data.append("email", values.email);
                data.append("remark", values.remark);
                data.append("order_status",values.eorder_status);
                data.append("money",values.money);
                var attr =[];
                if(this.state.is_edit && values.keys && values.keys.length > 0 ){
                    for(let i =0 ;i < values.keys.length;i++){
                        var item ={};
                        if(values.type_value){
                            item.cattr_value = values.type_value[values.keys[i]];
                        }
                        if(values.size_value){
                            item.cattr_size = values.size_value[values.keys[i]];
                        }
                        if(values.num){
                            item.cnum = values.num[values.keys[i]];
                        }
                        attr.push(item);
                    }
                } 
                data.append("detal", JSON.stringify(attr));
                HttpUtils.post(API.ORDER_EDIT,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({orderVisible:false})
                        this.findOrderInfo(this.state.page-1,this.state.pageSize);
                    }else{
                        message.error("操作异常",3);
                    }
                    this.setState({okLoading:false})
                }).catch((error)=>{
                    message.error("操作异常",3);
                    this.setState({okLoading:false})
                })
            }
        });
      }
      /**
       * 初始化用户
       */
      initUser=()=>{
          if(!AuthorUtils.isAuthor("role_user") && !AuthorUtils.isAuthor("role_cg") ){
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
         if(!AuthorUtils.isAuthor("role_user")  && !AuthorUtils.isAuthor("role_cg")){
            return(
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Select placeholder="业务员" style={{ width: '100%' }}
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
       * 批量修改状态
       */
      actionStatus=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({actionLoading:true});
                const data = new FormData();
                data.append("edit_status",values.edit_status);
                data.append("estatus",values.estatus);
                data.append("edit_order",values.edit_order);
                HttpUtils.post(API.ORDER_EDIT_ACTIONS,data)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({actionsVisible:false});
                        if(result.data.exc){
                            notification['info']({
                                message: '操作提示',
                                description: result.data.exc,
                                duration:10
                              });
                        }
                        if(result.data.msg){
                            notification['info']({
                                message: '操作提示',
                                description: result.data.msg,
                                duration:10
                              });
                            this.findOrderInfo(this.state.page-1,this.state.pageSize)
                        }
                    }else {
                        message.error("操作异常",3)
                    }
                    this.setState({actionLoading:false});
                }).catch((error)=>{
                    message.error("操作异常",)
                    this.setState({actionLoading:false});
                })
            
            }
        })
      }
      /**
       * 采购状态
       */
      initCgStatus=(formItemLayout,getFieldDecorator)=>{
          return(
            <Form.Item
                {...formItemLayout}
                label="采购状态:"
                >
                {getFieldDecorator('estatus', {
                
                })(
                    <Select  placeholder="采购状态" 
                    style={{ width: '100%' }} >
                        <Option value="0">未采购</Option>
                        <Option value="1">已采购</Option>
                        <Option value="2">不采购</Option>
                        <Option value="3">入库</Option>
                        <Option value="4">出库</Option>
                    </Select>
                )}
            </Form.Item>
          )
      }
      /**
       * 收款状态
       */
      initSkStatus=(formItemLayout,getFieldDecorator)=>{
        return(
            <Form.Item
                {...formItemLayout}
                label="收款状态:"
                >
                {getFieldDecorator('estatus', {
                
                })(
                    <Select  placeholder="收款状态" 
                    style={{ width: '100%' }} >
                        <Option value="0">未收款</Option>
                        <Option value="1">已收款</Option>
                    </Select>
                )}
            </Form.Item>
          )
      }
      /**
       * 条件导出报表
       */
      conditionReport=(sign)=>{
        var params ={
            sign:sign,
            id:this.state.id,
            product_id:this.state.product_id,
            username:this.state.username,
            order_status:this.state.order_status,
            bTime:this.state.bTime,
            eTime:this.state.eTime,
            cg_status:this.state.cg_status,
            country:this.state.country,
            wl_status:this.state.wl_status,
            user_id:this.state.user_id,
            ck_status:this.state.ck_status,
            mobile:this.state.mobile,
            token:window.sessionStorage.getItem('token')
        }
        this.postExcelFile(params,API.ORDER_REPORT_CONDITION)
      }
      /**
       * 勾选导出
       */
      checklistReport=(sign)=>{
        var params ={
            sign:sign,
            checkedTest:JSON.stringify(this.state.selectKeys).replace("[","").replace("]",""),
            token:window.sessionStorage.getItem('token')
        }
        this.postExcelFile(params,API.ORDER_REPORT_CHECK)
      }
      postExcelFile=(params,url)=>{
        var form = document.createElement("form");
        form.style.display ="none";
        form.action = url;
        form.method = "post";
        document.body.appendChild(form);
        for(var key in params){
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }
        form.submit();
        form.remove();
    }
      onSelectChange=(k,r)=>{
       this.setState({
        selectKeys:k
       })
      }
    /**
     * 删除操作
     */
    del(record){
        if(AuthorUtils.isAuthor("role_admin")){
            return(
            <Popconfirm title="确认删除，数据无法恢复?" onConfirm={()=>{
                HttpUtils.get(API.ORDER_DEL+record.id)
                .then((result)=>{
                    if(result.status === 200){
                        message.success("操作成功",3);
                        this.setState({
                            page:1,
                            pageSize:50
                        })
                        this.findOrderInfo(0,50);
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
    /**
     * 查询物流信息
     */
    findWlInfo=(e)=>{
        var text ='';
        switch(e.wl){
            case 1:
            text ='超商'
            break;
            case 2:
            text ='黑猫';
            break;
            case 3:
            text ='全家';
            break;
        }
        text+=`,更新时间:${e.u_date},${e.track_msg}`;
        var title = `${text}`
        return title;
    }
    getWlInfoTimeLine=()=>{
        if(this.state.wlInfo && this.state.wlInfo.length >0){
            var wl =[];
            for(let i =0;i<this.state.wlInfo.length ;i++){
                var status ="未知";
                switch(this.state.wlInfo[i].state){
                    case 0:
                        status = "未发货";
                    break;
                    case 1:
                        status = "已发货";
                    break;
                    case 2:
                        status = "转运中";
                    break;
                    case 3:
                        status = "送到";
                    break;
                }
                wl.push(<Timeline.Item>
                    <div>{status +' '+this.state.wlInfo[i].date}</div>
                    <div>{this.state.wlInfo[i].details}</div>
                    </Timeline.Item>)
            }
            return(
                <Timeline>
                    {wl}
                </Timeline>
            )
        }else{
            return(
                <span>暂无物流信息</span>
            )
        }
    }
    /**
     * 电话重复
     */
    mobileInitData=(mobile)=>{
        this.setState({
            mobileLoading:true
        })
        HttpUtils.get(API.FIND_MOBILE_CF+mobile)
        .then((result)=>{
            if(result.status === 200){
                this.setState({
                    mobileLoading:false,
                    mobileData:result.data
                })
            }else{
                message.error("操作异常",3)
                this.setState({
                    mobileLoading:false,
                    mobileData:[]
                })
            }
        }).catch((error)=>{
            message.error("操作异常",3)
            this.setState({
                mobileLoading:false,
                mobileData:[]
            })
        })
    }
    initMobileTable=()=>{
        return(
            <Table dataSource={this.state.mobileData} size="small" scroll={{ x: 800 }}
             columns={mobileColumns}/>
        )
    }
    /**
     * ip重复
     */
    ipInitData=(ip)=>{
        this.setState({
            ipLoaing:true
        })
        HttpUtils.get(API.FIND_IP_CF+ip)
        .then((result)=>{
            if(result.status === 200){
                this.setState({
                    ipLoaing:false,
                    ipData:result.data
                })
            }else{
                message.error("操作异常",3)
                this.setState({
                    ipLoaing:false,
                    ipData:[]
                })
            }
        }).catch((error)=>{
            this.setState({
                ipLoaing:false,
                ipData:[]
            })
        })
    }
    initIpTable=()=>{
        return(
            <Table dataSource={this.state.ipData} size="small" scroll={{ x: 800 }}
             columns={ipColumns}/>
        )
    }
    render(){
        const columns=[
            {
                title: '订单编号',
                dataIndex: 'id',
                key: 'id',
                width:120,
                render:(text,record)=>{
                    if(record.ip_status === 1){
                        return(
                            <span style={{color:'red'}}>{text}</span>
                        )
                    }else{
                        return (text)
                    }
                }
            },
            {
                title: '参考信息',
                dataIndex: 'ck',
                key: 'ck',
                width:100,
                render:(text,record)=>{
                    if(record.dh_status != '0' && record.ip_status === 0){
                        return(
                            <Popover content="电话重复" title="电话重复"  trigger="click">
                                <Button type="primary" loading={this.state.mobileLoading} onClick={()=>{
                                    this.mobileInitData(record.mobile);
                                }} size="small">
                                    电话重复
                                </Button>
                            </Popover>
                        )
                    }else if(record.dh_status === 0 && record.ip_status === 1){
                        return(
                            <Popover content={this.initIpTable()} title="Ip重复" loading={this.state.ipLoaing} trigger="click">
                                <Button type="danger" size="small" onClick={()=>{
                                    this.ipInitData(record.ip);
                                }}>
                                     &nbsp; &nbsp;Ip重复&nbsp;&nbsp;
                                </Button>
                            </Popover>
                        )
                    }else if(record.dh_status === 1 && record.ip_status === 1){
                        return(
                            <span>
                                <Popover content={this.initMobileTable()} title="电话重复"  trigger="click">
                                    <Button type="primary" loading={this.state.mobileLoading} onClick={()=>{
                                        this.mobileInitData(record.mobile);
                                    }} size="small">
                                        电话重复
                                    </Button>
                                </Popover>
                                <br/>
                                <Popover content={this.initIpTable()} title="Ip重复" loading={this.state.ipLoaing} trigger="click">
                                <Button type="danger" size="small" onClick={()=>{
                                    this.ipInitData(record.ip);
                                }}>
                                   &nbsp; &nbsp;Ip重复&nbsp;&nbsp;
                                </Button>
                            </Popover>
                            </span>
                        )
                    }
                }
            },
            {
                title: '产品',
                dataIndex: 'productEntity.name',
                key: 'productEntity.name',
                width:100,
            },
            {
                title: '客户名称',
                dataIndex: 'username',
                key: 'username',
                width:100,
            },
            {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile',
                width:120,
                render:(text,record)=>{
                    if(!AuthorUtils.isAuthor("role_admin")){
                        var new_mobile = record.mobile.substr(0, 3) + '********';
                        return (new_mobile);
                    }else{
                        return (text);
                    }
                }
            },
            // {
            //     title: '国家',
            //     dataIndex: 'country',
            //     key: 'country',
            //     width:100,
            // },
            {
                title: '详细地址',
                dataIndex: 'addr',
                key: 'addr',
                width:300,
            },
            {
                title: '总数量',
                dataIndex: 'totla_num',
                key: 'totla_num',
                width:100,
            },
            {
                title: '详情',
                dataIndex: 'attrs',
                key: 'attrs',
                width:350,
                render:(text,e)=>{
                    return this.initDetal(text);
                }
            },
            {
                title: '支付金额',
                dataIndex: 'money',
                key: 'money',
                width:100,
            },
            {
                title: '业务员',
                dataIndex: 'userEntity.username',
                key: 'userEntity.username',
                width:100,
            },
            {
                title: '邮编',
                dataIndex: 'postzip',
                key: 'postzip',
                width:100,
            },
            {
                title: '确认邮编',
                dataIndex: 'cpostzip',
                key: 'cpostzip',
                width:100,
            },
            {
                title: 'Email',
                dataIndex: 'emaill',
                key: 'emaill',
                width:100,
            },
            {
                title: '留言',
                dataIndex: 'msg',
                key: 'msg',
                width:200,
            },
            {
                title: '赠品信息',
                dataIndex: 'male',
                key: 'male',
                width:200,
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '收款状态',
                dataIndex: 'ck_status',
                key: 'ck_status',
                width:100,
                render:(text,e)=>{
                    if(text === 1){
                        return(
                            <span style={{color:'green'}}>已收款</span>
                        )
                    }else{
                        return("未收款")
                    }
                }
            },
            {
                title: '派送方式',
                dataIndex: 'ps',
                key: 'ps',
                width:100,
                render:(text,e)=>{
                    if(text === "roc_qj"){
                        return("全家")
                    }else if(text ==="roc_711"){
                        return("711")
                    }else{
                        return("货到付款")
                    }
                }
            },
            {
                title: '订单状态',
                dataIndex: 'order_status',
                key: 'order_status',
                width:100,
                fixed: 'right',
                render:(t,e)=>{
                    if(t === 0){
                        return(
                            <span style={{color:'blue'}}>待确认</span>
                        )
                    }else if(t === 1){
                        return(
                            <span style={{color:'green'}}>已确认</span>
                        )
                    }else if(t === 2){
                        return(
                            <span style={{color:'red'}}>已取消</span>
                        )
                    }else if(t === 3){
                        return("需再次确认")
                    }
                }
            },
            {
                title: '采购状态',
                dataIndex: 'cg_status',
                key: 'cg_status',
                width:100,
                fixed: 'right',
                render:(t,e)=>{
                    if(t === 0){
                        return("未采购")
                    }else if(t === 1){
                        return(
                            <span style={{color:'green'}}>已采购</span>
                        )
                    }else if(t === 2){
                        return(
                            <span style={{color:'red'}}>不采购</span>
                        )
                    }else if(t === 3){
                        return("入库")
                    }else if(t === 4){
                        return("出库")
                    }
                }
            },
            {
                title: '物态',
                dataIndex: 'wl_status',
                key: 'wl_status',
                width:140,
                fixed: 'right',
                render:(t,e)=>{
                    if(t === -1){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>未知</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                            return("未知")
                        }
                       
                    }else if(t === 1){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>已发货</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return(
                            <span style={{color:'green'}}>已发货</span>
                        )}
                    }else if(t === 2){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>派送中</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("派送中")
                        }
                    }else if(t === 3){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>Peding</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("Peding")
                        }
                    }else if(t === 4){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>拒收</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("拒收")
                        }
                    }else if(t === 5){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>已退回</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("已退回")
                        }
                    }else if(t === 6){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span style={{color:'green'}}>签收</span><br/>
                                    
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return(
                            <span style={{color:'green'}}>签收</span>
                        )
                        }
                    }else if(t === 7){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>退回仓库</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("退回仓库")
                        }
                    }else if(t === 8){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>达到门市</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("达到门市")
                        }
                    }else if(t === 9){
                        if(e.trackingnumber){
                            return(
                                <div>
                                     <span style={{color:'red'}}>退货退款</span><br/>
                                     <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return(
                            <span style={{color:'red'}}>退货退款</span>
                        )
                        }
                    }else if(t === 10){
                        if(e.trackingnumber){
                            return(
                                <div>
                                    <span>查询不到</span><br/>
                                    <Tooltip placement="top"  title={this.findWlInfo(e)}>
                                        <Button  size="small" type="primary">{e.trackingnumber}</Button>
                                    </Tooltip>
                                </div>
                            )
                        }else{
                        return("查询不到")
                        }
                    }
                }
            },
            {
                title: '修改时间',
                dataIndex: 'up_date',
                key: 'up_date',
                width:100,
                fixed: 'right',
            },
            {
                title: '时间',
                dataIndex: 'c_date',
                key: 'c_date',
                width:100,
                fixed: 'right',
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
                                this.initProductAttr(record.productEntity.id);
                                this.props.form.resetFields();
                                this.setState({
                                    orderVisible:true,
                                    is_edit:false
                                })
                                const { setFieldsValue } = this.props.form;
                                setFieldsValue({
                                    "id":record.id,
                                    "eorder_status": `${record.order_status}`,
                                    "postzip":record.postzip,
                                    "email":record.emaill,
                                    "remark":record.remark,
                                    "money":record.money
                                });
                                var keys =[],type_value =[],size_value =[],num=[];
                                if(record.attrs){
                                    for(detalindex =0;detalindex<record.attrs.length;detalindex++){
                                        keys.push(detalindex);
                                        type_value.push(record.order_status!==1?record.attrs[detalindex].attr_value:record.attrs[detalindex].cattr_value);
                                        size_value.push(record.order_status!==1?record.attrs[detalindex].attr_size:record.attrs[detalindex].cattr_size);
                                        num.push(record.order_status !==1?record.attrs[detalindex].num:record.attrs[detalindex].cnum);
                                    }
                                    setFieldsValue({
                                        keys: keys,
                                    });
                                    this.setState({
                                        type_value:type_value,
                                        size_value:size_value,
                                        num:num
                                    })
                                }
                            }}>编辑</a>
                             <Divider type="vertical"/>
                             <a href="javascript:void(0);" onClick={()=>{
                                window.open(`${record.priview_url}`);
                            }}>预览</a><br/>
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
        const { getFieldDecorator,getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
        <Form.Item  className="attr_form"
            {...formItemLayout}
            label=""
            required={false}
            key={k}
        >
            {getFieldDecorator(`type_value[${k}]`, {
                 initialValue:this.state.type_value[k],
            validateTrigger: ['onChange', 'onBlur'],
            })(
                <Select placeholder="类型" style={{ width: '28%', marginRight: 8 }} allowClear={true}>
                    {this.state.typeData}
                </Select>
            )}
            {getFieldDecorator(`size_value[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue:this.state.size_value[k],
            })(
            <Select placeholder="尺码" style={{ width: '28%', marginRight: 8 }} allowClear={true}>
                {this.state.sizeData}
            </Select>
            )}
            {getFieldDecorator(`num[${k}]`, {
                 initialValue:this.state.num[k],
            validateTrigger: ['onChange', 'onBlur'],
            })(
            <Input placeholder="数量 " style={{ width: '28%', marginRight: 8 }} />
            )}
            {keys.length > 0 ? (
            <Icon
                style={{ fontSize: '28px' }}
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeAttr(k)}
            />
            ) : null}
        </Form.Item>
        ));

        const rowSelection = {
            onChange: this.onSelectChange,
          };
        const menu = (
            <Menu onClick={(e)=>{
                this.props.form.resetFields();
                if(e.key === '1'){
                    this.setState({
                        actionsTitle:'批量修改状态',
                        actionsVisible:true,
                        edit_status:'1'
                    });
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        "edit_status":'1',
                        "estatus":'0'
                    })
                }else if(e.key === '2'){
                    const t = this;
                    confirm({
                        title: '提示信息',
                        content: '是否需要导出详情?',
                        onOk() {
                          t.conditionReport(1)//导出
                        },
                        onCancel() {
                            t.conditionReport(0)//不导出
                        },
                      });
                }else if(e.key === '3'){
                    if(this.state.selectKeys.length<=0){
                        message.info("请至少选择一行");
                        return;
                       
                    }
                    const t = this;
                    confirm({
                        title: '提示信息',
                        content: '是否需要导出详情?',
                        onOk() {
                          t.checklistReport(1)//导出
                        },
                        onCancel() {
                            t.checklistReport(0)//不导出
                        },
                      });
                }
            }}>
              <Menu.Item key="1">批量修改状态</Menu.Item>
              <Menu.Item key="2">条件导出</Menu.Item>
              <Menu.Item key="3">勾选导出</Menu.Item>
            </Menu>
          );
        return(
            <div style={{backgroundColor:"#fff"}}>
                <div className='example-input'>
                    <Row>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="订单编号" onChange={(e)=>{
                                this.setState({
                                    id:e.target.value
                                })
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="产品" onChange={(e)=>{
                                this.setState({name:e === undefined?'':e.target.value})
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="客户名称" onChange={(e)=>{
                                    this.setState({
                                        username:e.target.value
                                    })
                            }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Select placeholder="订单状态" style={{ width: '100%' }}
                            allowClear={true}
                             onChange={(e)=>{
                                this.setState({order_status:e === undefined?'':e})
                            }}>
                                <Option value="0">待确认</Option>
                                <Option value="1">已确认</Option>
                                <Option value="2">已取消</Option>
                                <Option value="3">需再确认</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                        <RangePicker defaultValue={[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]}
                         format={dateFormat} onChange={(e,srt)=>{
                           this.setState({
                               bTime:srt[0],
                               eTime:srt[1]
                           })
                        }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                        <Select placeholder="采购状态" style={{ width: '95%' }}
                            allowClear={true}
                             onChange={(e)=>{
                                this.setState({cg_status:e === undefined?'':e})
                            }}>
                                <Option value="0">未采购</Option>
                                <Option value="1">已采购</Option>
                                <Option value="2">不采购</Option>
                                <Option value="3">入库</Option>
                                <Option value="4">出库</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row className="table-margin-top">
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select placeholder="物流状态" style={{ width: '95%' }}
                            allowClear={true}
                             onChange={(e)=>{
                                this.setState({wl_status:e === undefined?'':e})
                            }}>
                                <Option value="-1">未知</Option>
                                <Option value="1">已发货</Option>
                                <Option value="2">派送中</Option>
                                <Option value="3">Peding</Option>
                                <Option value="4">拒收</Option>
                                <Option value="5">已退回</Option>
                                <Option value="6">签收</Option>
                                <Option value="7">退回仓库</Option>
                                <Option value="8">达到门市</Option>
                                <Option value="9">退货退款</Option>
                                <Option value="10">查询不到</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                        <Select placeholder="收款状态" style={{ width: '95%' }}
                            allowClear={true}
                             onChange={(e)=>{
                                this.setState({ck_status:e === undefined?'':e})
                            }}>
                                <Option value="0">未收款</Option>
                                <Option value="1">已收款</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Input placeholder="手机号码" onChange={(e)=>{
                                    this.setState({
                                        mobile:e.target.value
                                    })
                            }} />
                        </Col>
                        {this.initUserSelect()}
                        <Col xs={24} sm={12} md={8} lg={4}>
                        <Button type="primary" icon="search" onClick={()=>{
                            this.setState({page:1,pageSize:50});
                            this.findOrderInfo(0,50);
                        }}>查询</Button>
                        &nbsp;&nbsp;
                        <Dropdown overlay={menu}>
                            <Button type="primary">
                                操作 <Icon type="down" />
                            </Button>
                        </Dropdown>
                        </Col>
                    </Row>
                </div>
                <div className="table-margin-top">
                <Table size="small"  loading={this.state.loading} rowKey="id" bordered columns={columns}
                            dataSource={this.state.orderData} scroll={{ x: 3200, y: 520 }} row
                            rowSelection={rowSelection}
                            pagination={{
                                total: this.state.total, defaultCurrent: 1, defaultPageSize: 50,
                                current: this.state.page, pageSize: this.state.pageSize,
                                showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'],
                                showTotal: this.showTableTotal
                            }}
                            onChange={this.infoTableChange} />
                </div>
                <Modal
                className="attr_modal"
                title="编辑信息"
                maskClosable={false}
                visible={this.state.orderVisible}
                onCancel={()=>{
                    this.setState({orderVisible:false})
                }}
                footer={[
                    // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
                    <Button key="attr" type="primary" disabled={!this.state.is_edit} onClick={this.addAttr}>添加详情</Button>,
                    <Button key="cancel" onClick={()=>{
                        this.setState({orderVisible:false})
                    }}>取消</Button>,
                    <Button key="ok" type="primary" loading={this.state.okLoading} 
                    onClick={this.handleSubmit}>确认</Button>
                     ]}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="订单状态:"
                            >
                            {getFieldDecorator('eorder_status', {
                               
                            })(
                                <Select placeholder="订单状态" 
                                 style={{ width: '100%' }} >
                                    <Option key='0' value='0'>待确认</Option>
                                    <Option key='1' value='1'>已确认</Option>
                                    <Option key='2' value="2">已取消</Option>
                                    <Option key='3' value="3">需再确认</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="编辑详情:"
                            >
                            {getFieldDecorator('is_edit', {
                            })(
                                <Switch checked={this.state.is_edit} checkedChildren="开" unCheckedChildren="关" onChange={(e)=>{
                                   this.setState({is_edit:e})
                                }}  />
                            )}
                        </Form.Item>
                        {this.state.is_edit?formItems:''}
                        <Form.Item
                            {...formItemLayout}
                            label="邮编:"
                            >
                            {getFieldDecorator('postzip', {
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="金额:"
                            >
                            {getFieldDecorator('money', {
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Email:"
                            >
                            {getFieldDecorator('email', {
                            })(
                                    <Input  />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="备注:"
                            >
                            {getFieldDecorator('remark', {
                            })(
                                    <TextArea  rows={4} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 操作模块 */}
                <Modal
                maskClosable={false}
                title={this.state.actionsTitle}
                visible={this.state.actionsVisible}
                confirmLoading={this.state.actionLoading}
                onOk={this.actionStatus}
                onCancel={()=>{
                    this.setState({
                        actionsVisible:false
                    })
                }}
                >
                <Form onSubmit={this.actionStatus} className="login-form">
                        <Form.Item
                            {...formItemLayout}
                            label="修改状态:"
                            >
                            {getFieldDecorator('edit_status', {
                               
                            })(
                                <Select  placeholder="修改状态" onChange={(e)=>{
                                    this.setState({edit_status:e});
                                    const { setFieldsValue } = this.props.form;
                                    setFieldsValue({
                                        "estatus":'0'
                                    })
                                }}
                                 style={{ width: '100%' }} >
                                    <Option key="1" value="1">采购状态</Option>
                                    <Option key="2" value="2">收款状态</Option>
                                </Select>
                            )}
                        </Form.Item>
                        {this.state.edit_status==='1'?this.initCgStatus(formItemLayout,getFieldDecorator):this.initSkStatus(formItemLayout,getFieldDecorator)}
                        <Form.Item
                            {...formItemLayout}
                            label="订单编号:"
                            >
                            {getFieldDecorator('edit_order', {
                               
                            })(
                                <TextArea rows={5} placeholder="订单编号,一行一个订单编号"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                {/** 物流信息 */}
                <div className="wl">
                <Modal
                className="wl"
                 maskClosable={false}
                title={this.state.wlTitle}
                visible={this.state.wlVisible}
                okText="关闭"
                onCancel={()=>{
                    this.setState({
                        wlVisible:false
                    })
                }}
                footer={[
                    // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
                    <Button key="ok" type="primary"
                    onClick={()=>{
                        this.setState({
                            wlVisible:false
                        })
                    }}>关闭</Button>
                     ]}
                >
                {this.getWlInfoTimeLine()}
                </Modal>
                </div>
            </div>
        )
    }
}
export default Form.create()(orderInfoView)