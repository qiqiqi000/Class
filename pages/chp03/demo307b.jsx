import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import {MyCheckbox, MyCombobox, MyInput, MyRadiogroup} from '../../api/common.js';
const sys = React.sys;
const formColor='#fff';
const pagingButtonStyle={
  paddingTop: '4px',
  border: '1px solid #ccc',
  height: '28px',
  width: '32px',
  borderRadius: '5px',
  cursor: 'pointer' 
}

const toolbarButtonStyle={
  //paddingTop: '0px',
  border: '1px solid #ccc',
  height: '28px',
  width: '63px',
  borderRadius: '5px',
  cursor: 'pointer' 
}

export default class Page307 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 32,
      fixedColumns:[
        {"title":"选择", "field":"_button", "width":40, "left":-1},
        {"title":"序号", "field":"rowno", "width":50, "left":39}
      ],
      columns:[
        {"title":"客户编号", "field":"customerid", "width":80, datatype:'d'},
        {"title":"客户名称", "field":"companyname", "width":250},
        {"title":"联系人", "field":"contactname", "width":100},
        {"title":"联系人职务", "field":"contacttitle", "width":100},
        {"title":"单位地址", "field":"address", "width":200},
        {"title":"所属省份", "field":"region", "width":100},
        {"title":"所在城市", "field":"city", "width":90},
        {"title":"邮政编码", "field":"zip", "width":100},
        {"title":"联系电话", "field":"phone", "width":90},
        {"title":"Email", "field":"email", "width":80, datatype:'n'},
        {"title":"主页网址", "field":"homepage", "width":120, datatype:'n'},
        {"title":"纳税人登记号", "field":"taxpayerno", "width":120, datatype:'n'},
        {"title":"客户类型", "field":"customertype", "width":90, datatype:'n'}
      ],      
      data: [],
      selectedRow: {},
      rowSelectionType: 'checkbox', //'radio'
      total: 0,  //总行数
      pageNumber: 1,  //第几页
      pageSize: 20,  //每页显示行数
      pageCount: 0,
      addoredit: 'query',
      myForm1: {
        isVisible: true,   //是否显示数据编辑窗体
        isDragging: false,
        position: {x:200, y:100, x0:100, y0:200},
      }
    };
  }
  async componentDidMount(){ //初始状态时提取第1页数据
    let {pageNumber, pageSize} = this.state;
    this.loadTablePage(pageNumber, pageSize); 
  }

  loadTablePage = async (pageNumber, pageSize) =>{
    let p={};
    p.sqlprocedure = 'demo307a';
    p.pageno = pageNumber;
    p.pagesize = pageSize;
    p.filter = '';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算行序号，并添加一列rowno
    let rows=[];
    let total=rs.rows?.length>0 ? rs.rows[0].total : 0;
    Object.assign(rows, rs.rows);
    rows.forEach((item, index)=>{ //使用forEach循环遍历数据,计算行序号
      rows[index].rowno=index+1+(pageNumber-1)*pageSize;
    });
    let pageCount=parseInt((total-1)/pageSize)+1;
    this.setState({data: rows, total, pageNumber, pageSize, pageCount});
  }

  handleClick = async (id) => { //bbbbbbutton
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

  handleSelect = (e,row) => {
    console.log(666,e.target.id,row);
    this.setState({selectedRow: row})
  }

  handleAddClick = (e) => {
    this.setState({addoredit:'add', myForm1:{...this.state.myForm1, isVisible: true}});

  }

  handleEditClick = (e) => {  //eeeeeeeeee
    this.setState({addoredit:'edit', myForm1:{...this.state.myForm1, isVisible: true}});

  }

  handleDeleteClick = (e) => {

  }

  handleRefreshClick = (e) => {

  }

  handleKeyDown = () => {

  }

  handleSaveClick= ()=>{
    this.setState({myForm1:{...this.state.myForm1, isVisible: false}});
  }

  handleResetClick= ()=>{
    this.setState({myForm1:{...this.state.myForm1, isVisible: false}});
  }
    
  handleMouseDown = (e) => {
    let p={...this.state.myForm1.position};
    p.x0 = e.clientX - p.x;
    p.y0 = e.clientY - p.y;
    console.log(11,p)
    this.setState({myForm1:{...this.state.myForm1, isDragging:true, position: p}});
  };

  handleMouseMove = (e) => {
    if (!this.state.myForm1.isDragging) return;
    let p={...this.state.myForm1.position};
    p.x = e.clientX - p.x0;
    p.y = e.clientY - p.y0;
    console.log(12,p)
    this.setState({myForm1:{...this.state.myForm1, position: p}});
  };

  handleMouseUp = () => {
    this.setState({myForm1:{...this.state.myForm1, isDragging:false}});
  };

  handleSelectArea = async (e) =>{
    let id = e.target.id;
    if (id=='regionid'){
       this.cityid.setState({sqlparams: {"parentnodeid": e.target.value}, items: null}); 
    }
  }  

  handleSubmit =() =>{

  }
  /*
  1.如何设计一个窗体？窗体如何设计标题和工具栏？窗体滚动条如何设计？如何打开窗体和关闭窗体？如何打开窗体时不能点击底色？
  2.窗体如何用鼠标拖动？

  */

  render() {
    let {pageNumber, pageSize, pageCount} = this.state;
    return (
      <div className="app-container">
        <div className="top-section" style={{borderBottom:'1px solid #95B8E7', height:35, paddingTop:3, paddingLeft:12, backgroundColor:"#E0ECFF"}}>
          <button id='cmdadd' style={toolbarButtonStyle} onClick={this.handleAddClick.bind(this)}>新增</button>
          <button id='cmdedit' style={toolbarButtonStyle} onClick={this.handleEditClick.bind(this)}>修改</button>
          <button id='cmddelete' style={toolbarButtonStyle} onClick={this.handleDeleteClick.bind(this)}>删除</button>
          <button id='cmdrefresh' style={toolbarButtonStyle} onClick={(e)=>this.handleRefreshClick('ok')}>刷新</button>
        </div>
        <div className={this.state.myForm1.isVisible? 'disabled-section' : "middle-section"} >     {/*className={`middle-section ${this.state.myForm1.isVisible ? 'overlay-section' : ''}`}> */}
          <div className='table-container'>
            {/*定义表格的表头*/}            
            <table className='table table-head'>
              <thead>
                <tr style={{lineHeight: this.state.rowheight+'px', height: this.state.rowheight}}>
                  {this.state.fixedColumns.map((item, index) =>{
                    let html;
                    if (item.field==='_button' && this.state.rowSelectionType=='checkbox') html=<th key={'th1_'+index} className='fixedHeaderStyle' style={{left:item.left, width: item.width, minWidth:item.width}}><input key={'button_'+index} type={this.state.rowSelectionType} /></th>
                    else if (item.field==='_button'  && this.state.rowSelectionType=='radio') html=<th key={'th1_'+index} className='fixedHeaderStyle' style={{left:item.left, width: item.width, minWidth:item.width}}></th>
                    else html= <th key={'th1_' + index} className='fixedHeaderStyle' style={{left:item.left, width: item.width, minWidth:item.width}}>{item.title}</th>
                    return(html)
                  })}
                  {this.state.columns.map((item, index) => (
                    <th key={'th2_' + index} className='headerStyle' style={{width: item.width, minWidth:item.width}}>{item.title}</th>
                  ))}
                </tr>
              </thead>
            </table>

            {/*定义固定列的表体内容*/}
            <div className='table-body-container' ref={ref => this.tableBodyRef = ref}>
              <table className='table table-body' style={{}} >
                <tbody>
                {this.state.data.map((row, rowindex)=>
                  <tr key={"row_"+rowindex} className='table-link' style={{cursor:'pointer', height: this.state.rowheight, lineHeight: this.state.rowheight+'px'}}>
                    {this.state.fixedColumns.map((col, colindex)=> {
                     let fontname='times new roman';
                     let align='center';
                     let rowno = this.state.selectedRow.rowno-(this.state.pageNumber-1)*this.state.pageSize-1
                     let html;
                     if (col.field==='_button') html=<td key={'td_'+parseInt(1+rowindex)} className='fixedHeaderStyle' style={{left:col.left, width: col.width, minWidth:col.width, backgroundColor: this.state.selectedRow.rowno==row.rowno? sys.selectedcolor: null}} >
                      <input key={'button_'+parseInt(rowindex+1)} id={'_button'+rowindex} type={this.state.rowSelectionType} 
                       checked={rowno == rowindex} onChange={(e)=>this.handleSelect(e, row)} /></td>
                     else html = <td key={"cell_"+rowindex+"_"+colindex} className='fixedHeaderStyle' style={{left:col.left, width: col.width, textAlign: align, fontFamily: fontname, backgroundColor: this.state.selectedRow.rowno==row.rowno? sys.selectedcolor: null}} onClick={(e)=>this.handleSelect(e,row)}>{row[col.field]}</td> 
                     return(html)}
                    )}
                    {/*定义非固定列的表体内容*/}
                    {this.state.columns.map((col, colindex)=> {
                      let align='left';
                      let fontname='宋体';
                      if (col.datatype=='n' || col.datatype=='d' || colindex==0){
                        fontname='times new roman';
                        align='right';
                      }
                      if (col.datatype=='d' || colindex==0){
                        align='center';
                      }
                      return(<td key={"cell_"+rowindex+"_"+colindex} className={this.state.myForm1.isVisible? 'cellStyle-disabled' : 'cellStyle'} onClick={(e)=>this.handleSelect(e,row)} 
                       style={{width: col.width, textAlign: align, fontFamily: fontname, backgroundColor: this.state.selectedRow.rowno==row.rowno? sys.selectedcolor: null}}>
                       {row[col.field]}
                      </td>)}
                    )}
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*定义一组分页按钮*/}
        <div className="bottom-section" style={{borderTop:'1px solid #95B8E7', height:36, paddingTop:3, paddingLeft:24 }}>
          <button id="btnfirst" cursor={pageNumber<=1? 'auto':'pointer'} style={pagingButtonStyle} onClick={(e)=>this.handleClick('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  style={pagingButtonStyle} disabled={pageNumber<=1? true:false} onClick={(e)=>this.handleClick('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  style={pagingButtonStyle} onClick={(e)=>this.handleClick('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  style={pagingButtonStyle} onClick={(e)=>this.handleClick('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button>
          <label id="message" style={{marginLeft:20, fontSize:14, fontFamily:"times new roman"}}>第{this.state.pageNumber}页，共{parseInt((this.state.total-1)/this.state.pageSize)+1}页。当前第{(this.state.pageNumber-1)*this.state.pageSize+1}行~{Math.min(this.state.total,this.state.pageNumber*this.state.pageSize)}行，共{this.state.total}行。</label>
        </div>

        {/*定义一个类似的窗体，用div*/}
        {this.state.myForm1.isVisible && (
            <div className='myFormStyle' style={{position:'absolute', top:this.state.myForm1.position.y, left:this.state.myForm1.position.x, width:450, height:550}}>
               <div className="app-container">        
                  <div className="top-section" style={{backgroundColor:formColor, borderBottom:'1px solid #95B8E7', height:38, paddingTop:7, paddingLeft:12}} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
                    <div style={{cursor:'grab', float:'left'}} >
                       <label style={{fontSize:sys.label.fontsize+2}}>客户信息编辑</label>
                    </div>
                    <div style={{float:'right'}}>
                       <img src={require("../../icons/close.png")} style={{cursor:'pointer', position:'absolute', paddingTop:4, right:8}}
                        onClick={(e)=>this.setState({myForm1:{...this.state.myForm1, isVisible: false}})} />
                    </div>
                  </div>

                  <div className="middle-section" style={{backgroundColor:formColor, padding: '12px 8px 10px 16px', overflow:'auto'}} >
                    <MyInput id="customerid" ref={ref=>this.customerid=ref} type="text" label="客户编码" labelwidth="85" height="28" width="200" style={{marginTop:10}} readOnly={true} onFocus={this.onfocus} onKeyDown={(e)=>this.handleKeyDown(e)} />
                    <MyInput id="companyname" ref={ref=>this.companyname=ref} type="text" label="客户名称" labelwidth="85" width="300" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="contactname" ref={ref=>this.contactname=ref} type="text" label="联系人" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyCombobox id="contacttitle" ref={ref=>this.contacttitle=ref} label="联系人职务" labelwidth="85" width="200" sqlprocedure="demo307b" sqlparams={null} style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
                    <MyInput id="address" ref={ref=>this.address=ref} type="text" label="客户地址" labelwidth="85" width="300" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />          
                    <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelectArea.bind(this)} />
                    <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" />
                    <MyInput id="phone" ref={ref=>this.phone=ref} label="联系电话" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="zip" ref={ref=>this.zip=ref} label="邮政编码" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="email" ref={ref=>this.email=ref} label="电子邮箱" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="homepage" ref={ref=>this.phone=ref} label="主页网址" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyCombobox id="typeid" ref={ref=>this.typeid=ref} label="客户类别" labelwidth="85" width="200" sqlprocedure="demo307c" sqlparams={{}} style={{marginTop:10}} />
                </div>
                <div className="bottom-section" style={{backgroundColor:formColor, borderTop:'1px solid #95B8E7', height:42, textAlign:'right', paddingTop:7, paddingRight:16}}>
                  <button key="btnok" style={{height: 25, width: 66}} onClick={this.handleSaveClick.bind(this)}>保存</button>
                  <button key="btnreset" style={{height: 25, width: 66, marginLeft:6}} onClick={this.handleResetClick.bind(this)}>关闭</button>
                </div>
           </div>
         </div>
        )}
      </div>
    );
  }
}
