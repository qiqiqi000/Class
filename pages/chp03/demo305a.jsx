import React, { Component } from 'react';
import { reqdoSQL, reqdoTree, myGetTextSize } from '../../api/functions.js';
//参考：https://blog.csdn.net/DcTbnk/article/details/107779422
const sys=React.sys;
export default class Page313 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      data: [],
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.sqlprocedure = 'demo313a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({data:rs.rows})
    
  }


  
  render(){  
    return (
      <div style={{marginLeft:12, fontSize: sys.label.fontsize}}>
        <label for="customers">选择客户：</label>
        <select id="customers" className="comboboxStyle">
        {
        this.state.data.map((item, index)=><option key={item.value} value={item.value}>{item.label}</option>)
        }
        </select>
      </div>
    )
  }
}