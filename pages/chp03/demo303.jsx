import React, { Component } from 'react';
import { Route, Routes, useHistory} from 'react-router-dom';
import { reqdoSQL, myIsArray } from '../../api/functions.js';
import demo303a from './demo303a';
const spanStyle={
  border:'1px solid #95B8E7', 
  fontSize: 13, 
  display:'inline-block', 
  height: 250, 
  width: 290, 
  padding: '2px 2px 4px 8px', 
  margin: '8px 4px 8px 8px'
}

export default class Page303 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      data:[]
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.date='2019-8-31';
    p.sqlprocedure = 'demo303a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    console.log(rs.rows);
    this.setState({data: rs.rows});   
  }

  handleLink = (item) =>{
    //将商品编码和名称传递到新的子页面
    const params = new URLSearchParams();
    params.append('productid', item.productid);
    //params.append('productname', item.productname);
    params.append('row', JSON.stringify(item));
    //let params = JSON.stringify(item);
    //使用window.open打开一个新窗口
    //window.open('./demo303a', '_blank', 'width=500,height=500');
    //window.location.href = './demo303a';
    window.open(`/demo303a?${params.toString()}`, '_blank');
  }
  
  render(){  
    return (
      <div>
          {this.state.data.map((item, index) =>{
            //处理json列中存储的图片文件
            let src;
            let files = item.photopath;
            console.log(1111,files);
            if (files !== undefined && files !== ''){
              console.log(1112,files.slice(1, -1));
              files = eval(files.slice(1, -1));  //去掉外面包裹的双引号或单引号
              console.log(1113,files);
              if (myIsArray(files) && files.length>0) src = files[0].filename;
              src = '/myServer/' + src;
            } 
            return (<span key={"span_"+index} style={spanStyle}>
               <center><img src={src} style={{height:164}} /></center>
               <div><font color="red" size="3">{`￥${item.unitprice}`}</font></div>
		           <div>{item.productname+' '+item.quantityperunit}</div>
		           <div className="textdiv" style={{float:'left', width:180}}>{item.suppliername}</div>
               <div className="textdiv" style={{float:'right', width:85, marginRight:4}}>{item.region+'  '+item.city}</div>
               <div style={{clear:'both'}}></div>
		           <div style={{float:'left'}}>本月销量：{item.qty1}</div>
               <div style={{float:'right', marginRight:4}}>{' 累计销量：'}<a href="#" style={{textDecoration:'underline'}} onClick={(e)=>this.handleLink(item)}>{item.qty2}</a></div>
               <div style={{clear:'both'}}></div>
		        </span>)             
          })}
          {/* <Routes>
             <Route key="route_303a" path="demo303a/*" element={React.createElement(require("../chp03/demo303a").default)} />
          </Routes> */}
      </div>   
    )
  }
}

