import React,{Component} from 'react'
import {Row, Col,Card,Icon,Tooltip,Tabs,Button} from 'antd'
import './index.css'
const TabPane = Tabs.TabPane;
export default class MainView extends Component{
    render(){
        const operations = <Button>Extra Action</Button>;
        return(
            <div className="main">
                <Row>
                    <Col className="cell-padding" xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Card>
                            <div>
                                <span>总销售额</span>
                                <span className="card-info">
                                <Tooltip placement="top" title="指标说明">
                                        <Icon type="info-circle" />
                                </Tooltip>
                                </span>
                            </div>
                            <div className="card-centent">
                                <span className="money">￥123,563</span>
                            </div>
                        <div>
                            <span>同周比</span>
                            <span>同日比</span>
                        </div>
                        <p>Card content</p>
                        </Card>
                    </Col>
                    <Col className="cell-padding" xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Card>
                            <div>
                                <span>支付笔数</span>
                                <span className="card-info">
                                <Tooltip placement="top" title="指标说明">
                                        <Icon type="info-circle" />
                                </Tooltip>
                                </span>
                            </div>
                            <div className="card-centent">
                                <span className="money">6,360</span>
                            </div>
                        <div>
                            <span>同周比</span>
                            <span>同日比</span>
                        </div>
                        <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
                <Row>
                  <Col className="cell-padding" span={24}>
                    <Card>
                        <Tabs tabBarExtraContent={operations}>
                            <TabPane tab="总销售额" key="1">总销售额</TabPane>
                            <TabPane tab="支付笔数" key="2">支付笔数</TabPane>
                        </Tabs>
                     </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}