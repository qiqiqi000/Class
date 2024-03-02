import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import {MyCheckbox, MyCombobox, MyInput, MyRadiogroup} from '../../api/common.js';
import tableStyle from '../../css/table.module.css';
const sys = React.sys;
const lineheight = 40;
const formColor = '#ffffff';
//const cellBorder='1px solid #ddd';
const cellBorder='';
const pagingButtonStyle={
  paddingTop: '4px',
  border: '1px solid #ccc',
  height: '26px',
  width: '32px',
  borderRadius: '5px',
  //cursor: 'pointer' 
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
        {"title":"序号", "field":"_rownumber", "width":50, "left":39}
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
        {"title":"Email", "field":"email", "width":120},
        {"title":"主页网址", "field":"homepage", "width":120, datatype:'n'},
        {"title":"纳税人登记号", "field":"taxpayerno", "width":120, datatype:'n'},
        {"title":"客户类型", "field":"customertype", "width":90, datatype:'n'}
      ],      
      data: [],
      //selectedRow: {},   //当前选中的行
      selectedRowIndex: -1,  //当前选中的行号
      //rowSelectionType: 'radio',
      rowSelectionType: 'checkbox',
      total: 0,  //总行数
      pageNumber: 1,  //第几页
      pageSize: 20,  //每页显示行数
      pageCount: 0,
      addoredit: 'query',
    };
  }

  async componentDidMount(){ //初始状态时提取第1页数据
    let {pageNumber, pageSize} = this.state;
    this.loadTablePage(pageNumber, pageSize)
  }

  loadTablePage = async (pageNumber, pageSize) =>{
    let {selectedRowIndex} = this.state;
    let p={};
    p.sqlprocedure = 'demo307a';
    p.pageno = pageNumber;
    p.pagesize = pageSize;
    p.filter = '';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算行序号，并添加一列_rownumber
    let rows=[];
    let total=rs.rows?.length>0 ? rs.rows[0]._total : 0;
    Object.assign(rows, rs.rows);
    rows.forEach((item, index)=>{ //使用forEach循环遍历数据,计算行序号
      rows[index]._rownumber= index +1 + (pageNumber-1)*pageSize;
    });
    let pageCount=parseInt((total-1)/pageSize)+1;
    if (selectedRowIndex<0) selectedRowIndex = 0;
    if (selectedRowIndex>rs.rows.length-1) selectedRowIndex = rs.rows.length-1;    
    console.log(11333,selectedRowIndex,pageNumber)
    //直接调用setFormValues，否则必须人工点击行。
    this.setState({data:rows, total, selectedRowIndex, pageNumber, pageSize, pageCount}, 
      ()=>this.setState({selectedRowIndex, addoredit:'query'}, this.setFormValues(selectedRowIndex, 'query'))    //this.handleSelectRow(selectedRowIndex)
    );
  }

  handleSelectRow = (rowindex) => {
    let {selectedRowIndex, data, pageNumber, pageSize} = this.state;
    //console.log(556,rowindex, selectedRowIndex)
    if (selectedRowIndex === undefined || selectedRowIndex<0) return;
    if (selectedRowIndex !== rowindex){
      this.setState({selectedRowIndex:rowindex, addoredit:'query'}, this.setFormValues(rowindex, 'query'));
    }
  }

  setFormValues = (selectedRowIndex, action) => {
    let row = this.state.data[selectedRowIndex]; 
    if (action === 'add') {
      //下拉框局设置为初值第一个选项
      for (let key in row) {
        if (this[key]){
          if (this[key].state.classtype=='text') this[key].setState({value: '', readOnly: false});
          else if (this[key].state.classtype=='combobox') this[key].setState({readOnly: false});  //原来选项不变
          //else if (this[key].state.classtype=='combobox' && this[key].state.items?.length>0) this[key].setState({value: this[key].state.items[0].value, readOnly: false});  //选项改成第一个选项
        }
      }
      //新增记录时下拉框选第一个选项。如果注释掉，变成新增记录时下拉框选还是原来的选项
      //this.cityid.setState({value:'', sqlparams: {"parentnodeid": this.regionid.state.items[0].value}, items: null});
      document.getElementById("customerid").focus();
    }else{
      //省份变化后重新提取数据
      //console.log(114, row.city,row.cityid,row);
      //if (row.regionid !== this.regionid.state.value) {
      //下面这段语句放在控件赋值之前
      if (row.regionid !== this.regionid.state.value || row.regionid==this.regionid.state.items[0].value) {
        console.log(114, this.regionid.state.value);
        this.cityid.setState({value:'', sqlparams: {"parentnodeid": row.regionid}, items: null});
        //this.cityid.setState({sqlparams: {"parentnodeid": row.regionid}, items: null});
      }
      for (let key in row) {
        if (this[key]){
          this[key].setState({value: row[key], readOnly: action !== 'edit'});
        }
      } 
      this.customerid.setState({readOnly: true});
      document.getElementById("companyname").focus();
    }
  } 

  handleSelectArea = async (e) =>{
    let id = e.target.id;
    if (id=='regionid'){
       this.cityid.setState({value:'', sqlparams: {"parentnodeid": e.target.value}, items: null}); 
       //this.cityid.setState({sqlparams: {"parentnodeid": e.target.value}, items: null});       
    }
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

  handleAddClick = (e) => {
    this.setState({addoredit:'add'}, ()=>this.setFormValues(this.state.selectedRowIndex, 'add'));
  }

  handleEditClick = (e) => {  //eeeeeeeeee
    this.setState({addoredit:'edit' }, ()=>this.setFormValues(this.state.selectedRowIndex, 'edit'));
  }

  handleDeleteClick = async(e) => {  //ddddddddd
    let p={};
    p.action='delete';
    p.sqlprocedure='demo307s';
    p.data = {...this.state.data[this.state.selectedRowIndex]};
    console.log(777,p.data.city,JSON.stringify(p.data))   
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
  }

  handleSaveClick= async() => {  //ssssss
    let {data, addoredit, pageNumber, pageSize, selectedRowIndex}= this.state;
    let selectedRow = {...data[selectedRowIndex]};
    for (let key in selectedRow) {
       if (this[key]) selectedRow[key]=this[key].state.value;
    }
    console.log(881, addoredit, selectedRow, this.cityid.state.value);
    let p={};
    p.action = addoredit;
    p.keyfield = 'customerid';
    p.sqlprocedure = 'demo307s';
    p.data = selectedRow;
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    if (addoredit === 'add' && rs.rows.length > 0 && rs.rows[0]._rowno !== undefined){
      //新增记录需要计算记录所在的页码号
      pageNumber = parseInt((rs.rows[0]._rowno-1)/pageSize) + 1;
      selectedRowIndex = rs.rows[0]._rowno - pageSize*(pageNumber-1) - 1;
    }
    //重新加载网格数据，计算页码与行号。页码从存储过程返回.  //关闭窗体
    this.setState({selectedRowIndex}, ()=>this.loadTablePage(pageNumber, pageSize));
  }

  handleRefreshClick = (e) => {

  }

  handleKeyDown = () => {

  }

  handleResetClick= ()=>{
    
  }
    
  setHeaders=()=>{  ///hhhhhhh设置表头
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRow, rowheight, columns, fixedColumns, myForm1} = this.state;
    let elem = [];
    //定义左边固定列表头
    for (let index = 0; index < fixedColumns.length; index ++){
      let item = fixedColumns[index];
      if (item.field === '_button' && rowSelectionType=='checkbox') elem.push(<th key={'th1_'+index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}><input key={'button_'+index} type={rowSelectionType} /></th>)
      else if (item.field === '_action' && item.left !== undefined) elem.push(<th key={'th2_'+index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}></th>)
      else if (item.field !=='_action') elem.push(<th key={'th3_' + index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}>{item.title}</th>)
    }    
    //定义非固定列表头
    for (let index = 0; index < columns.length; index ++){
      let item = columns[index];
      elem.push(<th key={'th4_' + index} className='headerStyle' style={{border: cellBorder, width: item.width, minWidth:item.width}}>{item.title}</th>);
    }
    {/*定义右边固定列表头*/}
    for (let index = 0; index < fixedColumns.length; index ++){
      let item = fixedColumns[index];
      if (item.field==='_action' && item.right !== undefined){
        elem.push(<th key={'th5_'+index} className='fixedHeaderStyle' style={{border: cellBorder, right:item.right, width: item.width, minWidth:item.width}}></th>)
      } 
    }
    return (<tr style={{cursor:'pointer', lineHeight: rowheight+'px', height: rowheight}}>{elem}</tr>);
  }
  
  //用函数生成表头和表体
  setCellData= ()=>{ //生成表格数据
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRowIndex, rowheight, columns, fixedColumns, myForm1} = this.state;
    let rowno = selectedRowIndex+(pageNumber-1)*pageSize+1;  //实际行号，eg.66    
    let elem = [];        
    for (let rowindex = 0; rowindex < data.length; rowindex ++){
      let row = data[rowindex];
      let cells = [];
      //定义左边固定列的表体内容
      for (let colindex = 0; colindex < fixedColumns.length; colindex ++){
        let col = fixedColumns[colindex];
        let fontname='times new roman';
        let align='center';
        if (col.field==='_button'){ 
          cells.push(<td key={'cell1_'+parseInt(1+rowindex)} className='fixedHeaderStyle' style={{border: cellBorder, left:col.left, width: col.width, minWidth:col.width, backgroundColor: rowno == row._rownumber? sys.selectedcolor: null}} >
          <input key={'button_'+parseInt(rowindex+1)} id={'_button'+rowindex} type={rowSelectionType} 
          checked={selectedRowIndex === rowindex} onChange={(e)=>this.handleSelectRow(rowindex)} /></td>)
        }else if (col.field=='_action' && col.left!==undefined){
          cells.push(<td key={'cell2_'+parseInt(1+rowindex)} className='fixedHeaderStyle' style={{paddingTop:6, border: cellBorder, left:col.left, width: col.width, minWidth:col.width, backgroundColor: rowno == row._rownumber? sys.selectedcolor: ''}} >
           <img src={require('../../icons/edit.png')} key={'action1_'+parseInt(rowindex+1)} id={'_action1'+rowindex} style={{marginRight:4, width:16}} onClick={()=>this.handleEditClick(rowindex)} />
           <img src={require('../../icons/delete.png')} key={'action2_'+parseInt(rowindex+1)} id={'_action2'+rowindex} style={{width:16}} onClick={()=>this.handleDeleteClick(rowindex)} /></td>)
        }else if (col.field !=='_action'){
          if (col.align) align = col.align;
          else if (col.field==='_rownumber') align = 'center';
          else align = 'left';
          cells.push(<td key={"cell3_"+rowindex+"_"+colindex} className='fixedHeaderStyle' style={{border: cellBorder, left:col.left, width: col.width, textAlign: align, fontFamily: fontname, backgroundColor: rowno == row._rownumber? sys.selectedcolor: null}} onClick={(e)=>this.handleSelectRow(rowindex)} onDoubleClick={(e)=>this.handleDoubleClickRow(rowindex)}>{row[col.field]}</td>) 
        }
      }
      //定义非固定列的表体内容
      for (let colindex = 0; colindex < columns.length; colindex ++){
        let col=columns[colindex];
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
        cells.push(<td key={"cell4_"+rowindex+"_"+colindex} className='cellStyle' 
         onClick={(e)=>this.handleSelectRow(rowindex)} onDoubleClick={(e)=>this.handleDoubleClickRow(rowindex)}
         style={{border: cellBorder, width: col.width, textAlign: align, fontFamily: fontname, backgroundColor: rowno == row._rownumber? sys.selectedcolor: null}}>
         {row[col.field]}</td>)
      }
      //定义右边固定列的表体内容
      for (let colindex = 0; colindex < fixedColumns.length; colindex ++){
        let col=fixedColumns[colindex];
        let fontname='times new roman';
        let align='center';
        if (col.field=='_action' && col.right!==undefined){
           cells.push(<td key={'cell5_'+parseInt(1+rowindex)} className='fixedHeaderStyle' style={{paddingTop:6, border: cellBorder, right:col.right, width: col.width, minWidth:col.width, backgroundColor: rowno == row._rownumber? sys.selectedcolor: ''}} >
           <img src={require('../../icons/edit.png')} key={'action1_'+parseInt(rowindex+1)} id={'_action1'+rowindex} style={{marginRight:4, width:16}} onClick={()=>this.handleEditClick(rowindex)} />
           <img src={require('../../icons/delete.png')} key={'action2_'+parseInt(rowindex+1)} id={'_action2'+rowindex} style={{width:16}} onClick={()=>this.handleDeleteClick(rowindex)} /></td>)
        }
      }
      elem.push(<tr key={"row_"+rowindex} className='table-link' style={{cursor:'pointer', height: rowheight, lineHeight: rowheight+'px'}}>{cells}</tr>);
    }
    return elem;
  }
    

  handleSubmit =() =>{

  }
  

  render() {
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRowIndex, rowheight, columns, fixedColumns} = this.state;
    let rowno = selectedRowIndex + (pageNumber-1)*pageSize + 1;  //实际行号，eg.66
    return (
      <div id="mainpage" className="layout-body">
        <div className="layout-top" style={{borderBottom:'1px solid #95B8E7', height:35, paddingTop:3, paddingLeft:12, backgroundColor:"#E0ECFF"}}>
          <button id='cmdadd' style={toolbarButtonStyle} onClick={this.handleAddClick.bind(this)}><img src={require('../../icons/add.png')} />新增</button>
          <button id='cmdedit' style={toolbarButtonStyle} onClick={this.handleEditClick.bind(this)}><img src={require('../../icons/edit.png')} />修改</button>
          <button id='cmddelete' style={toolbarButtonStyle} onClick={this.handleDeleteClick.bind(this)}><img src={require('../../icons/delete.png')} />删除</button>
          <button id='cmdsave' style={toolbarButtonStyle} onClick={this.handleSaveClick.bind(this)}><img src={require('../../icons/save.png')} />保存</button>
          <button id='cmdrefresh' style={toolbarButtonStyle} onClick={(e)=>this.handleRefreshClick('ok')}><img src={require('../../icons/refresh.png')} />刷新</button>
        </div>
        <div className="layout-middle" >
          <div className={tableStyle.tableContainer}>
            {/*定义表格的表头*/}
              <table className={tableStyle.tableHead}>
                <thead>
                  {this.setHeaders()}
                </thead>
              </table>
              <div className={tableStyle.tableBodyContainer}>
                <table className={tableStyle.tableBody}>
                  <tbody>
                    {this.setCellData()}
                  </tbody>
                </table>
              </div>
            </div>
        </div>

        {/*定义一组分页按钮*/}
        <div className="layout-bottom" style={{borderTop:'1px solid #95B8E7', borderBottom:'1px solid #95B8E7', height:33, paddingTop:3, paddingLeft:24 }}>
          {/* <button id="btnfirst" cursor={pageNumber<=1? 'auto':'pointer'} style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  style={pagingButtonStyle} disabled={pageNumber<=1? true:false} onClick={(e)=>this.handleClickButton('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button> */}
          <button id="btnfirst" disabled={pageNumber<=1} style={{cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle}} onClick={(e)=>this.handleClickButton('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  disabled={pageNumber<=1} style={{cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle}} onClick={(e)=>this.handleClickButton('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  disabled={pageNumber>=pageCount} style={{cursor: pageNumber >= parseInt((total-1)/pageSize)+1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle }} onClick={(e)=>this.handleClickButton('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  disabled={pageNumber>=pageCount} style={{cursor: pageNumber >= parseInt((total-1)/pageSize)+1 ? 'not-allowed' : 'pointer', ...pagingButtonStyle }} onClick={(e)=>this.handleClickButton('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button>
          <label id="message" style={{marginLeft:20, fontSize:14, fontFamily:"times new roman"}}>第{pageNumber}页，共{parseInt((total-1)/pageSize)+1}页。当前第{(pageNumber-1)*pageSize+1}行~{Math.min(total,pageNumber*pageSize)}行，共{total}行。</label>
        </div>
        {/*定义表单*/}
        <div className="layout-bottom" style={{borderTop:'1px solid #95B8E7', marginTop:2, position:'relative', padding:'10px 8px 8px 20px', overflow:'auto', height:170 }}>
           <MyInput id="customerid" ref={ref=>this.customerid=ref} type="text" label="客户编码" labelwidth="85" height="28" width="180" top={12+0*lineheight} left="20" onFocus={this.onfocus} onKeyDown={(e)=>this.handleKeyDown(e)} />
           <MyInput id="companyname" ref={ref=>this.companyname=ref} type="text" label="客户名称" labelwidth="85" width="300" top={12+0*lineheight} left="320" onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           <MyInput id="contactname" ref={ref=>this.contactname=ref} type="text" label="联系人" labelwidth="85" width="200" top={12+0*lineheight} left="730" onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           
           <MyCombobox id="contacttitle" ref={ref=>this.contacttitle=ref} label="联系人职务" labelwidth="85" width="180" top={12+1*lineheight} left="20" sqlprocedure="demo307b" sqlparams={null} onKeyDown={this.handleKeyDown} />
           <MyInput id="address" ref={ref=>this.address=ref} type="text" label="客户地址" labelwidth="85" width="300" top={12+1*lineheight} left="320" onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="85" width="200" top={12+1*lineheight} left="730" sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelectArea.bind(this)} />           
           <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="180" top={12+2*lineheight} left="20" sqlprocedure="demo305a" />
           <MyInput id="phone" ref={ref=>this.phone=ref} label="联系电话" labelwidth="85" width="200" top={12+2*lineheight} left="320" onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           <MyInput id="zip" ref={ref=>this.zip=ref} label="邮政编码" labelwidth="85" width="200" top={12+2*lineheight} left="730" onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />

           <MyInput id="email" ref={ref=>this.email=ref} label="电子邮箱" labelwidth="85" width="180" style={{position:'absolute', top:12+3*40, left:20}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           <MyInput id="homepage" ref={ref=>this.homepage=ref} label="主页网址" labelwidth="85" width="200" style={{position:'absolute', top:12+3*40, left:320}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
           <MyCombobox id="typeid" ref={ref=>this.typeid=ref} label="客户类别" labelwidth="85" width="200" sqlprocedure="demo307c" sqlparams={{}} style={{position:'absolute', top:12+3*40, left:730}} />
        </div>
      </div>
    );
  }
}

  /*
  1.如何设计一个窗体？窗体如何设计标题和工具栏？窗体滚动条如何设计？如何打开窗体和关闭窗体？如何打开窗体时不能点击底色？
  2.窗体如何用鼠标拖动？窗体如何覆盖原来的文字z-index>1?
  3.窗体如何居中？

  */
