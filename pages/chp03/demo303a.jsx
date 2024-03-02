import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { reqdoSQL } from '../../api/functions.js'

export default class Page303a extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      data: [],
      row: {},
    };
  }

  async componentDidMount(){
    //从sessionstorage中获取数据
    const queryString = window.location.search;
    // 使用 URLSearchParams 解析参数
    const urlParams = new URLSearchParams(queryString);
    // 获取参数值
    const productid = urlParams.get('productid');
    const productname = urlParams.get('productname');
    const row = JSON.parse(urlParams.get('row'));
    console.log(666,row);
    let p={};
    p.productid = productid;
    p.date='2019-08-31';
    p.sqlprocedure = 'demo303b';
    const rs = await reqdoSQL(p); //调用函数，执行存储过程
    //console.log(999,rs.rows);
    this.setState({data: rs.rows, row});
  }

  handleClick=(e)=>{
    //const history = useHistory();
    let id=e.target.id;
    if (id==='btnclose'){ 
      window.close();
    } else if (id==='btnhome'){
      window.history.back();
    }
  }

  render() { 
    return (<div style={{overflow:'hidden', display: 'flex', flexDirection:'column', height:'100%'}}>
      <div style={{overflow:'hidden', height:40, marginLeft:10, marginTop:10, boxSizing:'border-box'}}>
        <b>{this.state.row.productname}</b>销售明细记录
        <button id="btnhome" style={{marginLeft: 40, height: 28, width: 70}} onClick={this.handleClick.bind(this)}>返回主页</button>
        <button id="btnclose" style={{marginLeft: 10, height: 28, width: 70}} onClick={this.handleClick.bind(this)}>关闭</button>
        <hr/>
      </div>
      <div style={{marginTop:6, overflow:'auto', flex:1}}>
        <ol>
          {this.state.data.map((item, index) => 
            <li key={"item_"+index}>
              <span style={{display:'inline-block', width:70}}>{item.orderid}</span>
              <span style={{display:'inline-block', width:100}}>{item.orderdate}</span>
              <span style={{display:'inline-block', width:80}}>{item.customerid}</span>
              <span style={{display:'inline-block', width:200}}>{item.companyname}</span>
              <span style={{display:'inline-block', width:70}}>{item.quantity}</span>
              <span style={{display:'inline-block', width:70}}>{item.unitprice}</span>
              <span style={{display:'inline-block', width:70}}>{item.amount}</span>
            </li>
          )}
        </ol>
      </div>
    </div>)
  }
}