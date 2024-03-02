import React, { Component } from 'react';
import { reqdoSQL, reqdoTree, myGetTextSize } from '../../api/functions.js';
//使用3种图表
//参考：https://blog.csdn.net/DcTbnk/article/details/107779422
const sys=React.sys;
var detailData = [];
var customerData = [];
var customerid ='';
export default class Page312 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      customerData: [],
      customerid: '',
      data: [],
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({customerData: rs.rows});    
    this.setState({customerid: rs.rows[0].customerid});
    //console.log(444,this.state.customerid, rs.rows[0].customerid);
    //this.getData(this.state.customerid);
    this.getDetailData(rs.rows[0].customerid);
    //this.getAllItems(this.state.customerid);
  }

  getData = async(customerid)=>{
    //直接生成嵌套ul+li
    let p={};
    p.customerid = customerid;
    p.sqlprocedure = 'demo312a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    /*第一种方法
    // rs.rows.forEach (async (item, index) => {这是一个使用forEach方法的循环，其中的回调函数是异步函数（通过async关键字定义）。在每次迭代中，它会异步执行回调函数，但不会等待一个迭代完成再开始下一个迭代。这意味着循环中的异步操作可能会交错执行，导致执行顺序不确定。这对于并发性较低的任务可能没有问题，但对于需要特定顺序的任务可能会有问题。
    // for (let i=0; i<rs.rows.length; i++) {...}:
    // 这是一个传统的for循环，不涉及异步操作。循环会按照同步的方式一次迭代一个元素，直到达到指定的条件。这确保了每次迭代都会等待上一次迭代完成，因此操作的顺序是可预测的和确定的。
    let data=[];
    //rs.rows.forEach (async(item, index) => {
    for (let i=0; i<rs.rows.length; i++){
      let item=rs.rows[i];
      let itemData= await this.getItems(item.orderid);
      console.log(item.orderid, itemData);
      data.push(
        <li key={item.orderid}>{'订单号'+item.orderid+', 订单日期'+item.orderdate}
          <ul>
             {itemData?.map((item1, index1)=><li key={item.orderid+'_'+item1.productid+'_'+index1}>
              {'商品名称：'+item1.productname+'，销售量：'+item1.quantity+'，销售额：'+item1.amount}</li>)}
          </ul>
       </li>
      )
    };
    */
    //第二种方法在map中使用promise.all
    let data= await Promise.all(rs.rows.map(async (item, index)=>{
      let itemData= await this.getItems(item.orderid);
      //console.log(item.orderid, itemData);
      return(
        <li key={item.orderid}>{'订单号：'+item.orderid+', 订单日期：'+item.orderdate+', 客户名称：'+item.companyname}
          <ul>
             {itemData?.map((item1, index1)=><li key={item.orderid+'_'+item1.productid+'_'+index1}>
              {'商品名称：'+item1.productname+'，销售量：'+item1.quantity+'，销售额：'+item1.amount}</li>)}
          </ul>
       </li>
      )
    }));

    console.log(data)
    this.setState({data});
  }
  
  getItems = async(orderid)=> {
    let p={};
    p.orderid=orderid;
    p.sqlprocedure = 'demo312b';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    return rs.rows;
    //this.setState({orderItemData:rs.rows});
  }

  getDetailData = async(customerid)=> {
    /*第一种方法
    //获取订单
    let p={};
    p.customerid = customerid;
    p.sqlprocedure = 'demo312a';
    let rs1 = await reqdoSQL(p); //调用函数，执行存储过程
    //一次性获取全部订单明细
    p.sqlprocedure = 'demo312c';
    let rs2 = await reqdoSQL(p); //调用函数，执行存储过程
    */
    //第二种方法，用promise.all合并两个reqdoDQL
    let p1={};
    p1.customerid = customerid;
    p1.sqlprocedure = 'demo312a';  //一次性获取一个客户的全部订单   
    let p2={};
    p2.customerid = customerid;
    p2.sqlprocedure = 'demo312c';  //一次性获取一个客户的全部订单明细
    const promises = [reqdoSQL(p1), reqdoSQL(p2)];    
    const [rs1, rs2] = await Promise.all(promises); //使用Promise.all等待它们都完成
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
  
  getAllItems = async(customerid)=> {
    //获取所有订单明细，并按订单号排序
    let p={};
    p.customerid = customerid;
    p.sqlprocedure = 'demo312c';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    let data = [];
    let rows = rs.rows;
    console.log(rows);
    let order = rows[0];
    let list = [];
    for (let i=0; i<rows.length; i++){
      if (order.orderid == rows[i].orderid){
        //同一个订单号时，添加一个<li>
        list.push(
          <li key={rows[i].orderid+'_'+rows[i].productid+'_'+i}>
            {'商品名称：'+rows[i].productname+'，销售量：'+rows[i].quantity+'，销售额：'+rows[i].amount}
          </li>
        );
      }else{
        //前后两个订单号不同时，把之前的订单明细做成一组<ul>+<li>，放在一个订单的<li>之内
        data.push(
          <li key={order.orderid}>{'订单号：'+order.orderid+'，订单日期：'+order.orderdate+'，客户名称：'+order.companyname}
            <ul>
              {list}
            </ul>
          </li>
        );
        list = [];
        order = rows[i];
      }
    }
    this.setState({data});
  }

  handleCustomerChange = (e)=>{
    //this.setState({customerid: e.target.value})
    //console.log(555,this.state.customerid)
    //this.getData(this.state.customerid);
    this.getDetailData(e.target.value);
    //this.getAllItems(this.state.customerid);
  }
  
  render(){  
    let {data, customerData, customerid} = this.state;
    console.log(999, detailData)
    return (
      <div style={{marginLeft:12, fontSize: sys.label.fontsize}}>
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