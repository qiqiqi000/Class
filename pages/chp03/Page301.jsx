import React, { Component } from 'react'
import ajax from '../../api/ajax'
import { reqdoSQL } from '../../api/functions.js'
import '../../css/style.css';

export default class Page301 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      rowheight:32,
      data:[]
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo301';
    p.unitprice1=10;
    p.unitprice2=20;    
    const paramvalues = JSON.stringify(p)
    var url = '/myServer/doSQL?paramvalues='+paramvalues
    let rs=await ajax(url, {}, 'POST');  //使用与异步配套的await
    //const rs = await reqdoSQL(p); //调用函数，执行存储过程
    console.log(rs.rows);
    this.setState({data:rs.rows});   
  }
  
  render() { 
    return (
      <div style={{marginLeft:10}}>Demo301-axios调用后台数据库连接程序doSQL
      <hr/>
      <ul>
        {
          this.state.data.map((item,index) => {
            return (
              <div key={"p_"+index}><li key={"a_"+index}>{item.productid}&nbsp;{item.productname}</li>
              </div>

            )
          })
        }
      </ul>  
      </div>
    )
  }
}