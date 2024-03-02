import React from 'react';
import { Panel, DataGrid, Tabs, TabPanel, GridColumn, GridHeaderRow, GridColumnGroup, Messager, CheckBox, ComboBox, Label, Layout, LayoutPanel, LinkButton, Dialog, ComboTree } from 'rc-easyui';
import { Menu, MenuItem, MenuSep, Tree } from 'rc-easyui';
import { MyComboBox, MyTextBox, MyNumberBox, MyFileUpload, MyComboTree, MyWindow } from '../../api/easyUIComponents.js'
import { reqdoSQL, reqdoTree, myStr2JsonArray } from '../../api/functions.js'
import * as myFunc from '../../api/functions.js'
import { MyDataGrid, MyComboGrid } from '../../api/datagrid.js'
import { MyTree } from '../../api/tree.js'
import { createRef } from 'react';
//import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers.js';
const rowheight=42;
export default class Page601 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      myGrid1: {
        data:[], total: 0, pageno: 1, pagesize: 20, rowindex: -1, reloadflag:1, row:{}, rows:[],
        fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;subcategoryid;supplierid;categoryname;companyname;photopath'
      },  //全部页的数据
      files: [],  //上传的文件  
      supplierGrid:{ keyvalue:'' },
      categoryTree:{data:[], keyvalue:''},
      addoredit: 'update',
      tablename: 'products',
      keyfield: 'productid',
      hidegridpanel:false      
    }    
  }

  async componentDidUpdate() {
  //添加键盘控制事件
    document.addEventListener('keydown', this.handleKeyEvents);
  }
  async componentWillUnmount() {
    //删除键盘控制事件
    document.removeEventListener('keydown', this.handleKeyEvents);
  }
  //编写键盘控制事件
  handleKeyEvents = async (e) => {
    //键盘判断
    if (e.keyCode === 13) {
      let id = document.activeElement.id;  //获取光标所在的控件id
      if (id === 'categoryid') this.handleBlurCategoryid();
      else if (id === 'supplierid') this.handleBlurSupplierid();
    }
    //console.log(e.keyCode);
  }
  //初始加载页面
  async componentDidMount() {  
    this.loadGridData(1, this.state.myGrid1.pagesize);
  }

  loadGridData = async (pageno, pagesize) => { //加载数据lllllllload
    //先触发close和open，假设翻页停在第3页，这时网格的pagesize和state.pageno均为3，参数pageno强制设置为1，state.reloadflag为0,因为handleExitClick中将data设置为空，网格发生变化清空。
    //此时执行存储过程，提取第3页数据并渲染加载到data和网格中，这时state.reloadflag为0, state.pageno变为3,pageno也是3，不执行存储过程
    //把data清空主要是为了概述用户感受，程序是对的。
    //alert(99);
    const grid = this.state.myGrid1;
    if (grid.reloadflag>0 || grid.pageno!=pageno || grid.pagesize!=pagesize ){  //避免重复加载
      var p = {};
      p.pageno = pageno;
      p.pagesize = pagesize;
      p.filter= this.filtertext.state.value;
      p.keyvalue='';
      p.sortfield='';
      p.sqlprocedure = 'demo503a';
      //console.log(777, p);
      const rs = await reqdoSQL(p); //1.获取到数据
      let total = (rs.rows.length === 0 ? 0 : parseInt(rs.rows[0].total)); //2.获取总行数
      for (let i=0; i<rs.rows.length; i++){
        rs.rows[i]._checked=false;   //添加一个属性_checked,初始值为false
      }
      var data = new Array(total).fill({});   //3.建立一个总行数长度的数组,其他行为空值
      let rowindex = this.state.myGrid1.rowindex;
      if (rowindex < 0 && total > 0) rowindex = 0;
      data.splice((pageno - 1) * pagesize, pagesize, ...rs.rows)  //4.替换数组中指定位置的数据
      //console.log(888, rs.rows, pageno, pagesize);
      if (rowindex > rs.rows.length - 1) rowindex = rs.rows.length - 1;  //???
      let row=grid.row;
      if (rs.rows.length>0) row=rs.rows[rowindex];
      //console.log(888, rs.rows, pageno, pagesize,rowindex);
      this.setState({ myGrid1:{ ...grid, data: data, total: total, row:row, rows: rs.rows, rowindex: rowindex, pageno: pageno, pagesize: pagesize, reloadflag:0}}, () => {
        setTimeout(() => {
          if (rowindex >= 0 && data.length > 0) {
            this.myGrid1.selectRow(data[(pageno - 1) * pagesize + rowindex]);
            this.myGrid1.scrollTo(data[(pageno - 1) * pagesize + rowindex]);
          }
        })
      });
    }
  }
  //定义右键菜单
  handleContextMenu(row,e) {
    e.preventDefault();
    this.myGrid1.selectRow(row);
    this.handleSelectRow(row);  
    this.myMenu1.showContextMenu(e.pageX, e.pageY);
  }

  handleBlurCategoryid = async () => {
    let p = {};
    p.tablename = 'categorytree';
    p.keyfield = 'categoryid';
    p.keyvalue = this.subcategoryid.state.value;
    p.sqlprocedure = "sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s = '';
    if (rs.rows.length > 0) s = rs.rows[0].categoryname;
    this.categoryname.setState({ value: s }, () => {
      setTimeout(() => {
         //
       })
     });
  }

  handleBlurSupplierid = async () => {
    let p = {};
    p.tablename = 'suppliers';
    p.keyfield = 'supplierid';
    p.keyvalue = this.supplierid.state.value;
    p.sqlprocedure = "sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s = '';
    if (rs.rows.length > 0) s = rs.rows[0].companyname;
    this.suppliername.setState({ value: s }, () => {
      setTimeout(() => {
        //
      })
    });
  }
  handleSelectionChange_supplier(row) {
    return;
    this.companyname.setState({ value: row.companyname });
    this.supplierid.setState({ value: row.supplierid });
    this.mySupplierWin.close();
  }
  handleRowSelect_supplierid = (row) => {
    console.log(601,row)
    this.supplierid.setState({value:row.supplierid});
    this.suppliername.setState({value:row.companyname});
    this.myWin2.close();
  }  

  handleRowSelect_categoryid = (node) => {
    console.log(601,node,node.ancestor)
    this.subcategoryid.setState({value: node.categoryid});
    this.categoryname.setState({value: node.categoryname});
    this.categoryid.setState({value: node.ancestor.split('#')[0]});
    this.myWin1.close();
  }  

  handleOpenWin1() {
    let tmp = this.state.myGrid1.fieldset.split(';');
    if (this.state.addoredit === 'add') {
      /*
      for (let i = 0; i<tmp.length;i++){
        if (this[tmp[i]]){
            this[tmp[i]].setState({value: ''});
          }
      }
      */
      for (let field of tmp) {
        this[field]?.setState({ value: '' })
      }
      this.productid.setState({ value: 0 });
      this.subcategoryid.setState({ value: 'A' });
      this.supplierid.setState({ value: 'wlj' });
    } else if (this.state.addoredit === 'update') {
      /*
      for (let i = 0; i<tmp.length;i++){
        if (this[tmp[i]]){
          this[tmp[i]].setState({value: this.state.row[tmp[i]]});
        }
      }
      */
      for (let field of tmp) {
        this[field]?.setState({ value: this.state.row[field] })
      }
    }
  }

  handleExitClick =  (e) => {  //eeeeeexit
    console.log(103);
    const grid = this.state.myGrid1;
    this.setState({hidegridpanel:false, myGrid1:{...grid, reloadflag:1}});
    //this.myGridPanel.style.visibility = 'visible';
    //this.myFormPanel.style.visibility = 'hidden' ;
    let { pageno, pagesize, total } = grid; //this.state.myGrid1;
    this.loadGridData(pageno, pagesize);
  }

  handleAddClick = async (e) => {  //aaaaaa
    //清空所有控件
    alert(999);
    const grid = this.state.myGrid1;
    this.setState({ addoredit: 'add', hidegridpanel:true, myGrid1:{...grid, reloadflag:1}});
    setTimeout(()=>{
      let tmp=this.state.myGrid1.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
        if(this[tmp[i]]!== undefined){
            this[tmp[i]].setState({value:''});
          }
      }
      this.productid.setState({ value:0 });  //自增列必须为0
      this.subcategoryid.setState({value: 'A'});
      this.supplierid.setState({value: 'wlj'});
    
    });
  }

  handleUpdateClick = async (e) => {//uuuuuuuuuu
    //this.myWin1.current.open();
    //return;
    //修改记录
    const grid=this.state.myGrid1;
    if (!grid.row.productid) return;
    this.setState({ addoredit: 'update', hidegridpanel:true, myGrid1:{...grid, reloadflag:1}});
    //this.myGridPanel.style.visibility = 'hidden';
    //this.myFormPanel.style.visibility = 'visible' ;
    setTimeout(()=>{
      let tmp=this.state.myGrid1.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
        if (this[tmp[i]]){
            this[tmp[i]].setState({value: grid.row[tmp[i]]});
          }
      }
    });
    
  }

  handleDeleteClick = (e) => {  //ddddddd
    //删除记录    
    const grid=this.state.myGrid1;
    let { rows } = grid;
    if (rows.length==0) return;
    let s='';    
    let n=0;
    for (let i=0; i<rows.length; i++){
       if (rows[i]._checked){
        if (n>0) s+=';';
        s+=rows[i].productid;
        n++;
       }
    }
    if (n==0){
      this.myMessage1.alert({
        msg: '没有选择需要删除的商品！',
        icon:'info'
      });
      return;
    } 
    this.myMessage1.confirm({
      msg: '是否确定删除【' + s + '】这'+n+'个商品？',
      result: async r => {
        if (r) {
          let p = {};
          let xdata = {};
          xdata.productid = this.state.row.productid;
          xdata._action = 'delete';
          xdata._reloadrow = 0;
          p.sqlprocedure = "demo502c";
          p.data = [];
          p.data.push(xdata);
          console.log(JSON.stringify(p.data));
          let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
          //删除记录后，重新定位到下一行。计算下一行的行号。
          const grid = this.state.myGrid1;
          let { pageno, pagesize, total } = grid; //this.state.myGrid1;
          let rowindex = this.state.myGrid1.rows.findIndex(item => item.productid === this.state.row.productid);
          let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
          if (rowno >= total) rowindex--;
          //console.log(333, rowindex, rowno, total, pageno);
          if (rowindex < 0) {
            pageno--;
            rowindex = 0;   //定位到上一页第一行
          }
          if (pageno>0) {
            if (pageno==this.state.myGrid1.pageno){
              this.setState({ myGrid1:{...grid, rowindex: rowindex, reloadflag:1}}, () => { //自动触发1次，先清空data
                setTimeout(() => {
                  this.loadGridData(pageno, pagesize);
                })
              });            
            }else{
              this.setState({ myGrid1:{...grid, rowindex: rowindex, pageno:pageno, reloadflag:1}}); //自动触发1次，先清空data
            }
          } 
        }
      }
    });
  }

  handleSaveClick = async (e) => {  //sssssssssssssssssssave
    let xdata={};
    let tmp=this.state.myGrid1.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
      //console.log(i,tmp[i]);
      if (this[tmp[i]]){
          if (tmp[i]==='photopath'){
            xdata[tmp[i]]= myStr2JsonArray(this[tmp[i]].state.value);
            console.log(6666666,xdata[tmp[i]]);
          }else{
            xdata[tmp[i]]=this[tmp[i]].state.value;
          } 
      }
    }
    xdata._action=this.state.addoredit;
    xdata._reloadrow=1;
    xdata._treeflag=0;
    let p={};
    p.sqlprocedure="demo504a";
    p.data=[];
    p.data.push(xdata);
    //console.log(p.data);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    //替换数组中的这个元素
    const grid = this.state.myGrid1;
    let {pageno, pagesize, total, rowindex}=grid; //this.state.myGrid1;
    if (this.state.addoredit==='add'){
      //新增记录，计算行号
      let rowno=rs.rows[0]._rowno;
      pageno=parseInt((rowno-1)/pagesize)+1;
      rowindex=rowno-(pageno-1)*pagesize-1;
      console.log(999,pageno,rowindex,rowno,this.state.myGrid1.pageno);
      this.setState({myGrid1:{...grid, total:total+1}});
    }
    this.setState({addoredit:'update', hidegridpanel:false, myGrid1:{...grid, rowindex:rowindex, reloadflag:1}}, () => { 
      setTimeout(() => {
          this.loadGridData(pageno, this.state.myGrid1.pagesize);
        })
      });
  }

  handleAddonButtonClick = async (flag) => {  //filter
    if (flag == 'flitertext') {
      this.loadGridData(1, this.state.myGrid1.pagesize);
    }
    else if (flag == 'categoryid') {
      let tree=this.state.categoryTree;
      let s=this.subcategoryid.state.value; 
      this.setState({ categoryTree: {...tree, keyvalue:s}}, () => {        
        setTimeout(() => {
          console.log(999,s)
          this.myWin1.open();
        })
      });
    }
    else if (flag == 'supplierid') {
      let grid=this.state.supplierGrid;
      let s=this.supplierid.state.value; 
      this.setState({ supplierGrid:{...grid, keyvalue:s}}, () => {        
        setTimeout(() => {
         this.myWin2.open();
        })
      });      
    }
  }

  handlePageChange = (pageNumber, pageSize) => {
    console.log(101,pageNumber, pageSize); 
    const grid = this.state.myGrid1; 
    this.setState({ myGrid1:{...grid, reloadflag:1} }); 
    this.loadGridData(pageNumber, pageSize);
  }

  handleRowCheck = (row, checked) => {
    //console.log(row, checked);
    row._checked=checked;
  }

  handleSelectRow(row) {
    if (!row) return;
    //选中一行，将值保存到state.row中去
    const grid = this.state.myGrid1;
    let rowindex = grid.rows.findIndex(item => item.productid === row.productid);
    this.setState({ myGrid1:{...grid, row: row, rowindex: rowindex }});
  }

  editRow = (row) => {
    this.myGrid1.selectRow(row);
    setTimeout(() => {
      //this.handleSelectRow(row);
      this.handleUpdateClick();
    });
  }

  deleteRow = (row) => {
    const grid = this.state.myGrid1;
    row.selected=true;
    row._checked=true;    
    this.setState({ myGrid1:{...grid, row: row }});
    this.myGrid1.selectRow(row);
    setTimeout(() => {
      //this.handleSelectRow(row);
      this.handleDeleteClick();
    });
  }  
  //6.定义调用的函数。这里是实现双击后可以开启网格的直接编辑功能
  myCellDblClick = (data) => {
    return;
    console.log(data); //是双击的行参数
    this.myGrid1.beginEdit(data.row, data.column); //7.调用可以开启编辑的方法 ,网格可编辑方法需要注意的点有1。必须在GridColumn中定义可编辑，比如这里的name
  }

  renderGridTitle( title) {
    return (<span className="labelStyle">{title}</span>);
  }

  renderNode({ node }) {
    let count = null;
    if (node.children && node.children.length) {
      count = <span style={{ color: 'blue' }}> ({node.children.length})</span>
    }
    return (
      <span>{node.text}{count}</span>
    )
  }

  loadSupplierGridData = async (pageno, pagesize) => { //加载数据lllllllload
      var p = {};
      p.pageno = pageno;
      p.pagesize = pagesize;
      p.filter= '';
      p.sqlprocedure = 'demo508d';
      const rs = await reqdoSQL(p); //1.获取到数据
      let total = (rs.rows.length === 0 ? 0 : parseInt(rs.rows[0].total)); //2.获取总行数
      var data = new Array(total).fill({});   //3.建立一个总行数长度的数组,其他行为空值
      let rowindex = this.state.rowindex;
      if (rowindex < 0 && total > 0) rowindex = 0;
      data.splice((pageno - 1) * pagesize, pagesize, ...rs.rows)  //4.替换数组中指定位置的数据
      if (rowindex > rs.rows.length - 1) rowindex = rs.rows.length - 1;  //???
      const grid = this.state.supplierGrid;
      this.setState({ supplierGrid:{...grid, data: data, total: total, rows: rs.rows, rowindex: rowindex, pageno: pageno, pagesize: pagesize} }, () => {
        setTimeout(() => {
          if (rowindex >= 0 && data.length > 0) {
            this.supplierGrid.selectRow(data[(pageno - 1) * pagesize + rowindex]);
            this.supplierGrid.scrollTo(data[(pageno - 1) * pagesize + rowindex]);
          }
        })
      });
  }

  handleClickmyMenu1 = (e) => {
    console.log(999,e);
  }
  
  myWin1=createRef();  

  render() {
    const grid = this.state.myGrid1;
    let { row }=grid;
    if (row===undefined) row={};    
    let p = {};
    p.sqlprocedure = 'demo502d';
    p.filtertext = '';
    let q= {};
    q.sqlprocedure = 'demo504w';
    //作业：添加叶子节点的商品节点个数
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>          
           <LayoutPanel region="north"  border={false} style={{}}>
             <div id="toolbar1" style={{ display:this.state.hidegridpanel? 'none' : 'block', paddingTop: 2, paddingLeft: 4, backgroundColor: '#E0ECFF', height: 33, overflow: 'hidden' }}>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="addIcon" onClick={this.handleAddClick.bind(this)} >新增</LinkButton>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)} >修改</LinkButton>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >刷新</LinkButton>
               <MyTextBox params='filtertext,快速过滤,70,2,300,0,290' ref={ref => this.filtertext = ref} addonRight={() => <span className='textbox-icon icon-search' onClick={this.handleAddonButtonClick.bind(this, 'filter')}></span>} />
             </div>
             <div id="toolbar2" style={{display:!this.state.hidegridpanel? 'none' : 'block', paddingTop: 2, paddingLeft: 4, backgroundColor: '#E0ECFF', height: 33, overflow: 'hidden' }}>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
               <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="exitIcon" onClick={this.handleExitClick.bind(this)} >返回</LinkButton>
             </div>
           </LayoutPanel>
           <LayoutPanel region="center" border={false} style={{ height: '100%' }}>
             <div ref={ref => this.myGridPanel = ref}  style={{ height: '100%', width: '100%', position: 'absolute', visibility: this.state.hidegridpanel? 'hidden':'visible'}}>
               <DataGrid ref={ref => this.myGrid1 = ref} columnResizing pagination CheckBox border={false} style={{ width: '100%', height: '100%', position: 'absolute', paddingRight:'8px' }}
                 data={this.state.myGrid1.data} frozenWidth="395px" selectionMode='single' //0.设置只能select一行，否则选中没有高亮           
                 onRowSelect={(row) => this.handleSelectRow(row)} onCellDblClick={(data) => this.myCellDblClick(data)} //4.表格的单元格双击事件调用的函数
                 pageOptions={{ total: this.state.myGrid1.total, layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'refresh', 'sep', 'manual', 'info'], displayMsg: '当前显示 {from}~{to}行， 共{total}行', beforePageText: '第', afterPageText: '页' }}
                 pageNumber={this.state.myGrid1.pageno} pageSize={this.state.myGrid1.pagesize}
                 xonPageChange={({ pageNumber, pageSize }) => {const grid = this.state.myGrid1; this.setState({ myGrid1:{...grid, reloadflag:1} }); this.loadGridData(pageNumber, pageSize);}}
                 onPageChange={({ pageNumber, pageSize }) => {this.handlePageChange(pageNumber, pageSize)}}                    
                 onRowContextMenu={({ row, originalEvent }) => this.handleContextMenu(row, originalEvent)} 
               >
                 <GridColumn frozen width={35} align='center' field='_rowindex' render={({ rowIndex }) => (<span style={{fontFamily:'times new roman'}}>{rowIndex + 1}</span>)}></GridColumn>
                 <GridColumn frozen width={35} align='center' field='_checked'
                   render={({ row }) => (<CheckBox checked={row.selected} onChange={(checked) => this.handleRowCheck(row, checked)}></CheckBox>)}
                   header={() => (<CheckBox checked={this.state.allChecked} xonChange={(checked) => this.handleAllCheck(checked)}></CheckBox>)}>
                 </GridColumn>
                 <GridColumn frozen title={this.renderGridTitle('操作')} width={50} align="center" field="_action" render={({ row }) => (
                   <div>
                      <LinkButton style={{height:20,width:20}} plain iconCls='updateIcon' onClick={() => this.editRow(row)}></LinkButton>
                      <LinkButton style={{height:20,width:20}} plain iconCls="removeIcon" onClick={() => this.deleteRow(row)}></LinkButton>
                   </div>)}>
                 </GridColumn>
                 <GridColumn frozen width={75} field="productid" title="商品编码" halign="center" align="center" 
                   render={({ row }) => (<div style={{ fontFamily:'times new roman' }}>{row.productid}</div>)}></GridColumn>
                 <GridColumn frozen width={200} field="productname" title="商品名称" halign="center"></GridColumn>
                 <GridColumn field="englishname" title="英文名称" width={220} halign="center" editable
                   render={({ row }) => (<div style={{ fontFamily:'times new roman' }}>{row.englishname}</div>)}></GridColumn>
                 <GridColumn field="quantityperunit" title="规格型号" width={180} halign="center" align="left" editable></GridColumn>
                 <GridColumn field="unit" title="计量单位" width={80} halign="center" align="center"></GridColumn>
                 <GridColumn field="unitprice" title="单价" width={100} halign="center" align="right" cellCss={this.getCellCss}></GridColumn>
                 <GridColumn field="supplierid" title="供应商编码" align="center" width={100} halign="center" ></GridColumn>
                 <GridColumn field="suppliername" title="供应商名称" align="center" width={260} halign="center" ></GridColumn>
                 <GridColumn field="address" title="供应商地址" align="center" width={260} halign="center" ></GridColumn>
                 <GridColumn field="categoryid" title="类别编码" align="center" width={80} halign="center" ></GridColumn>
                 <GridColumn field="categoryname" title="类别名称" align="center" width={160} halign="center" ></GridColumn>
                 <GridColumnGroup frozen align="right" width="52px">
                    <GridHeaderRow>
                      <GridColumn frozen title={myFunc.renderGridTitle("操作")} width={50} align="center" field="_action" render={({ row }) => (
                        <div>
                          <LinkButton style={{height:20,width:20}} plain iconCls='updateIcon' onClick={() => this.editRow(row)}></LinkButton>
                          <LinkButton style={{height:20,width:20}} plain iconCls="removeIcon" onClick={() => this.deleteRow(row)}></LinkButton>
                        </div>)}>
                      </GridColumn>
                   </GridHeaderRow>
                 </GridColumnGroup>
              </DataGrid>
            </div>
            <div ref={ref => this.myFormPanel = ref} style={{ height: '100%', width: '100%', position: 'absolute', visibility: !this.state.hidegridpanel? 'hidden':'visible'}}>
               <Tabs ref={ref => this.myTabs = ref}  border={false} style={{ height: '100%', width: '100%', position: 'absolute' }}  tabPosition='top'>
                  <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="基本信息" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }}>
                    <MyTextBox params='productid,商品编码,72,20,20,0,150,,readonly' ref={ref => this.productid = ref} />
                    <MyTextBox params='productname,商品名称,72,0,20,0,350' top={20 + 1 * rowheight} ref={ref => this.productname = ref} />
                    <MyTextBox params='englishname,英文名称,72,0,20,0,350' top={20 + 2 * rowheight} ref={ref => this.englishname = ref} />
                    <MyTextBox params='quantityperunit,规格型号,72,0,20,0,350' top={20 + 3 * rowheight} ref={ref => this.quantityperunit = ref} />
                    <MyTextBox params='unit,计量单位,72,0,20,0,150' top={20 + 4 * rowheight} ref={ref => this.unit = ref} />
                    <MyNumberBox params='unitprice,单价,72,0,20,0,150' top={20 + 5 * rowheight} ref={ref => this.unitprice = ref} />
                    <MyTextBox params='subcategoryid,商品类别,72,0,20,0,150' top={20 + 6 * rowheight} ref={ref => this.subcategoryid = ref} onBlur={this.handleBlurCategoryid.bind(this)} addonRight={() => <span className='textbox-icon icon-help' onClick={this.handleAddonButtonClick.bind(this, 'categoryid')}></span>} />
                    <MyTextBox id='categoryid' ref={ref => this.categoryid = ref} hidden />
                    <MyTextBox params='categoryname,,0,0,260,0,300,,readonly' top={20 + 6 * rowheight} ref={ref => this.categoryname = ref} />
                    <MyTextBox params='supplierid,供应商,72,0,20,0,150' top={20 + 7 * rowheight} ref={ref => this.supplierid = ref} onBlur={this.handleBlurSupplierid.bind(this)} addonRight={() => <span className='textbox-icon icon-help' onClick={this.handleAddonButtonClick.bind(this, 'supplierid')}></span>} />
                    <MyComboBox params='suppliername,,0,0,260,0,300' top={20 + 7 * rowheight} sqlparams={p} ref={ref => this.suppliername = ref} />
                  </TabPanel>
                  <TabPanel ref={ref => this.myTab2 = ref} key="myTab2" title="图片上传" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }}>
                     <MyFileUpload ref={ref => this.photopath = ref} params='imagepath,选择文件,200,120' maxsize='100' layout='span' 
                      data={row.photopath} filetag={row.productid} filepath='\\mybase\\resources' />
                  </TabPanel>
                </Tabs>
            </div>
          </LayoutPanel>
        </Layout>
        <Dialog title='选择商品类别' ref={ref => this.myWin1 = ref} style={{ height: 472, width: 460 }} bodyCls="f-column" modal='false' draggable closed >
          <MyTree ref={ref => this.myTree1 = ref} sqlprocedure='demo601c' xtreestyle='full' 
            xsqlprocedure='demo601a' treestyle='full' 
            tablename='categorytree' keyfield='categoryid' keyvalue={this.state.categoryTree.keyvalue} 
            bbar='ok;close' tbar='filter' onlyLeafCheck 
            onNodeDblClick={(node) => {this.handleRowSelect_categoryid(node)}}
            onClose={()=>{this.myWin1.close();}}
          />
        </Dialog>
        <Dialog title='选择供应商' ref={ref => this.myWin2 = ref} style={{ height: 472, width: 860 }} bodyCls="f-column" modal='false' draggable closed>
          <MyDataGrid ref={ref => this.myGrid2 = ref} sqlprocedure='demo508d' pagesize='10' 
            keyvalue={this.state.supplierGrid.keyvalue} bbar='ok;close' tbar='filter'
            fixedcolumns='[#80%d]供应商编码/supplierid' 
            columns='[#200]供应商名称/companyname;[@c#100%d]所属城市/city;[#180]地址/address'
            onRowDblClick={(row) => {this.handleRowSelect_supplierid(row)}}
            onClose={()=>{this.myWin2.close();}}
          />
        </Dialog>
        <Messager title='系统提示' ref={ref => this.myMessage1 = ref}></Messager>
        <div>
          <Menu onItemClick={(e) => { this.handleClickmyMenu1(e) }} ref={ref => this.myMenu1 = ref}>
            <MenuItem text="新增" iconCls="addIcon" id="menu-add" ></MenuItem>
            <MenuItem text="修改" iconCls="editIcon" id="menu-edit"></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="删除" iconCls="deleteIcon" id="menu-delete"></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="刷新" iconCls="refreshIcon" id="menu-refresh"></MenuItem>
          </Menu>
        </div>

      </div>
    );
  }
}
