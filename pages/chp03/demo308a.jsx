import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import {MyCheckbox, MyCombobox, MyInput, MyRadiogroup} from '../../api/common.js';
const sys = React.sys;
const formColor = '#ffffff';
//const cellBorder='1px solid #ddd';
const cellBorder='';
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
        {"title":"选择", "field":"_button", "width":30, "left":-1},
        {"title":"序号", "field":"_rownumber", "width":50, "left":29, "align":'center'},
        {"title":"操作", "field":"_action", "width":50, "right":0}
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
        {"title":"客户类型", "field":"customertype", "width":90, align:'center'}
      ],      
      data: [],
      selectedRowIndex: -1,   //当前选中的行
      rowSelectionType: 'checkbox', //'radio'
      total: 0,  //总行数
      pageNumber: 1,  //第几页
      pageSize: 20,  //每页显示行数
      pageCount: 0,
      addoredit: 'query',
      myForm1: {
        isVisible: false,   //是否显示数据编辑窗体
        isDragging: false,
        height: 560,
        width: 442,
        position: {x:200, y:60, x0:200, y0:60},
      }
    };
  }

  async componentDidMount(){ //初始状态时提取第1页数据
    let {pageNumber, pageSize} = this.state;
    let {width, height, position} = this.state.myForm1;
    let elem =document.getElementById('mainpage');
    let x = Math.max(20,(elem.clientWidth - width)/2);
    let y = Math.max(50,(elem.clientHeight - height)/2-20);
    this.setState({myForm1:{...this.state.myForm1, position:{x,y,x0:x,y0:y}}},()=>this.loadTablePage(pageNumber, pageSize))
    //this.loadTablePage(pageNumber, pageSize);
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
      rows[index]._rownumber= index + 1 + (pageNumber-1)*pageSize;
    });
    let pageCount = parseInt((total-1)/pageSize)+1;
    if (selectedRowIndex<0) selectedRowIndex = 0;
    if (selectedRowIndex>rs.rows.length-1) selectedRowIndex = rs.rows.length-1;
    console.log(333,selectedRowIndex,pageNumber)
    this.setState({data: rows, total, selectedRowIndex, pageNumber, pageSize, pageCount}, 
      ()=>this.handleSelectRow(selectedRowIndex));
  }

  handleSelectRow = (rowindex) => {
    let {selectedRowIndex, data, pageNumber, pageSize} = this.state;
    //console.log(556,rowindex, selectedRowIndex)
    if (selectedRowIndex === undefined || selectedRowIndex<0) return;
    if (selectedRowIndex !== rowindex){
      this.setState({selectedRowIndex:rowindex, addoredit:'query'});
    }
  }

  setFormValues = (selectedRowIndex, action) => {    
    let row = this.state.data[selectedRowIndex]; 
    //console.log(999,row,action,this.regionid.state.items);
    if (action === 'add') {
      for (let key in row) {
        if (this[key]){
          console.log(124,key, this[key], this[key].state.classtype,this.regionid.state.classtype)
          if (this[key].state.classtype=='text') this[key].setState({readOnly: false, value: ''});
          else if (this[key].state.classtype=='combobox') this[key].setState({readOnly: false, items:null});  //重新加载下拉框
        }
      }
      //下拉框局设置为初值第一个选项
      console.log(666,this.regionid.state.items)
      if (this.regionid.state.items) this.cityid.setState({sqlparams: {"parentnodeid": this.regionid.state.items[0].value}, items: null});
      document.getElementById("customerid").focus();
      //console.log(111, this.typeid.state.value);
    }else{
      //省份变化后重新提取数据
      if (row.regionid !== this.regionid.state.value) {
        this.cityid.setState({sqlparams: {"parentnodeid": row.regionid}, items: null});
      }
      //console.log(114, row.city,row.cityid,row);
      for (let key in row) {
        if (this[key]){
          this[key].setState({value: row[key]});
          if (action === 'edit') this[key].setState({readOnly: false});
          else this[key].setState({readOnly: true});
        }
      } 
      this.customerid.setState({readOnly: true});
      document.getElementById("companyname").focus();
    }
  }
  
  handleAddClick = (e) => {
    this.setState({addoredit:'add', myForm1:{...this.state.myForm1, isVisible: true}},
    ()=>this.setFormValues(this.state.selectedRowIndex, 'add'));
  }

  handleEditClick = (rowindex) => {  //eeeeeeeeee
    this.setState({addoredit:'edit', selectedRowIndex:rowindex, myForm1:{...this.state.myForm1, isVisible: true}},
      ()=>this.setFormValues(this.state.selectedRowIndex, 'edit')
    );
  }

  handleDoubleClickRow=(rowindex)=>{
    this.setState({addoredit:'query', selectedRowIndex:rowindex, myForm1:{...this.state.myForm1, isVisible: true}},
      ()=>this.setFormValues(this.state.selectedRowIndex, 'query')
    );
  }

  handleDeleteClick = (rowindex) => {
    
 


  }

  handleSaveClick= async() => {  //ssssss
    let {data, addoredit, pageNumber, pageSize, selectedRowIndex}= this.state;
    let selectedRow = {...data[selectedRowIndex]};
    for (let key in selectedRow) {
       if (this[key]) selectedRow[key]=this[key].state.value;
    }
    //console.log(881, addoredit, selectedRow, this.cityid.state.value);
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
    this.setState({selectedRowIndex, myForm1:{...this.state.myForm1, isVisible: false}}, 
      ()=>this.loadTablePage(pageNumber, pageSize)
    );
  
  }


  handleRefreshClick = (e) => {

  }

  handleClickButton = async (id) => { //翻页按钮事件bbbbbbutton
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

  handleKeyDown = () => {

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

  setHeaders=()=>{  ///hhhhhhh设置表头
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRow, rowheight, columns, fixedColumns, myForm1} = this.state;
    let elem = [];
    {/*定义左边固定列表头*/}
    for (let index = 0; index < fixedColumns.length; index ++){
      let item = fixedColumns[index];
      if (item.field === '_button' && rowSelectionType=='checkbox') elem.push(<th key={'th1_'+index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}><input key={'button_'+index} type={rowSelectionType} /></th>)
      else if (item.field === '_action' && item.left !== undefined) elem.push(<th key={'th2_'+index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}></th>)
      else if (item.field !=='_action') elem.push(<th key={'th3_' + index} className='fixedHeaderStyle' style={{border: cellBorder, left:item.left, width: item.width, minWidth:item.width}}>{item.title}</th>)
    }
    console.log(elem)
    {/*定义非固定列表头*/}
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

  setCellData= ()=>{ //生成表格数据
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRowIndex, rowheight, columns, fixedColumns, myForm1} = this.state;
    let rowno = selectedRowIndex+(pageNumber-1)*pageSize+1;  //实际行号，eg.66    
    let elem = [];        
    for (let rowindex = 0; rowindex < data.length; rowindex ++){
      let row = data[rowindex];
      let cells = [];
      {/*定义左边固定列的表体内容*/}
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
      {/*定义非固定列的表体内容*/}
      for (let colindex = 0; colindex < columns.length; colindex ++){
        let col=columns[colindex];
        let align = 'left';
        let fontname='宋体';
        if (col.datatype=='n' || col.datatype=='d' || colindex==0){
          fontname='times new roman';
          align='right';
        }
        if (col.datatype=='d'){
          align='center';
        }
        if (col.align) align = col.align;
        cells.push(<td key={"cell4_"+rowindex+"_"+colindex} className={myForm1.isVisible? 'cellStyle-disabled' : 'cellStyle'} 
         onClick={(e)=>this.handleSelectRow(rowindex)} onDoubleClick={(e)=>this.handleDoubleClickRow(rowindex)}
         style={{border: cellBorder, width: col.width, textAlign: align, fontFamily: fontname, backgroundColor: rowno == row._rownumber? sys.selectedcolor: null}}>
         {row[col.field]}</td>)
      }
      {/*定义右边固定列的表体内容*/}
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
    
  render() {
    let {data, pageNumber, pageSize, pageCount, total, rowSelectionType, selectedRowIndex, rowheight, columns, fixedColumns, myForm1} = this.state;
    //alert(myForm1.width+'-'+myForm1.height)
    return (
      <div id="mainpage" className="layout-body">
        <div className="layout-top" style={{borderBottom:'1px solid #95B8E7', height:35, paddingTop:3, paddingLeft:12}}>
          <button id='cmdadd' style={{ ...toolbarButtonStyle, ...{width:63}}} onClick={this.handleAddClick.bind(this)}><img src={require('../../icons/add.png')} />新增</button>
          {/* <button id='cmdedit' style={toolbarButtonStyle} onClick={this.handleEditClick.bind(this)}>修改</button>
          <button id='cmddelete' style={toolbarButtonStyle} onClick={this.handleDeleteClick.bind(this)}>删除</button> */}
          <button id='cmdrefresh' style={toolbarButtonStyle} onClick={(e)=>this.handleRefreshClick('ok')}><img src={require('../../icons/refresh.png')} />刷新</button>
        </div>
        <div className={myForm1.isVisible? 'layout-disabled' : "layout-middle"} >     {/*className={`middle-section ${this.state.myForm1.isVisible ? 'overlay-section' : ''}`}> */}
          <div className='table-container'>
            {/*定义表格的表头*/}
            <table className='table table-head'>
              <thead>
                {this.setHeaders()}
              </thead>
            </table>
            <div className='table-body-container' ref={ref => this.tableBodyRef = ref}>
              <table className='table table-body' style={{}} >
                <tbody>
                  {this.setCellData()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*定义一组分页按钮*/}
        <div className="layout-bottom" style={{borderTop:'1px solid #95B8E7', height:36, paddingTop:3, paddingLeft:24 }}>
          <button id="btnfirst" cursor={pageNumber<=1? 'auto':'pointer'} style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('first')}><img width="14" src={pageNumber>1? require("../../icons/page-first.png"):require("../../icons/page-first-disabled.png")} /></button>
          <button id="btnprev"  style={pagingButtonStyle} disabled={pageNumber<=1? true:false} onClick={(e)=>this.handleClickButton('prev')}><img width="14" src={pageNumber>1? require("../../icons/page-left.png"): require("../../icons/page-left-disabled.png")} /></button>
          <button id="btnnext"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('next')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-right.png"):require("../../icons/page-right-disabled.png")} /></button>
          <button id="btnlast"  style={pagingButtonStyle} onClick={(e)=>this.handleClickButton('last')}><img width="14" src={pageNumber<pageCount? require("../../icons/page-last.png") : require("../../icons/page-last-disabled.png")} /></button>
          <label id="message" style={{marginLeft:20, fontSize:14, fontFamily:"times new roman"}}>第{pageNumber}页，共{parseInt((total-1)/pageSize)+1}页。当前第{(pageNumber-1)*pageSize+1}行~{Math.min(total,pageNumber*pageSize)}行，共{total}行。</label>
        </div>

        {/*定义一个类似的窗体，用div*/}
        {myForm1.isVisible && (
            <div className='myFormStyle' style={{position:'absolute', top:myForm1.position.y, left:myForm1.position.x, width:myForm1.width, height:myForm1.height}}>
               <div className="layout-body">        
                  <div className="layout-top" style={{backgroundColor:formColor, borderBottom:'1px solid #95B8E7', height:38, paddingTop:8, paddingLeft:16}} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
                    <div style={{cursor:'grab', float:'left'}} >
                       <label style={{fontSize:sys.label.fontsize+2}}>客户信息编辑</label>
                    </div>
                    <div style={{float:'right'}}>
                       <img src={require("../../icons/close.png")} style={{cursor:'pointer', position:'absolute', paddingTop:4, right:8}}
                        onClick={(e)=>this.setState({myForm1:{...this.state.myForm1, isVisible: false}})} />
                    </div>
                  </div>
                  <div className="layout-middle" style={{backgroundColor:formColor, padding: '12px 8px 10px 24px', overflow:'auto'}} >
                    <MyInput id="customerid" ref={ref=>this.customerid=ref} type="text" label="客户编码" labelwidth="85" height="28" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={(e)=>this.handleKeyDown(e)} />
                    <MyInput id="companyname" ref={ref=>this.companyname=ref} type="text" label="客户名称" labelwidth="85" width="300" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="contactname" ref={ref=>this.contactname=ref} type="text" label="联系人" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyCombobox id="contacttitle" ref={ref=>this.contacttitle=ref} label="联系人职务" labelwidth="85" width="200" sqlprocedure="demo307b" sqlparams={null} style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
                    <MyInput id="address" ref={ref=>this.address=ref} type="text" label="客户地址" labelwidth="85" width="300" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />          
                    <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelectArea.bind(this)} />
                    <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" />
                    <MyInput id="phone" ref={ref=>this.phone=ref} label="联系电话" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="zip" ref={ref=>this.zip=ref} label="邮政编码" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="email" ref={ref=>this.email=ref} label="电子邮箱" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyInput id="homepage" ref={ref=>this.homepage=ref} label="主页网址" labelwidth="85" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
                    <MyCombobox id="typeid" ref={ref=>this.typeid=ref} label="客户类别" labelwidth="85" width="200" sqlprocedure="demo307c" sqlparams={{}} style={{marginTop:10}} />
                </div>
                <div className="layout-bottom" style={{backgroundColor:formColor, borderTop:'1px solid #95B8E7', height:42, textAlign:'right', paddingTop:7, paddingRight:16}}>
                  {this.state.addoredit !== 'query' && <button key="btnsave" style={{height: 25, width: 66}} onClick={this.handleSaveClick.bind(this)}>保存</button>}
                  <button key="btnreset" style={{height: 25, width: 66, marginLeft:6}} onClick={this.handleResetClick.bind(this)}>关闭</button>
                </div>
           </div>
         </div>
        )}
      </div>
    );
  }
}

  /*
  1.如何设计一个窗体？窗体如何设计标题和工具栏？窗体滚动条如何设计？如何打开窗体和关闭窗体？如何打开窗体时不能点击底色？
  2.窗体如何用鼠标拖动？窗体如何覆盖原来的文字z-index>1?
  3.窗体如何居中？

  */
