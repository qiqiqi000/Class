import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import '../../css/style.css';
const colStyle={
  paddingLeft:'4px',  
  backgroundColor: '#ffffff',
  whiteSpace:'nowrap',
  overflowY: 'hidden',
  fontSize: 14,
  textOverflow:'ellipsis'
};
const buttonStyle={
  height: '28px',
  width: '60px'
};

export default class Page305 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      columns:[
        {"title":"序号", "field":"rowno", "width":60},
        {"title":"订单编号", "field":"orderid", "width":80},
        {"title":"订单日期", "field":"orderdate", "width":95},
        {"title":"商品编码", "field":"productid", "width":80},
        {"title":"商品名称", "field":"productname", "width":250},
        {"title":"规格型号", "field":"quantityperunit", "width":150},
        {"title":"计量单位", "field":"unit", "width":80},
        {"title":"销售单价", "field":"unitprice", "width":80},
        {"title":"销售数量", "field":"quantity", "width":80},
        {"title":"销售金额", "field":"amount", "width":90}
      ],
      data:[],
      total:0,  //总行数
      pageno:1,  //第几页
      pagesize:20,  //每页显示行数
      pagecount:0,
      customerData:[],  //客户下拉框数据集
      yearData:['2018','2019'],   //年份下拉框数据集
      monthData:[1,2,3,4,5,6,7,8,9,10,11,12]  //月份下拉框数据集
    };
  }
    
  
  async componentDidMount(){ //初始状态时提取第1页数据
    let p={};
    p.sqlprocedure = 'demo305a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({customerData: rs.rows});    
    let {pageno, pagesize}=this.state;
    this.loadTablePage(pageno, pagesize); 
  }

  loadTablePage = async (pageno,pagesize) =>{
    let xyear=document.getElementById('xyear').value;
    let xmonth=document.getElementById('xmonth').value;
    let customerid=document.getElementById('customerid').value;
    let p={};
    p.sqlprocedure = 'demo305b';
    p.customerid=customerid;
    p.pageno=pageno;
    p.pagesize=pagesize;
    p.xyear=xyear;
    p.xmonth=xmonth;
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算行序号，并添加一列rowno
    let rows=[];
    Object.assign(rows, rs.rows);
    rows.forEach(function(item, index){ //使用forEach循环遍历数据,计算行序号
      rows[index].rowno=index+1+(pageno-1)*pagesize;
    });
    this.setState({data: rows, total: rs.rows.length>0? rs.rows[0].total:0, pageno, pagesize});
  }

  handleClick = async (e) => { //bbbbbbutton
    let id = e.target.id;
    let pageno=this.state.pageno;
    let pagesize=this.state.pagesize;
    let total=this.state.total;
    let pagecount=parseInt((total-1)/pagesize)+1;
    console.log(111,pageno,pagecount,total);
    if (id==='btnfirst') pageno=1;
    else if (id==='btnlast') pageno=pagecount;
    else if (id==='btnprior' && pageno>1) pageno--;
    else if (id==='btnnext' && pageno<pagecount) pageno++;
    else if (id==='btnok') pageno=1;  //确定键，重新开始
    console.log(222,pageno,pagecount,total);
    this.loadTablePage(pageno, this.state.pagesize);   
  }

  render() {
    //使用table标签以表格形式显示json中的数据 
    return (<>
      <div className="app-container">        
        <div className="top-section" style={{height:33, backgroundColor:"#f0f2f5", marginLeft:10, marginTop:4}}>
           &nbsp;&nbsp;选择客户：
           <select key="customerid" id="customerid" style={{width:'240px', height:'28px'}}>
             {this.state.customerData.map((item, index) => {
               return (<option key={`customerid_${item.customerid}`} value={item.customerid}>{item.customerid+' '+item.companyname}</option>);
             })}
           </select>&nbsp;&nbsp;选择年份：
           <select key="xyear" id="xyear" style={{width:'80px', height:'28px'}}>
             {this.state.yearData.map((item, index) => {
               return (<option key={"year_"+item}>{item}</option>);
             })}
           </select>&nbsp;&nbsp;选择月份：
           <select key="xmonth" id="xmonth" style={{width:'60px', height:'28px'}}>
              {this.state.monthData.map((item, index) => {
               return (<option key={"month_"+item}>{item}</option>);
            })}
          </select>
          <button id='cmbtnok' onClick={this.handleClick.bind(this)} style={{width:72, height:28, marginLeft:10}}>确定</button>        
        </div>
       
        <div className="middle-section" style={{border:"1px solid #E0ECFF", backgroundColor: '#ffffff'}}>
          <table cellSpacing="0" border="1px solid #ccc" style={{display:'block', margin:'1px 2px 1px 2px'}}>
              <thead style={{position: 'sticky', top: '0.9px', backgroundColor: '#f0f0f0', outline:'1.2px solid #ccc'}}>
                <tr className='labelStyle' style={{height:34, fontSize:14}}>
                  {this.state.columns.map((item, index)=>
                  <th key={"head_"+index} style={{width:item.width, minWidth:item.width, textAlign:'center'}}>{item.title}</th>
                  )}
                </tr>
              </thead> 
              <tbody style={{border:"1px solid #ccc" }}>
                {this.state.data.map((row, rowindex)=>
                  <tr key={"row_"+rowindex} style={{height: 30, backgroundColor:'#efefef'}}>
                    {this.state.columns.map((item, colindex)=>
                      <td key={"col_"+rowindex+"_"+colindex} style={colStyle}>{row[item.field]}</td>
                    )}
                  </tr>
                )}
              </tbody>
          </table>         
        </div>

        <div className="bottom-section" style={{border:'1px solid #95B8E7', height:34, paddingTop:2 }}>
          <button id="btnfirst" style={buttonStyle} onClick={this.handleClick.bind(this)} >首页</button>
          <button id="btnnext" style={buttonStyle} onClick={this.handleClick.bind(this)} >下一页</button>
          <button id="btnprior" style={buttonStyle} onClick={this.handleClick.bind(this)} >上一页</button>
          <button id="btnlast" style={buttonStyle} onClick={this.handleClick.bind(this)} >尾页</button>
          <label id="message" style={{marginLeft:20, fontSize:14, fontFamily:"times new roman"}}>第{this.state.pageno}页，共{parseInt((this.state.total-1)/this.state.pagesize)+1}页。当前第{(this.state.pageno-1)*this.state.pagesize+1}行~{Math.min(this.state.total,this.state.pageno*this.state.pagesize)}行，共{this.state.total}行。</label>
        </div>
     </div>
    </>)
  }
}

