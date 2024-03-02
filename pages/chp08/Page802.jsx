import { Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form,  Table, Layout, Radio , Modal} from 'antd'
import React, { Component } from 'react'
import { reqdoSQL, reqdoTree } from '../../api/functions'
//import '../../css/style.css';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
import { AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { mySetFormValues } from '../../api/functions.js'
import { AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined,PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview-cn/
//https://blog.csdn.net/weixin_45991188/article/details/108050424 

//参考：https://blog.csdn.net/DcTbnk/article/details/107779422
export default class Page802 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      data:[],
      orderData:[]
    };
    //this.showOrders=this.showOrders.bind(this);
  }

  showOrders = async (item) => {  //必须加异步
    localStorage.setItem('product', JSON.stringify(item));
    let p={};
    p.productid=item.productid;
    p.date='2019-11-11';
    p.sqlprocedure='demo302b';
    console.log(p);
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    console.log(rs.rows);
    let rows=rs.rows.map((item, index) => {
      return(<div key={"item_"+index}>{item.orderid+','+item.orderdate+','+item.amount}</div>);
    })
    this.setState({orderData:rows});    
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo302a';
    p.categoryid='B';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //console.log(rs.rows);

    p={};  //重新设置p为一个空对象
    p.categoryid='B';
    //p.selsctsql='select * from products where categoryid="'+p.categoryid+'"';
    p.selectsql=`select * from products where categoryid='${p.categoryid}'`;
    console.log(p.selectsql);
    rs = await reqdoSQL(p); //调用函数，执行一条查询语句
    console.log(rs.rows);
    this.setState({data:rs.rows});   
  }

  render(){  
    return (
      <div style={{marginLeft:10}}>Demo302-axios调用后台数据库存储过程
        <hr/>
          {/* 生成超链接及其点击事件，不能使用href  */
            this.state.data.map((item,index) => {
              return (
                <div key={"div_"+index}>
                  <a key={"a_"+index} href="#" onClick={() => this.showOrders(item, true)}> {item.productid}&nbsp;{item.productname}</a> 
                </div>
              )
            })
          }  
          <hr/>         
          <div>{this.state.orderData}</div> 
      </div>
    )
  }
}

