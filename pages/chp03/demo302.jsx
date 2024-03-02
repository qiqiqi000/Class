import React, { Component } from 'react'
import ajax from '../../api/ajax'
import { reqdoSQL } from '../../api/functions.js'
import { MyInput, MyCombobox } from '../../api/common.js';

export default class Page302 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {      
      categoryData: [],
      productData:[],
      orderData: [],
      selectedProduct: {},
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo302a';    
    var url = '/myServer/doSQL?paramvalues=' + JSON.stringify(p)
    let rs = await ajax(url, {}, 'POST');  //使用与异步配套的await    
    console.log(11,rs.rows);
    //this.setState({categoryData: rs.rows});  //无效
    this.categoryid.setState({items:rs.rows, value:rs.rows[0].value});  //除items之外，同时必须强制给控件赋初值value
  }

  handleClick = async() => {
    console.log(111,this.categoryid.state.value);
    //第一种方法
    let p={};
    p.sqlprocedure = 'demo302b';
    p.categoryid = this.categoryid.state.value;
    const rs = await reqdoSQL(p); //调用函数，执行存储过程
    //第二种方法(不推荐)
    // let p={};
    // p.selectsql=`select * from products where categoryid="${this.categoryid.state.value}"`;
    // const rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({productData:rs.rows});
  }

  // triggerChange = (newValue) => {
  //   console.log(991,this.categoryid, newValue);
  //   if (!this.categoryid) return;
  //   this.categoryid.target.value = newValue; // 更新下拉框的值
  //   const event = new Event('change', { bubbles: true });
  //   this.categoryid.target.dispatchEvent(event); // 分发事件
  //   console.log(999,this.categoryid, newValue);
  // };
 
  showOrders = async (item) => {  //必须加异步
    let p={};
    p.productid = item.productid;
    p.date1 = this.orderdate1.state.value;
    p.date2 = this.orderdate2.state.value;
    p.sqlprocedure='demo302c';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    let rows=rs.rows.map((item, index) => {
      return(<li key={"item_"+index}>
        <span style={{display:'inline-block', width:70}}>{item.orderid}</span>
        <span style={{display:'inline-block', width:100}}>{item.orderdate}</span>
        <span style={{display:'inline-block', width:200}}>{item.companyname}</span>
        <span style={{display:'inline-block', width:70}}>{item.quantity}</span>
        <span style={{display:'inline-block', width:70}}>{item.unitprice}</span>
        <span style={{display:'inline-block', width:70}}>{item.amount}</span>
      </li>);
    })
    this.setState({orderData: rows, selectedProduct: item});    
  }

  render() { 
    return (
    <div>
      <div style={{height:30, marginLeft:10, marginTop:10}}>Axios调用后台数据库连接程序doSQL<hr/></div>      
        <div style={{height:30, position:'relative'}}>
          <MyCombobox id="categoryid" ref={ref=>this.categoryid=ref} label="商品类别" labelwidth="75" width="120" className='selectStyle' top="5" left="24" items={this.state.categoryData} />
          <MyInput id="orderdate1" ref={ref=>this.orderdate1=ref} type="date" label="日期区间" labelwidth="75" top="5" left="240" height="28" width="110" value="2018-12-01" />
          <MyInput id="orderdate2" ref={ref=>this.orderdate2=ref} type="date" label="——" labelwidth="35" top="5" left="435" height="28" width="110" value="2018-12-31" />
          <button id="btnlast" style={{position:'absolute', top:5, left:600, height:28, width:70}} onClick={this.handleClick}>确定</button>
        </div>
        <hr/>
        <div style={{padding:10, marginTop:10, border:'1px solid #95B8E7', height:200, overflow:'auto'}}>
          {this.state.productData.map((item,index) => {
              return (
                <div key={"div_"+index}>
                  <a key={"a_"+index} href="#" onClick={()=> this.showOrders(item)}>{item.productid}&nbsp;{item.productname}</a>
                </div>
              )})
          }    
        </div>
        <div style={{padding:10, marginTop:10, border:'1px solid #95B8E7', height:260, overflow:'auto'}}>
          <div><b>{this.state.selectedProduct.productname}</b>订单信息（共***条）</div>
          <hr/>
          <ol>
            {this.state.orderData}
          </ol>
        </div>
      </div>      
    )
  }
}