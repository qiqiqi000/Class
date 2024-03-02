import React, { Component } from 'react';
import { reqdoSQL, reqdoTree } from '../../api/functions.js';

//参考：https://blog.csdn.net/DcTbnk/article/details/107779422

export default class Page306 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      data:[]
    };
    //this.showOrders=this.showOrders.bind(this);
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo306a';
    let rs = await reqdoTree(p); //调用函数，执行存储过程
    this.setState({data:rs.rows});
  }

   generateTree(data) {
    if (data==undefined || data.length==0) return null;
    console.log(data)
    return (
      <ul>
        {data.map(node => (
          <li key={node.id}>
            {node.text}
            {node.children!=undefined && node.children.length > 0 && this.generateTree(node.children)}
          </li>
        ))}
      </ul>
    );
  }
  
  render(){  
    let {data}= this.state;
    return (
      <div style={{marginLeft:10}}>
        {this.generateTree(data)}
      </div>
    )
  }
}

