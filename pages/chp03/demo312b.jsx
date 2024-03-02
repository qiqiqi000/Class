import React, { Component } from 'react';
import { reqdoSQL, reqdoTree, myGetTextSize } from '../../api/functions.js';
//使用3种图表
//参考：https://blog.csdn.net/DcTbnk/article/details/107779422
const sys=React.sys;
var detailData = [];
var customerData = [];
var customerid ='';
var counter=100;
customerData=[
  {
      "customerid": "AHDTSM",
      "companyname": "顶天商贸有限公司"
  },
  {
      "customerid": "AHPPSP",
      "companyname": "盼盼食品有限公司"
  },
  {
      "customerid": "AHWMGW",
      "companyname": "物美购物中心河沙商场"
  },
  {
      "customerid": "AHXGLS",
      "companyname": "香格利食品有限公司"
  },
  {
      "customerid": "AHYZYL",
      "companyname": "杨鑫饮料配送中心"
  },
  {
      "customerid": "BJHFGY",
      "companyname": "汇丰广元商贸有限公司"
  },
  {
      "customerid": "BJHKTC",
      "companyname": "恒康天诚贸易商行"
  },
  {
      "customerid": "BJHLLG",
      "companyname": "好利来工贸有限公司"
  },
  {
      "customerid": "BJHYDS",
      "companyname": "汇运达食品饮料销售中心"
  },
  {
      "customerid": "BJLCWT",
      "companyname": "龙池威特商贸公司"
  }
];

export default class Page312 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
    };
    //this.setCustomerSelectItems();
    //this.getDetailData(customerData[0].customerid);
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    // let p={};
    // p.sqlprocedure = 'demo304a';
    // let rs = await reqdoSQL(p); //调用函数，执行存储过程
    // customerid = rs.rows[0].customerid;
    // customerData = rs.rows;
    // this.getDetailData(rs.rows[0].customerid);
    //this.setCustomerSelectItems();
  }

  setCustomerSelectItems = async ()=>{
    let p={};
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    customerid = rs.rows[0].customerid;
    customerData = rs.rows;
    console.log('loaddata from mysql:', rs.rows);
    //this.getDetailData(rs.rows[0].customerid);
  }

  getDetailData = async(customerid)=> {
    let p={};
    p.customerid = customerid;
    p.sqlprocedure = 'demo312a';
    let rs1 = await reqdoSQL(p); //调用函数，执行存储过程
    //一次性获取全部订单明细
    p.sqlprocedure = 'demo312c';
    let rs2 = await reqdoSQL(p); //调用函数，执行存储过程
    let data = [];
    let rows1 = rs1.rows;
    let rows2 = rs2.rows;
    console.log(rows1);
    console.log(rows2);
    for (let i=0; i<rows1.length; i++){
      //过滤出这个订单的明细销售记录
      let items = rows2.filter((item)=>item.orderid == rows1[i].orderid);
      let html = items.map((item, index)=>
        <li key={rows1[i].orderid+'_'+rows1[i].productid+'_'+index}>
          {'商品名称：'+item.productname+'，销售量：'+item.quantity+'，销售额：'+item.amount}
        </li>
      );
      data.push(
        <li key={rows1[i].orderid}>{'订单号：'+rows1[i].orderid+'，订单日期：'+rows1[i].orderdate+'，客户名称：'+rows1[i].companyname}
          <ul>
            {html}
          </ul>
        </li>
      );
   }
   detailData = [...data];
   //this.setState({data});
  }

  handleCustomerChange = (e)=>{
    this.getDetailData(e.target.value);
    console.log('detailData=', detailData);
  }
  
  handleClick= async ()=>{
    counter++;
    console.log('counter= '+counter);
    this.setCustomerSelectItems();
    console.log('customerData=', customerData);
  }

  render(){
    //this.setCustomerSelectItems();
    setTimeout(() => {
      //console.log(999,customerData);
      //console.log(999, detailData);
    }, 1000);
    
    return (
      <div style={{marginLeft:12, fontSize: sys.label.fontsize}}>
        <div>counter={counter}</div>
        <button onClick={this.handleClick}>递增</button>
        <div>
        <select id='customerid' onChange={this.handleCustomerChange} className='comboboxStyle' style={{width: 200}}>
            {customerData.map(item => <option key={item.customerid} value={item.customerid}>{item.companyname}</option>)}
          </select>
        </div>
        <ul>
          {detailData}
        </ul>
      </div>
    )
  }
}