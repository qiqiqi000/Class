import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import tableStyle from '../../css/table.module.css';
const sys=React.sys;
// tableStyle.cell = {  /*单元格样式，用于实例304、307表格设置*/  
//   backgroundColor: '#ffffff',
//   padding: '0px 4px 0px 4px',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   fontSize: '14px',
//   textOverflow: 'ellipsis',
//   border: '1px solid #ddd'
// }
// tableStyle.cellDisabled = {  /*单元格样式，用于实例304、307表格设置*/  
//   backgroundColor: '#f2f2f2',
//   padding: '0px 4px 0px 4px',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   fontSize: '14px',
//   textOverflow: 'ellipsis',
//   border: '1px solid #ddd'
// }

// tableStyle.fixedHeader = { 
//   position: 'sticky', 
//   backgroundColor: '#f2f2f2', 
//   textAlign: 'center',
//   fontSize: '14px',
//   padding: '0px 4px 0px 4px',
//   fontFamily: '楷体',
//   border: '1px solid #ddd'
// }

// tableStyle.header = { 
//   backgroundColor: '#f2f2f2', 
//   textAlign: 'center',
//   padding: '0px 4px 0px 4px',
//   fontSize: '14px',
//   fontFamily: '楷体',
//   border: '1px solid #ddd'
// }

// /* 表格光标悬停时 */
// tableStyle.link = {
//   textDecoration: 'none',
//   padding: '4px 8px 5px 4px',
//   borderRadius: '4px',
//   color: 'black' 
// }

// tableStyle.hover = {
//   color: 'blue' 
// }

// tableStyle.container = {
//   position: 'relative',
//   overflow: 'scroll',
//   height: '100%'
// }

// // .table-body-container {
// //   /*max-height: 400px; */
// //   width: 100%;
// // }

// tableStyle.body = {
//   tableLayout: 'fixed',
//   width: '100%',
//   borderCollapse: 'collapse'
// }

const pagingButtonStyle={
  paddingTop: '4px',
  border: '1px solid #ccc',
  height: '28px',
  width: '32px',
  borderRadius: '5px',
  // cursor: 'pointer' 
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
      pageNumber:1,  //第几页
      pageSize:20,  //每页显示行数
      pageCount:0,
      customerData:[],  //客户下拉框数据集
      yearData:['2018','2019','全部'],   //年份下拉框数据集
      monthData:[1,2,3,4,5,6,7,8,9,10,11,12,'全部']  //月份下拉框数据集
    };
  }
  
  async componentDidMount(){ //初始状态时提取第1页数据
    let p={};
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    let {pageNumber, pageSize}=this.state;
    this.setState({customerData: rs.rows}, ()=>this.loadTablePage(pageNumber, pageSize));
  }

  loadTablePage = async (pageNumber, pageSize) =>{
    let xyear=document.getElementById('xyear').value;
    let xmonth=document.getElementById('xmonth').value;
    let customerid=document.getElementById('customerid').value;
    let p={};
    p.sqlprocedure = 'demo304b';
    p.customerid=customerid;
    p.pageno=pageNumber;
    p.pagesize=pageSize;
    p.xyear=xyear;
    p.xmonth=xmonth;
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算行序号，并添加一列_rownumber
    let rows = [];
    let total = rs.rows.length>0 ? rs.rows[0]._total : 0;
    Object.assign(rows, rs.rows);
    rows.forEach(function(item, index){
      //使用forEach循环遍历数据,计算行序号
      rows[index]._rownumber = index+1+(pageNumber-1)*pageSize;  //不能把_rownumber改成_rowno
    });
    let pageCount=parseInt((total-1)/pageSize)+1;
    //console.log(110,pageNumber,pageCount,rows.length);
    this.setState({data: rows, total, pageNumber, pageSize, pageCount});
  }

  handleClickButton = async (id) => { //bbbbbbutton
    //let id = e.target.id;
    let pageNumber=this.state.pageNumber;
    let pageSize=this.state.pageSize;
    let total=this.state.total;
    let pageCount=parseInt((total-1)/pageSize)+1;
    if (id==='first') pageNumber=1;
    else if (id==='last') pageNumber=pageCount;
    else if (id==='prev' && pageNumber>1) pageNumber--;
    else if (id==='next' && pageNumber<pageCount) pageNumber++;
    else if (id==='ok') pageNumber=1;  //确定键，重新开始
    this.loadTablePage(pageNumber, this.state.pageSize);
  }

  render() {
    let {pageNumber, pageSize, pageCount, total} =this.state;
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
          <button id='cmbtnok' className='pagingButtonStyle' onClick={(e)=>this.handleClickButton('ok')} style={{width:60, height:28, marginLeft:10}}>确定</button>
        </div>

        <div className="layout-middle" >
        <div className={tableStyle.tableContainer}>
            {/*定义表格的表头*/}
            <table className={tableStyle.tableHead} style={{borderCollapse:'separate', borderSpacing:0}}>
              <thead>
                <tr style={{height: this.state.rowheight}}>
                  {this.state.columns.map((key, index) => (
                   <th key={'header_' + index} className='headerStyle' style={{fontSize:14, width: key.width, minWidth:key.width, textAlign:'center'}}>{key.title}</th>
                  ))}
                </tr>
              </thead>
            </table>
            <div className={tableStyle.tableBodyContainer}>
              <table className={tableStyle.tableBody} style={{borderCollapse:'separate', borderSpacing:0}}>
                <tbody>
                {this.state.data.map((row, rowindex)=>
                  <tr key={"row_"+rowindex} style={{height: this.state.rowheight, backgroundColor:'#efefef'}}>
                    {this.state.columns.map((col, colindex)=> {
                      let align = 'left';
                      let fontname='宋体';
                      if (col.datatype=='n'){
                        fontname='times new roman';
                        align='right';
                      }
                      if (col.datatype=='d' || col.field==='_rownumber'){
                        fontname='times new roman';
                        align='center';
                      }
                      if (col.align) align = col.align;
                      return(<td key={"cell_"+rowindex+"_"+colindex} className='cellStyle' style={{width: col.width, textAlign: align, fontFamily: fontname}}>{row[col.field]}</td>)}
                    )}
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="layout-bottom" style={{borderTop:'1px solid #ccc', height:36, paddingTop:4, paddingLeft:20 }}>
          {/* <button id="btnfirst" style={{cursor:pageNumber<=1? 'not-allowed':'pointer', ...pagingButtonStyle}} onClick={(e)=>this.handleClickButton('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  style={{cursor:pageNumber<=1? 'not-allowed':'pointer', ...pagingButtonStyle}} disabled={pageNumber<=1? true:false} onClick={(e)=>this.handleClickButton('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button> */}
          <button id="btnfirst" disabled={pageNumber<=1} style={{cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle}} onClick={(e)=>this.handleClickButton('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  disabled={pageNumber<=1} style={{cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle}} disabled={pageNumber<=1? true:false} onClick={(e)=>this.handleClickButton('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  disabled={pageNumber>=pageCount} style={{cursor: pageNumber >= parseInt((total-1)/pageSize)+1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle }} onClick={(e)=>this.handleClickButton('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  disabled={pageNumber>=pageCount} style={{cursor: pageNumber >= parseInt((total-1)/pageSize)+1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle }} onClick={(e)=>this.handleClickButton('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button>
          <label id="message" style={{marginLeft:20, marginTop:0, fontSize:14, fontFamily:"times new roman"}}>第{this.state.pageNumber}页，共{parseInt((this.state.total-1)/this.state.pageSize)+1}页。当前第{(this.state.pageNumber-1)*this.state.pageSize+1}行~{Math.min(this.state.total,this.state.pageNumber*this.state.pageSize)}行，共{this.state.total}行。</label>
        </div>        
      </div>
    );
  }
}
