import React,{Component} from 'react'
import {Row, Col,Card,Icon,Tooltip,Tabs,Button} from 'antd'
import {Chart,Geom,Axis,Tooltip as ChartTooltip} from 'bizcharts'
import './index.css'
const TabPane = Tabs.TabPane;
export default class MainView extends Component{
    render(){
        const operations = <Button>Extra Action</Button>;
        const data1 = [
            {
              month: "2015-01-01",
              acc: 84.0
            },
            {
              month: "2015-02-01",
              acc: 14.9
            },
            {
              month: "2015-03-01",
              acc: 17.0
            },
            {
              month: "2015-04-01",
              acc: 20.2
            },
            {
              month: "2015-05-01",
              acc: 55.6
            },
            {
              month: "2015-06-01",
              acc: 56.7
            },
            {
              month: "2015-07-01",
              acc: 30.6
            },
            {
              month: "2015-08-01",
              acc: 63.2
            },
            {
              month: "2015-09-01",
              acc: 24.6
            },
            {
              month: "2015-10-01",
              acc: 14.0
            },
            {
              month: "2015-11-01",
              acc: 9.4
            },
            {
              month: "2015-12-01",
              acc: 6.3
            }
          ];
        const cols1 = {
            month: {
              alias: "月份"
            },
            acc: {
              alias: "积累量"
            }
          };
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
                            <TabPane tab="报表一" key="1">
                            <div>
                                <Chart height={400} data={data1} scale={cols1} forceFit>
                                <Axis
                                    name="month"
                                    title={null}
                                    tickLine={null}
                                    line={{
                                    stroke: "#E6E6E6"
                                    }}
                                />
                                <Axis
                                    name="acc"
                                    line={false}
                                    tickLine={null}
                                    grid={null}
                                    title={null}
                                />
                                <ChartTooltip />
                                <Geom
                                    type="line"
                                    position="month*acc"
                                    size={1}
                                    color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
                                    shape="smooth"
                                    style={{
                                    shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
                                    shadowBlur: 60,
                                    shadowOffsetY: 6
                                    }}
                                />
                                </Chart>
                            </div>
                            </TabPane>
                            <TabPane tab="报表二" key="2">报表二</TabPane>
                        </Tabs>
                     </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}