import React from 'react';
import { Panel, DataGrid, Tabs, TabPanel, GridColumn, Messager, CheckBox, ComboBox, Label, Layout, LayoutPanel, LinkButton, Dialog, ComboTree } from 'rc-easyui';
import { Form, Menu, MenuItem, MenuSep, Tree } from 'rc-easyui';
import { MyDateBox, MyNumberBox, MyComboBox, MyTextBox, MyFileUpload, MyComboTree, MyWindow } from '../../api/easyUIComponents.js'
import { myStr2JsonArray, addTreeChildrenData, reqdoSQL, reqdoTree  } from '../../api/functions.js'
import { MyDataGrid, MyComboGrid } from '../../api/datagrid.js'
import { createRef } from 'react';
//import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers.js';
//import { ComponentModel } from 'echarts';
const rowheight = 42;
export default class Page604 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { //写属性
      myGrid1: {
        data: [], row: {}, rows: [],
        fieldset: 'productid;productname;quantityperunit;unit;quantity;discount;unitprice;amount'
      },
      productGrid: { keyvalue:'', row:{} },
      customerGrid:{ keyvalue:'', row:{} },
      myTree1: {
        data: [], node: {},
        fieldset: 'orderid;customerid;orderdate;requireddate;invoicedate;shippeddate;companyname;employeeid;employeename'
      },  //树的数据
      files: [],  //上传的文件  
      categoryComboTree: { data: [] },  //this.myTree1.data
      addoredit: 'update',
      tablename: 'products',
      keyfield: 'productid',
      fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;supplierid;categoryname;companyname;photopath',
      hidegridpanel: false
    }
  }

  async componentDidMount() {    
    console.log('2仅在第一次渲染后在客户端执行。');
    //myParseGridColumns();    
    this.loadTreeData();    
  }

  componentWillMount() {
    //console.log('1在渲染之前执行，在客户端和服务器端都会执行。');
  }

  componentWillUpdate() {
    //console.log('3在DOM中进行渲染之前调用。');
  }

  componentDidUpdate() {
    //console.log('4在渲染发生后立即调用。');
  }
  componentWillUnmount() {
    //console.log('5从 DOM 卸载组件后调用。用于清理内存空间。')
  }

  loadTreeData = async () => {
    let p = {};
    p.style = "expand";
    p.xdate = '2019-12-31';
    p.level = 1;
    p.sqlprocedure = 'demo604a';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
    const tree = this.state.myTree1;
    let data = rs.rows;
    //节点定位
    let pnode = data.find(node => node.id == '2019-12-27');
    if (pnode){
      //获取子节点
      pnode.children = await this.getChildNodes(pnode);
    }
    this.setState({ myTree1: { ...tree, data: rs.rows } }, () => {
      this.myTree1.expandNode(pnode);
      this.myTree1.selectNode(pnode.children[0]);
    });
  }

  getChildNodes = async (pnode) => {
    //从数据库提取一个节点的子节点
    let p = {};
    p.style = "expand";
    p.parentnodeid = pnode.id;
    p.level = parseInt(pnode.level) + 1;
    p.xdate = pnode.id;
    p.sqlprocedure = 'demo604a';
    return (await reqdoTree(p)).rows;
  }

  async handleNodeExpand(node) {  //新增和展开子节点
    if (node.children && node.children.length === 1 && node.children[0].text.trim() === ''){
      let rows = await this.getChildNodes(node);
      const tree = this.state.myTree1;
      let data = tree.data;
      //替换原数组data中的children值
      data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      this.setState({ myTree1: { ...tree, data: data } }, () => {
        setTimeout(() => {
          this.myTree1.expandNode(node);
          this.myTree1.selectNode(node);
        })
      });
    }
  }

  handleTreeDblClick(node) {
    if (node.isparentflag > 0) {
      if (node.state === 'closed') this.myTree1.expandNode(node);
      else this.myTree1.collapseNode(node);
    }
  }

  handleFilter(value) {
    this.myTree1.doFilter(value);
  }

  async componentDidUpdate() {
    //添加键盘控制事件
    document.addEventListener('keydown', this.handleKeyEvents);
  }
  async componentWillUnmount() {
    //删除键盘控制事件
    document.removeEventListener('keydown', this.handleKeyEvents);
  }
  //键盘事件
  handleKeyEvents = async (e) => { //键盘判断
    if (e.keyCode === 13) {  //回车键
      let id = document.activeElement.id;  //获取光标所在的控件id
      if (id=='productid') this.handleBlurProductid();
      else if (id=='customerid') this.handleBlurCustomerid();
      else if (id=='quantity' || id=='unitprice' || id=='discount' ) this.handleSetAmount(id);
      //键盘操作
      let tmp=this.state.myGrid1.fieldset.split(';'); 
      let fields=tmp.filter((field)=>this[field].state.editable);
      let index=fields.findIndex((field)=>field==id);
      if (index>=0) {
        if (index<fields.length-1) index++;
          else index=0;          
          console.log(777,fields[index],document.getElementById(fields[index]));
          document.getElementById(fields[index]).focus();
      }

      /*
      for (let field of fields){
        if (console.log(field,this[field].state.editable);
      }
      */

    }
  }

  async handleSelectionChange(node) {  //树节点选中事件
    if (node.level == 2) {
      const tree = this.state.myTree1;
      const grid = this.state.myGrid1;
      let tmp = tree.fieldset.split(';');
      this.setState({ myTree1: { ...tree, node: node }, myGrid1: { ...grid, reloadflag: 1 } }, () => {
        setTimeout(() => {
          for (let field of tmp) {
            //console.log(field,node[field])
            this[field]?.setState({ value: node[field] })
          }
          this.loadGridData(node);
        })
      });
    }
  }

  loadGridData = async (node) => { //加载数据lllllllload
    const tree = this.state.myTree1;  //树中被选中的节点
    const grid = this.state.myGrid1;
    var p = {};
    p.orderid = node.id;
    p.sqlprocedure = 'demo604c';
    const rs = await reqdoSQL(p); //1.获取到数据
    this.setState({ myGrid1: { ...grid, data: rs.rows } }, () => {
      setTimeout(() => {
        this.myGrid1.selectRow(rs.rows[0]);
      })
    });
  }

  handleContextMenu(row, e) {  //定义右键菜单
    e.preventDefault();
    this.myGrid1.selectRow(row);
    this.handleSelectRow(row);
    this.myMenu1.showContextMenu(e.pageX, e.pageY);
  }

  handleBlurCustomerid = async () => {
    // let p = {};
    // p.tablename = 'categories';
    // p.keyfield = 'categoryid';
    // p.keyvalue = this.categoryid.state.value;
    // p.sqlprocedure = "sys_getTableRow";
    // let rs = await reqdoSQL(p);
    // let s = '';
    // if (rs.rows.length > 0) s = rs.rows[0].categoryname;
    // this.categoryname.setState({ value: s }, () => {
    //   setTimeout(() => {
    //     //myLoadData(this.companyname);
    //   })
    // });
  }

  handleSelectionChange_supplier = (row) => {
    return;
    this.companyname.setState({ value: row.companyname });
    this.supplierid.setState({ value: row.supplierid });
    this.mySupplierWin.close();
  }

  handleBlurProductid = async () => {    
    let p = {};
    p.tablename = 'products';
    p.keyfield = 'productid';
    p.keyvalue = this.productid.state.value;
    p.sqlprocedure = "sys_getTableRow";
    let rs = await reqdoSQL(p);
    if (rs.rows.length > 0) {
      this.productname.setState({ value: rs.rows[0].productname });
      this.quantityperunit.setState({ value: rs.rows[0].quantityperunit });
      this.unit.setState({ value: rs.rows[0].unit });
    } else {
      this.productname.setState({ value: '' });
      this.quantityperunit.setState({ value: '' });
      this.unit.setState({ value: '' });
    }
  }

  handleExitClick = (e) => {  //eeeeeexit
    console.log(103);
    const grid = this.state.myGrid1;
    this.setState({ hidegridpanel: false, myGrid1: { ...grid, reloadflag: 1 } });
    //this.myGridPanel.style.visibility = 'visible';
    //this.myFormPanel.style.visibility = 'hidden' ;
    let { pageno, pagesize, total } = grid; //this.state.myGrid1;
    this.loadGridData(pageno, pagesize);
  }

  handleAddClick = async (e) => {  //aaaaaa
    //清空所有控件
    const grid = this.state.myGrid1;
    this.setState({ addoredit: 'add', hidegridpanel: true, myGrid1: { ...grid, reloadflag: 1 } });
    setTimeout(() => {
      let tmp = this.state.fieldset.split(';');
      for (let i = 0; i < tmp.length; i++) {
        if (this[tmp[i]] !== undefined) {
          this[tmp[i]].setState({ value: '' });
        }
      }
      this.productid.setState({ value: 0 });  //自增列必须为0
      this.categoryid.setState({ value: 'A' });
      this.supplierid.setState({ value: 'wlj' });

    });
  }

  handleUpdateClick = async (e) => {//uuuuuuuuuu
    //this.myWin1.current.open();
    //return;
    //修改记录
    const grid = this.state.myGrid1;
    if (!grid.row.productid) return;
    this.setState({ addoredit: 'update', hidegridpanel: true, myGrid1: { ...grid, reloadflag: 1 } });
    //this.myGridPanel.style.visibility = 'hidden';
    //this.myFormPanel.style.visibility = 'visible' ;
    setTimeout(() => {
      let tmp = this.state.fieldset.split(';');
      for (let i = 0; i < tmp.length; i++) {
        if (this[tmp[i]]) {
          this[tmp[i]].setState({ value: grid.row[tmp[i]] });
        }
      }
    });
  }

  handleDeleteClick = (e) => {  //ddddddd
    //删除记录    
    const grid = this.state.myGrid1;
    let { rows } = grid;
    if (rows.length == 0) return;
    let s = '';
    let n = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i]._checked) {
        if (n > 0) s += ';';
        s += rows[i].productid;
        n++;
      }
    }
    if (n == 0) {
      this.myMessage1.alert({
        msg: '没有选择需要删除的商品！',
        icon: 'info'
      });
      return;
    }
    this.myMessage1.confirm({
      msg: '是否确定删除【' + s + '】这' + n + '个商品？',
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
          if (rowindex < 0) {
            pageno--;
            rowindex = 0;   //定位到上一页第一行
          }
          if (pageno > 0) {
            if (pageno == this.state.myGrid1.pageno) {
              this.setState({ myGrid1: { ...grid, rowindex: rowindex, reloadflag: 1 } }, () => { //自动触发1次，先清空data
                setTimeout(() => {
                  this.loadGridData(pageno, pagesize);
                })
              });
            } else {
              this.setState({ myGrid1: { ...grid, rowindex: rowindex, pageno: pageno, reloadflag: 1 } }); //自动触发1次，先清空data
            }
          }
        }
      }
    });
  }

  handleSaveClick = async (e) => {  //sssssssssssssssssssave
    //汇总myGrid1中orderitems中的数据，同一个商品只出现一次，销售额合计后单价加权平均
    let data=[...this.state.myGrid1.data];
    let row={};  //row.p55=0 row.p55+=row.p55+amount
    for (let i=0; i<data.length; i++){
      let s1='m'+data[i].productid;   //s='p'+64='p64'
      let s2='q'+data[i].productid;   //s='p'+64='p64'
      if (row[s1]===undefined){ 
        row[s1]=0; 
        row[s2]=0;
      }  //row.p64=0
      row[s1]+=parseFloat(data[i].amount);  //row.p64=row.p64+12571.50=12571.50+14700.00  +6526.80  
      row[s2]+=parseFloat(data[i].quantity);  //row.p64=row.p64+12571.50=12571.50+14700.00  +6526.80        
    }
    console.log(661,row);
    let rows=[];
    for (let i=0; i<data.length; i++){
      let s1='m'+data[i].productid;   //s='p'+64='p64'
      let s2='q'+data[i].productid;   //s='p'+64='p64'
      if (row[s1]===undefined){ 
        row[s1]=0; 
        row[s2]=0;
      }  //row.p64=0
      row[s1]+=parseFloat(data[i].amount);  //row.p64=row.p64+12571.50=12571.50+14700.00  +6526.80  
      row[s2]+=parseFloat(data[i].quantity);  //row.p64=row.p64+12571.50=12571.50+14700.00  +6526.80        
    }

    for (let key in row){
      console.log(668, key);

    }
    return;
    let xdata = {};
    let tmp = this.state.fieldset.split(';');
    for (let i = 0; i < tmp.length; i++) {
      if (this[tmp[i]]) {
        if (tmp[i] === 'photopath') {
          xdata[tmp[i]] = myStr2JsonArray(this[tmp[i]].state.value);
          console.log(6666666, xdata[tmp[i]]);
        } else {
          xdata[tmp[i]] = this[tmp[i]].state.value;
        }
      }
    }
    xdata._action = this.state.addoredit;
    xdata._reloadrow = 1;
    xdata._treeflag = 0;
    let p = {};
    p.sqlprocedure = "demo504a";
    p.data = [];
    p.data.push(xdata);
    //console.log(p.data);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    //替换数组中的这个元素
    const grid = this.state.myGrid1;
    let { pageno, pagesize, total, rowindex } = grid; //this.state.myGrid1;
    if (this.state.addoredit === 'add') {
      //新增记录，计算行号
      let rowno = rs.rows[0]._rowno;
      pageno = parseInt((rowno - 1) / pagesize) + 1;
      rowindex = rowno - (pageno - 1) * pagesize - 1;
      console.log(999, pageno, rowindex, rowno, this.state.myGrid1.pageno);
      this.setState({ myGrid1: { ...grid, total: total + 1 } });
    }
    this.setState({ addoredit: 'update', hidegridpanel: false, myGrid1: { ...grid, rowindex: rowindex, reloadflag: 1 } }, () => {
      setTimeout(() => {
        this.loadGridData(pageno, this.state.myGrid1.pagesize);
      })
    });
  }

  handleAddonClick = async (flag) => {  //addon小图标点击事件
    if (flag == 'fliter1') {
      const grid = this.state.myGrid1;
      let p = {};
      p.filter = this.filter.state.value;
      p.sqlprocedure = 'demo502a';
      let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
      this.setState({ myGrid1: { ...grid, data: rs.rows } }, () => {
        setTimeout(() => {
          if (rs.rows.length > 0) this.myGrid1.selectRow(rs.rows[0]);
        })
      });
    }else if (flag == 'productid') { //pppppp
       let grid=this.state.productGrid;
       let s=this.productid.state.value; 
       this.setState({ productGrid:{...grid, keyvalue:s}}, () => {        
        setTimeout(() => {
          this.myWin1.open();
        })
     });      
    }else if (flag == 'customerid') {
      let grid=this.state.customerGrid;
      let s=this.customerid.state.value; 
      this.setState({ customerGrid:{...grid, keyvalue:s}}, () => {        
        setTimeout(() => {
           this.myWin2.open();
         })
      });
    }else if (flag == 'supplierid') {
       this.myWin3.open();
    }
  }

  handleOpenWin1 = async () => {  //wwwwwwwwww
    //let grid=this.state.productGrid;
    //this.setState({ productGrid:{...grid, reloadflag:0}})       
    //console.log(335, this.state.productGrid.pageno, this.state.productGrid.reloadflag)
  }

  handleOpenWin2 = async () => {

    
  }

  handleRowSelect_productid = (row) => {
    console.log(604,row)
    this.productid.setState({value:row.productid})
    this.productname.setState({value:row.productname})
    this.quantityperunit.setState({value:row.quantityperunit})
    this.unit.setState({value:row.unit})
    this.myWin1.close();
  }  

  handleRowSelect_customerid = (row) => {
    console.log(604,row)
    this.customerid.setState({value:row.customerid});
    this.companyname.setState({value:row.companyname});
    this.myWin2.close();
  }  

  handleRowCheck = (row, checked) => {
    //console.log(row, checked);
    row._checked = checked;
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
    row.selected = true;
    row._checked = true;
    this.setState({ myGrid1: { ...grid, row: row } });
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

  renderNode({ node }) {
    let count = null;
    if (node.children && node.children.length) {
      count = <span style={{ color: 'blue' }}> ({node.children.length})</span>
    }
    return (
      <span>{node.text}{count}</span>
    )
  }

  handleSelectRow = (row) => {
    //选中myGrid1中的一行，将值保存到state.row中去
    if (!row) return;
    const grid = this.state.myGrid1;
    let tmp = grid.fieldset.split(';');
    this.setState({ myGrid1: { ...grid, row:row } }, () => {
      setTimeout(() => {
        for (let field of tmp) {
          //console.log(field,row[field])
          this[field]?.setState({ value: row[field] })
        }
      })
    });
    //let rowindex = grid.rows.findIndex(item => item.productid === row.productid);
    //this.setState({ myGrid1:{...grid, row: row, rowindex: rowindex }});
  }

  handleAddonButtonClick = () => {
    //
  }

  handleAddRowClick = () => {  //aaaaaaaaaaaaa
    //添加销售明细记录
    const grid = this.state.myGrid1;
    let data = [...grid.data];
    //判断有没有空行存在
    let index = data.findIndex((item) => item.sysrowno < 0);
    let row = {};
    if (index < 0) {
      row.sysrowno = -1 * data.length;  //记录新增的行，有可能要被删除的
      row.productid = '';
      row.productname = '';
      row.quantityperunit = '';
      row.unit = '';
      row.unitprice = 0;
      row.quantity = 0;
      row.discount = 0;
      row.amount = 0;
      data.push(row);
    } else {
      row = data[index];
    }
    this.setState({ myGrid1: { ...grid, data: data, row: row } }, () => {
      setTimeout(() => {
        this.myGrid1.scrollTo(row);
        this.myGrid1.selectRow(row);
      })
    });
  }

  handleSaveRowClick = () => {  //ssssssssssss
    //保存明细销售记录
    if (this.productid.state.value==''||this.productname.state.value=='') return;
    const grid = this.state.myGrid1;
    let data = [...grid.data];
    let row = {...grid.row};    
    let index = data.findIndex((item) => item.sysrowno == row.sysrowno)
    let tmp = grid.fieldset.split(';');
    for (let field of tmp) {
      if (this[field]) row[field] = this[field].state.value;
    }
    row.sysrowno = index + 1;
    data[index] = row;
    this.setState({ myGrid1: { ...grid, data: data } }, () => {
      setTimeout(() => {
        this.myGrid1.selectRow(row);
      })
    });
  }

  handleDeleteRowClick = () => {    
    //删除销售明细记录
    console.log(777,this.state.myGrid1.row);
    const grid = this.state.myGrid1;
    let data = [...grid.data];
    let row=grid.row;
    let index = data.findIndex((item) => item.sysrowno == row.sysrowno);
    data.splice(index,1);
    console.log(index,data.length)
    if (index>data.length-1 && index>0) index--;
    this.setState({ myGrid1: { ...grid, data: data } }, () => {
      setTimeout(() => {
        if (index>=0 && data.length>0) this.myGrid1.selectRow(data[index]);
      })
    });
    

  }

  myOnFocusEvent =  async (id) =>{
    //控件onchange事件补充
    console.log(999,id);
    return;  
  }

  handleSetAmount = (id) => {    
    setTimeout(() => {
      //使用react无法获取最新值，可能onChange有问题
      let x1 = parseFloat(document.getElementById('quantity').value);
      let x2 = parseFloat(document.getElementById('unitprice').value);
      let x3 = parseFloat(document.getElementById('discount').value);      
      //let x=parseFloat(this.quantity.state.value)*parseFloat(this.unitprice.state.value)*(1-parseFloat(this.discount.state.value));
      //console.log(333,id,this.quantity.state.value,this.unitprice.state.value,this.discount.state.value);
      //console.log(333,id,x1,x2,x3);
      this.amount.setState({value:x1*x2*(1-x3).toFixed(2)});  
    })
  }

  setTabHeader() {
    return (
      <div key='header1' style={{ float: 'right' }}>
        <LinkButton key="addbtn1" style={{ width: 78, height: 28 }} xplain iconAlign="left" iconCls="addIcon" onClick={this.handleAddRowClick.bind(this)} >新增行</LinkButton>
        <LinkButton key="delbtn1" style={{ width: 78, height: 28 }} xplain iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteRowClick.bind(this)} >删除行</LinkButton>
        <LinkButton key="savebtn1" style={{ width: 78, height: 28 }} xplain iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveRowClick.bind(this)} >保存行</LinkButton>
      </div>
    )
  }

  handleOnFocus = () => {
    let grid=this.state.productGrid;
    this.setState({ productGrid: { ...grid, pageno:6, rowindex:5 } }, () => {
      setTimeout(() => {
        //this.myGrid1.selectRow(row);
      })
    });
  }

  myWin1 = createRef();

  render() {
    const grid = this.state.myGrid1;
    let { row } = grid;
    if (row === undefined) row = {};
    let p = {};
    p.sqlprocedure = 'demo502d';
    p.filtertext = '';
    let q = {};
    q.sqlprocedure = 'demo504w';
    //console.log(119,this.state.productGrid)
    //作业：添加叶子节点的商品节点个数
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <LayoutPanel region="north" border={false}>
            <div id="toolbar1" style={{ paddingTop: 2, paddingLeft: 4, backgroundColor: '#E0ECFF', height: 33, overflow: 'hidden' }}>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="addIcon" onClick={this.handleAddClick.bind(this)} >新增</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)} >修改</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
              <MyTextBox params='filter1,快速过滤,70,2,300,0,290' ref={ref => this.filter1 = ref} addonRight={() => <span className='textbox-icon icon-search' onClick={this.handleAddonClick.bind(this, 'filter1')}></span>} />
            </div>
          </LayoutPanel>
          <LayoutPanel region="west" title='2019年订单' style={{ width: 300 }} collapsible expander border={true} split>
            <div style={{ overflow: 'auto', width: '100%', height: '100%', position: 'relative' }}>
              <Tabs ref={ref => this.myTabs = ref} border={false} style={{ borderRight: '1px solid #95B8E7', height: '100%', width: '100%', position: 'absolute' }}>
                <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" border={false} title="当月订单" style={{ height: '100%', width: '100%', position: 'absolute' }}>
                  <Tree data={this.state.myTree1.data} checkbox={false} border={false} ref={node => this.myTree1 = node} style={{ overflow: 'auto', width: '100%' }}
                    onNodeDblClick={this.handleTreeDblClick.bind(this)} xrender={this.renderNode} onNodeExpand={this.handleNodeExpand.bind(this)} onSelectionChange={this.handleSelectionChange.bind(this)}>
                  </Tree>
                </TabPanel>
                <TabPanel ref={ref => this.myTab2 = ref} key="myTab2" border={false} title="当年订单">
                  <Tree data={this.state.myTree1.data} checkbox={false} border={true} ref={node => this.myTree2 = node} style={{ overflow: 'auto', width: '100%', height: '100%', position: 'absolute' }}
                    onSelectionChange={this.handleSelectionChange.bind(this)}>
                  </Tree>
                </TabPanel>
              </Tabs>
            </div>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <Layout>
              <LayoutPanel region="north" border={false} style={{ height: 92 }}>
                <MyTextBox params='orderid,订单编号,70,10,20,0,120' ref={ref => this.orderid = ref} />
                <MyDateBox params='orderdate,订单日期,70,10,260,0,120' ref={ref => this.orderdate = ref} xaddonRight={() => <span className='textbox-icon icon-search' onClick={this.handleButtonClick.bind(this, 'filter1')}></span>} />
                <MyDateBox params='requireddate,要货日期,70,10,510,0,120' ref={ref => this.requireddate = ref} />
                <MyTextBox params='customerid,客户编码,70,50,20,0,120' ref={ref => this.customerid = ref} onBlur={this.handleBlurCustomerid.bind(this)} addonRight={() => <span className='textbox-icon icon-help' onClick={this.handleAddonClick.bind(this, 'customerid')}></span>} />
                <MyTextBox params='companyname,客户名称,70,50,260,0,372' ref={ref => this.companyname = ref} />
              </LayoutPanel>
              <LayoutPanel region="south" border={false} style={{ height: 216, borderTop: '1px solid #95B8E7', borderRight: '1px solid #95B8E7', borderBottom: '1px solid #95B8E7', overflow: 'auto' }} split>
                <Tabs ref={ref => this.myTabs = ref} border={false} style={{ height: '100%', width: '100%', position: 'absolute' }} tools={this.setTabHeader.bind(this)} tabPosition='top'>
                  <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="订单明细" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }} >
                    <MyTextBox params='productid,商品编码,70,15,20,0,140,,help' ref={ref => this.productid = ref} 
                     onBlur={this.handleBlurProductid.bind(this)} addonRight={() => <span className='textbox-icon icon-help' onClick={this.handleAddonClick.bind(this, 'productid')}></span>} />                   
                    <MyTextBox params='productname,商品名称,70,15,330,0,300,,readonly' ref={ref => this.productname = ref} />
                    <MyTextBox params='quantityperunit,规格型号,70,55,20,0,140,,readonly' ref={ref => this.quantityperunit = ref} />
                    <MyTextBox params='unit,计量单位,70,55,330,0,140,,readonly' ref={ref => this.unit = ref} />
                    <MyNumberBox id='quantity' params='quantity,销售数量,70,95,20,0,140' ref={ref => this.quantity = ref} onBlur={this.handleSetAmount.bind(this,'quantity')} xonChange={(value)=>console.log(777,value)} />
                    <MyNumberBox params='unitprice,销售单价,70,95,330,0,140,20.00' precision='2' min='0.01' ref={ref => this.unitprice = ref} onBlur={this.handleSetAmount.bind(this,'unitprice')} />
                    <MyNumberBox params='discount,折扣率,70,135,20,0,140,,spinner' increment={0.01} precision='2' max='0.5' min='0' ref={ref => this.discount = ref} onBlur={this.handleSetAmount.bind(this,'discount')}/>
                    <MyNumberBox params='amount,销售额,70,135,330,0,140,,readonly' precision='2' ref={ref => this.amount = ref} />
                  </TabPanel>
                  <TabPanel ref={ref => this.myTab2 = ref} key="myTab2" header={this.setTabHeader.bind(this)} headerStyle={{ padding: 1 }} ></TabPanel>
                </Tabs>
              </LayoutPanel>
              <LayoutPanel region="center" border={false} style={{ height: '100%' }}>
                <DataGrid ref={ref => this.myGrid1 = ref} columnResizing CheckBox border={false} style={{ borderRight: '1px solid #95B8E7', width: '100%', height: '100%', position: 'absolute' }}
                  data={this.state.myGrid1.data} frozenWidth="74px" selectionMode='single' //0.设置只能select一行，否则选中没有高亮           
                  onRowSelect={(row) => this.handleSelectRow(row)} onCellDblClick={(data) => this.myCellDblClick(data)} //4.表格的单元格双击事件调用的函数
                  onRowContextMenu={({ row, originalEvent }) => this.handleContextMenu(row, originalEvent)}
                  editMode='cell' >
                  <GridColumn frozen width={34} align="center" field="_rowindex" cellCss="datagrid-td-rownumber" render={({ rowIndex }) => (<span>{rowIndex + 1}</span>)}></GridColumn>
                  <GridColumn frozen width={40} align="center" field="_checked"
                    render={({ row }) => (<CheckBox checked={row.selected} onChange={(checked) => this.handleRowCheck(row, checked)}></CheckBox>)}
                    header={() => (<CheckBox checked={this.state.allChecked} xonChange={(checked) => this.handleAllCheck(checked)}></CheckBox>)}>
                  </GridColumn>
                  <GridColumn field="productid" title="商品编码" width={80} halign="center" align="center" ></GridColumn>
                  <GridColumn field="productname" title="商品名称" width={200} halign="center"></GridColumn>
                  <GridColumn field="quantityperunit" title="规格型号" width={150} halign="center"></GridColumn>
                  <GridColumn field="unit" title="计量单位" width={70} halign="center" align="center"></GridColumn>
                  <GridColumn field="quantity" title="数量" width={60} halign="center" align="right" cellCss={this.getCellCss}></GridColumn>
                  <GridColumn field="unitprice" title="单价" width={70} halign="center" align="right" cellCss={this.getCellCss}></GridColumn>
                  <GridColumn field="discount" title="折扣" width={55} halign="center" align="right" ></GridColumn>
                  <GridColumn field="amount" title="销售额" width={70} halign="center" align="right" ></GridColumn>
                </DataGrid>
              </LayoutPanel>
            </Layout>
          </LayoutPanel>
        </Layout>
        <Dialog title='选择商品' draggable style={{ height: 472, width: 860 }} bodyCls="f-column" modal='false' closed ref={ref => this.myWin1 = ref}>
          <MyDataGrid ref={ref => this.myGrid1 = ref} sqlprocedure='demo503a' pagesize='10' 
            keyvalue={this.state.productGrid.keyvalue} bbar='ok;cancel;close' tbar='filter' title='选择商品'
            fixedcolumns='[#80%d]商品编码/productid' 
            columns='[#200]商品名称/productname;[@c#150%d]规格型号/quantityperunit;[#80@c]计量单位/unit;[#70%n]单价/unitprice;[#80]供应商编码/supplierid;[#200]供应商名称/suppliername'
            xonRowSelect={(row) => {this.handleRowSelect_productid(row)}}            
            onRowDblClick={(row) => {this.handleRowSelect_productid(row)}}           
            onClose={()=>{this.myWin1.close();}}
          />
        </Dialog>
        <Dialog title='选择客户' draggable style={{ height: 472, width: 860 }} bodyCls="f-column" modal='false' closed ref={ref => this.myWin2 = ref}>
          <MyDataGrid ref={ref => this.myGrid3 = ref} sqlprocedure='demo604e' pagesize='10' 
            keyvalue={this.state.customerGrid.keyvalue} bbar='ok;close' tbar='filter' title='选择商品'
            fixedcolumns='[#80%d]客户编码/customerid' 
            columns='[#200]客户名称/companyname;[@c#100%d]所属城市/city;[#180]地址/address'
            onRowDblClick={(row) => {this.handleRowSelect_customerid(row)}}
            onClose={()=>{this.myWin2.close();}}
          />
        </Dialog>

        <Messager title='系统提示' ref={ref => this.myMessage1 = ref}></Messager>
        <div>
          <Menu ref={ref => this.myMenu1 = ref}>
            <MenuItem text="新增行" iconCls="addIcon" onClick={this.handleAddRowClick.bind(this)}></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="删除行" iconCls="deleteIcon" onClick={this.handleDeleteRowClick.bind(this)}></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="保存行" iconCls="saveIcon" onClick={this.handleSaveRowClick.bind(this)}></MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}
