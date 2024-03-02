import React, { Component, useRef } from 'react'
import { Layout, LayoutPanel, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton, MenuItem } from 'rc-easyui';
import { MyTextBox, MyDefTextBox, Timer, Weather} from '../../api/easyUIComponents.js';
import { reqdoSQL } from '../../api/functions.js';
import axios from 'axios';
const titleStyle = {
  textAlign: 'center',
  marginTop: '10px'
}

const rowheight=42;
export default class Page404 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      customerData :[],
      orderData: [],
      city: '杭州',
      weather: {}
    };
    //this.showOrders=this.showOrders.bind(this);
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    //获取某个城市的天气信息
    let city = this.state.city;
    axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${encodeURIComponent(city)}`).then(res => {
      const {data: {data: {forecast: [weather]}}} = res;
      this.setState({weather: Object.assign({}, weather)});      
    });
    let p={};
    p.sqlprocedure='demo305a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    this.setState({customerData:rs.rows});   
    this.handleClick(rs.rows[0], null);
  }

  async handleClick(row, e) {
    console.log(row);
    //console.log(this.refs);
    //document.getElementById('customerid').value=row.customerid;  //不能这样用
    //this.customerid.setState({xvalue: row.customerid});
    //this.companyname.setState({xvalue: row.companyname});
    for (var key in row) {
      //let obj=document.getElementById(key);
      //if (obj != null) this.refs[key].setState({xvalue: row[key]});
      //if (this[key]) this[key].setState({value: row[key]});      
      this[key]?.setState({value: row[key]});  //问号与.之间不能有空格，与if语句功能相似
    }
    let p={};
    p.sqlprocedure='demo404a';
    p.customerid=row.customerid;
    p.xyear=2019;
    p.xmonth=10;
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    this.setState({orderData: rs.rows});
  }

  My2Json = (id, label, labelwidth, top, left, height, width, value, style) => { 
    let p = { id, label, labelwidth, top, left, height, width, value, style }; //转成json
    return p;
  }

  handleChange(name, value) {  //同一个函数，用name来区分
    let data = Object.assign({}, this.state.customer);
    data[name] = value;
    this.setState({customer: data });
  }

  render() {
    let p1=MyDefTextBox('customerid','客户编码', 72, 20+0*rowheight, 20, 0, 200,'','');
    let p2=MyDefTextBox('companyname','客户名称', 72, 20+1*rowheight, 20, 0, 510,'','');
    let p3=MyDefTextBox('region','所属省份', 72, 20+2*rowheight, 20, 0, 200,'','');
    let p4=MyDefTextBox('city','所在城市', 72, 20+2*rowheight, 330, 0, 200,'','');
    let p5=MyDefTextBox('address','客户地址', 72, 20+3*rowheight, 20, 0, 510,'','');
    //let p6=MyDefTextBox('contactname','联系人',   72, 20+4*rowheight, 20, 0, 200,'','');
    //let p7=MyDefTextBox('phone','联系电话', 72, 20+4*rowheight, 330,0, 200,'','');    
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{ height: 34 }}>
            <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
              <Label className="labelStyle" style={{marginLeft:10, width:80}}>工具栏：</Label>
              <LinkButton style={{width:68}} iconCls="addIcon" plain iconAlign="left">新增</LinkButton>
              <LinkButton style={{width:68}} iconCls="editIcon" plain>修改</LinkButton>
              <LinkButton style={{width:68}} iconCls="deleteIcon" plain>删除</LinkButton>
              <LinkButton style={{width:68}} iconCls="saveIcon" plain>保存</LinkButton>
              <LinkButton style={{width:68}} iconCls="helpIcon" plain>帮助</LinkButton>
            </div>
          </LayoutPanel>
          <LayoutPanel region="south" style={{ height: 30 }}>
            <div style={{marginLeft:20, marginTop:4, float:'left'}}> 
              <Timer/>
            </div>
            <div style={{marginRight:20, marginTop:4, float:'right'}}>{this.state.city+'，'+this.state.weather.type+'，'+this.state.weather.high+'，'+this.state.weather.low+'，'+this.state.weather.fengxiang}</div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width: 280 }} split={true}>
            <div>
              {
               this.state.customerData.map((item, index) => {
                  return (
                    <LinkButton key={'btn_'+item.customerid} onClick={this.handleClick.bind(this, item)} style={{width:255}} plain>{item.customerid+item.companyname}</LinkButton>
                  )  
                })
              }
            </div>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <div>
              <Layout style={{ width: '100%', height: '100%', position:'absolute' }}>
                <LayoutPanel region="north" style={{ height: 240 }} split={true}>
                  <MyTextBox attr={p1} ref={ref => this.customerid = ref} />
                  <MyTextBox attr={p2} ref={ref => this.companyname = ref} />
                  <MyTextBox attr={p3} ref={ref => this.region = ref} />
                  <MyTextBox attr={p4} ref={ref => this.city = ref} />
                  <MyTextBox attr={p5} ref={ref => this.address = ref} />
                  <MyTextBox attr={MyDefTextBox('contactname','联系人',   72, 20+4*rowheight, 20, 0, 200,'','')} ref={ref => this.contactname = ref} />
                  <MyTextBox attr={MyDefTextBox('phone','联系电话', 72, 20+4*rowheight, 330,0, 200,'','')} ref={ref => this.phone = ref} />
                </LayoutPanel>
                <LayoutPanel region="center" style={{height: '100%'}}>
                <ul>
                {
                 this.state.orderData.map((item, index) => {
                    return (
                      <li key={'li_'+item.orderid+'_'+index}>{item.orderid+' '+item.orderdate+' '+item.productname+' '+item.amount}</li>
                    )  
                  })
                }                  
                </ul>
                </LayoutPanel>
              </Layout>            
            </div>
          </LayoutPanel>
        </Layout>
      </div>              
    )
  }
}