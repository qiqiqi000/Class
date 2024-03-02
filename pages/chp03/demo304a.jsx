import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
//import tableStyle from '../../css/table.module.css';
const sys=React.sys;
const tableStyle = {};
tableStyle.cell = {  /*单元格样式，用于实例304、307表格设置*/  
  backgroundColor: '#ffffff',
  padding: '0px 4px 0px 4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '14px',
  textOverflow: 'ellipsis',
  border: '1px solid #ddd'
}
tableStyle.cellDisabled = {  /*单元格样式，用于实例304、307表格设置*/  
  backgroundColor: '#f2f2f2',
  padding: '0px 4px 0px 4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '14px',
  textOverflow: 'ellipsis',
  border: '1px solid #ddd'
}

tableStyle.fixedHeader = {  /*固定列的标题css*/
  position: 'sticky', 
  backgroundColor: '#f2f2f2', 
  textAlign: 'center',
  fontSize: '14px',
  padding: '0px 4px 0px 4px',
  fontFamily: '楷体',
  border: '1px solid #ddd'
}

tableStyle.header = {  /*固定列的标题css*/
  backgroundColor: '#f2f2f2', 
  textAlign: 'center',
  padding: '0px 4px 0px 4px',
  fontSize: '14px',
  fontFamily: '楷体',
  border: '1px solid #ddd'
}

/* 表格光标悬停时 */
tableStyle.link = {
  textDecoration: 'none',
  padding: '4px 8px 5px 4px',
  borderRadius: '4px',
  color: 'black' 
}

tableStyle.hover = {
  color: 'blue'  /* 悬停时链接的文字颜色  */
}

tableStyle.container = {
  position: 'relative',
  overflow: 'scroll',
  height: '100%'
}

// .table-body-container {
//   /*max-height: 400px; */
//   width: 100%;
// }

tableStyle.body = {
  tableLayout: 'fixed',
  width: '100%',
  borderCollapse: 'collapse'
}

const buttonStyle={
  paddingTop: '4px',
  border: '1px solid #ccc',
  height: '26px',
  width: '36px',
  borderRadius: '5px',
  cursor: 'pointer' 
}

export default class Page304 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      rowheight: 32,
      columns:[
        {"title":"序号", "field":"_rownumber", "width":50, align:"center"},
        {"title":"订单编号", "field":"orderid", "width":80, datatype:'d'},
        {"title":"订单日期", "field":"orderdate", "width":95, datatype:'d'},
        {"title":"商品编码", "field":"productid", "width":80, datatype:'d'},
        {"title":"商品名称", "field":"productname", "width":250},
        {"title":"规格型号", "field":"quantityperunit", "width":150},
        {"title":"计量单位", "field":"unit", "width":80},
        {"title":"商品类别", "field":"categoryname", "width":120},
        {"title":"供应商编码", "field":"supplierid", "width":100},
        {"title":"供应商名称", "field":"suppliername", "width":240},
        {"title":"销售数量", "field":"quantity", "width":80, datatype:'n'},
        {"title":"销售单价", "field":"unitprice", "width":80, datatype:'n'},
        {"title":"折扣率", "field":"discount", "width":70, datatype:'n'},
        {"title":"销售金额", "field":"amount", "width":90, datatype:'n'}
      ],
      data:[],
      total:0,  //总行数
      pageno:1,  //第几页
      pagesize:20,  //每页显示行数
      pagecount:0,
      customerData:[],  //客户下拉框数据集
      yearData:['2018','2019','全部'],   //年份下拉框数据集
      monthData:[1,2,3,4,5,6,7,8,9,10,11,12,'全部']  //月份下拉框数据集
    };
  }
  async componentDidMount(){ //初始状态时提取第1页数据
    let p={};
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    let {pageno, pagesize}=this.state;
    this.setState({customerData: rs.rows}, ()=>this.loadTablePage(pageno, pagesize));
  }

  loadTablePage = async (pageno, pagesize) =>{
    let xyear=document.getElementById('xyear').value;
    let xmonth=document.getElementById('xmonth').value;
    let customerid=document.getElementById('customerid').value;
    let p={};
    p.sqlprocedure = 'demo304b';
    p.customerid=customerid;
    p.pageno=pageno;
    p.pagesize=pagesize;
    p.xyear=xyear;
    p.xmonth=xmonth;
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算行序号，并添加一列_rownumber
    let rows = [];
    let total = rs.rows.length>0 ? rs.rows[0]._total : 0;
    Object.assign(rows, rs.rows);
    rows.forEach(function(item, index){
      //使用forEach循环遍历数据,计算行序号
      rows[index]._rownumber = index+1+(pageno-1)*pagesize;  //不能把_rownumber改成_rowno
    });
    let pagecount=parseInt((total-1)/pagesize)+1;
    //console.log(110,pageno,pagecount,rows.length);
    this.setState({data: rows, total, pageno, pagesize, pagecount});
  }

  handleClick = async (id) => { //bbbbbbutton
    //let id = e.target.id;
    let pageno=this.state.pageno;
    let pagesize=this.state.pagesize;
    let total=this.state.total;
    let pagecount=parseInt((total-1)/pagesize)+1;
    if (id==='first') pageno=1;
    else if (id==='last') pageno=pagecount;
    else if (id==='prev' && pageno>1) pageno--;
    else if (id==='next' && pageno<pagecount) pageno++;
    else if (id==='ok') pageno=1;  //确定键，重新开始
    this.loadTablePage(pageno, this.state.pagesize);
  }

  render() {
    let {pageno, pagecount} =this.state;
    return (
      <div className="layout-body">        
        <div className="layout-top" style={{fontSize:14, borderBottom:'1px solid #95B8E7', height:35, paddingTop:3, paddingLeft:12, backgroundColor:"#E0ECFF"}}>
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
          <button id='cmbtnok' className='buttonStyle' onClick={(e)=>this.handleClick('ok')} style={{width:60, height:28, marginLeft:10}}>确定</button>
        </div>

        <div className="layout-middle" >
          <div className='table-container'>
            <table className='table table-head'>
              <thead>
                <tr style={{height: this.state.rowheight}}>
                  {this.state.columns.map((key, index) => (
                   <th key={'header_' + index} className='labelStyle' style={{fontSize:14, width: key.width, minWidth:key.width, textAlign:'center'}}>{key.title}</th>
                  ))}
                </tr>
              </thead>
            </table>
            <div className='table-body-container'>
              <table className='table table-body' >
                <tbody>
                {this.state.data.map((row, rowindex)=>
                  <tr key={"row_"+rowindex} style={{height: this.state.rowheight, backgroundColor:'#efefef'}}>
                    {this.state.columns.map((item, colindex)=> {
                      let align='left';
                      let fontname='宋体';
                      if (item.datatype=='n' || item.datatype=='d' || colindex==0){
                        fontname='times new roman';
                        align='right';
                      }
                      if (item.datatype=='d' || item.field==='_rownumber'){
                        align='center';
                      }
                      if (item.align) align=item.align;
                      return(<td key={"cell_"+rowindex+"_"+colindex} className='cellStyle' 
                       style={{width: item.width, textAlign: align, fontFamily: fontname}}>
                       {row[item.field]}
                      </td>)}
                    )}
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="layout-bottom" style={{borderTop:'1px solid #ccc', height:36, paddingTop:4, paddingLeft:20 }}>
          <button id="btnfirst" cursor={pageno<=1? 'auto':'pointer'} style={buttonStyle} onClick={(e)=>this.handleClick('first')}><img width="14" src={pageno>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  style={buttonStyle} disabled={pageno<=1? true:false} onClick={(e)=>this.handleClick('prev')}><img width="14" src={pageno>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  style={buttonStyle} onClick={(e)=>this.handleClick('next')}><img width="14" src={pageno<pagecount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  style={buttonStyle} onClick={(e)=>this.handleClick('last')}><img width="14" src={pageno<pagecount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button>
          <label id="message" style={{marginLeft:20, marginTop:0, fontSize:14, fontFamily:"times new roman"}}>第{this.state.pageno}页，共{parseInt((this.state.total-1)/this.state.pagesize)+1}页。当前第{(this.state.pageno-1)*this.state.pagesize+1}行~{Math.min(this.state.total,this.state.pageno*this.state.pagesize)}行，共{this.state.total}行。</label>
        </div>        
      </div>
    );
  }
}
