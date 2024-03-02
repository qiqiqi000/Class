import React from 'react';
import { Panel, DataGrid, Tabs, TabPanel, GridColumn, Messager, CheckBox, ComboBox, Label, Layout, LayoutPanel, LinkButton, Dialog, ComboTree } from 'rc-easyui';
import { Menu, MenuItem, MenuSep, GridColumnGroup, GridHeaderRow } from 'rc-easyui';
import { MyComboBox, MyTextBox, MyFileUpload, MyComboTree } from '../../api/easyUIComponents.js'
import { reqdoSQL,reqdoTree, myStr2JsonArray } from '../../api/functions.js'

const rowheight = 42;
export default class Page504 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      data: [],  //全部页的数据
      total: 0,
      pageno: 1,
      pagesize: 20,
      rowindex: -1,
      row: {},
      rows: [],   //当前页的数据    
      files: [],  //上传的文件  
      addoredit: 'update',
      tablename: 'products',
      keyfield: 'productid',
      fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;supplierid;categoryname;companyname;photopath',
      categoryData: [],
      hidegridpanel:false,
      hideformpanel:true,
      reloadflag:1
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
  async componentDidMount() {
    //加载第一页数据
    this.loadGridData(1, this.state.pagesize);
    let q = {};
    q.selectsql = 'select * from mysales.suppliers';
    let rs1 = await reqdoSQL(q);
    // console.log(234,rs.rows);
    this.setState({ supplierData: rs1.rows });
  }

  handleExitClick =  (e) => {  //eeeeeexit
    //this.setState({  hideformpanel:true, hidegridpanel:false, reloadflag:1});
    let { pageno, pagesize, total } = this.state;
    this.setState({  hideformpanel:true, hidegridpanel:false, reloadflag:pageno===1? 1:0, pageno:1, data:[],total:0}, () => {
      setTimeout(() => {
        this.loadGridData(pageno, pagesize);
      })
    });    
  }

  loadGridData = async (pageno, pagesize) => { //加载数据
    //先触发close和open，假设翻页停在第3页，这时网格的pagesize和state.pageno均为3，参数pageno强制设置为1，state.reloadflag为0,因为handleExitClick中将data设置为空，网格发生变化清空。
    //此时执行存储过程，提取第3页数据并渲染加载到data和网格中，这时state.reloadflag为0, state.pageno变为3,pageno也是3，不执行存储过程
    //把data清空主要是为了概述用户感受，程序是对的。
    console.log(102,this.state.reloadflag, pageno, this.state.pageno)
    //alert(99);
    //let { pageno, pagesize, reloadflag } = this.state;
    if (this.state.reloadflag>0 || this.state.pageno!=pageno || this.state.pagesize!=pagesize ){  //避免重复加载
      var p = {};
      p.sqlprocedure = 'demo503a';
      p.pageno = pageno;
      p.pagesize = pagesize;
      p.keyvalue='';
      p.sortfield='';
      p.filter = this.filtertext.state.value;
      //console.log(777, p);
      const rs = await reqdoSQL(p); //1.获取到数据
      let total = (rs.rows.length === 0 ? 0 : parseInt(rs.rows[0].total)); //2.获取总行数
      var data = new Array(total).fill({});   //3.建立一个总行数长度的数组,其他行为空值
      let rowindex = this.state.rowindex;
      if (rowindex < 0 && total > 0) rowindex = 0;
      data.splice((pageno - 1) * pagesize, pagesize, ...rs.rows)  //4.替换数组中指定位置的数据
      console.log(888, rs.rows, pageno, pagesize);
      if (rowindex > rs.rows.length - 1) rowindex = rs.rows.length - 1;  //???
      this.setState({ data: data, total: total, rows: rs.rows, rowindex: rowindex, pageno: pageno, pagesize: pagesize, reloadflag:0 }, () => {
        setTimeout(() => {
          if (rowindex >= 0 && data.length > 0) {
            this.myGrid1.selectRow(data[(pageno - 1) * pagesize + rowindex]);
            this.myGrid1.scrollTo(data[(pageno - 1) * pagesize + rowindex]);
          }
        })
      });
    }
    this.setState({ reloadflag:0 });
  }

  handleKeyEvents = async (e) => {
    //键盘判断
    if (e.keyCode === 13) {
      let id = document.activeElement.id;  //获取光标所在的控件id
      if (id === 'categoryid') this.handleBlurCategoryid();
      else if (id === 'supplierid') this.handleBlurSupplierid();
    }
    //console.log(e.keyCode);
  }

  handleContextMenu(row,e) {  //定义右键菜单
    e.preventDefault();
    this.myGrid1.selectRow(row);
    this.handleSelectRow(row);
    //this.handleSelectionChange(row);
    this.myMenu1.showContextMenu(e.pageX, e.pageY);
  }

  handleBlurCategoryid = async () => {
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

  handleBlurSupplierid = async () => {
    let p = {};
    p.tablename = 'suppliers';
    p.keyfield = 'supplierid';
    p.keyvalue = this.supplierid.state.value;
    p.sqlprocedure = "sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s = '';
    if (rs.rows.length > 0) s = rs.rows[0].companyname;
    this.companyname.setState({ value: s }, () => {
      setTimeout(() => {
        //myLoadData(this.companyname);
      })
    });
  }
  handleSelectionChange(row) {
    this.companyname.setState({ value: row.companyname });
    this.supplierid.setState({ value: row.supplierid });
    this.win3.close();
  }

  
  handleSelectRow(row) {
    //选中一行，将值保存到state.row中去
    let rowindex = this.state.rows.findIndex(item => item.productid === row.productid);
    this.setState({ row: row, rowindex: rowindex });
  }

  editRow = (row) => {
    this.myGrid1.selectRow(row);
    setTimeout(() => {
      //this.handleSelectRow(row);
      this.handleUpdateClick();
    });
  }

  deleteRow = (row) => {
    this.myGrid1.selectRow(row);
    setTimeout(() => {
      //this.handleSelectRow(row);
      this.handleDeleteClick();
    });
  }

  handleOpenWin1() {
    console.log(1112);
    let tmp = this.state.fieldset.split(';');
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
      this.categoryid.setState({ value: 'A' });
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

  handleAddClick = async (e) => {  //aaaaaa
    //清空所有控件  
    this.setState({ addoredit: 'add', hideformpanel:false, hidegridpanel:true, reloadflag:0 });
    //this.myTab2.select();    
    setTimeout(()=>{
      let tmp=this.state.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
         if(this[tmp[i]]!== undefined){
            this[tmp[i]].setState({value:''});
          }
      }
      this.productid.setState({ value:0 });  //自增列必须为0
      this.categoryid.setState({value: 'A'});
      this.supplierid.setState({value: 'wlj'});
    });
  
  }

  handleUpdateClick = async (e) => {
    //修改记录
    if (!this.state.row.productid) return;
    this.setState({ addoredit: 'update', hideformpanel:false, hidegridpanel:true, reloadflag:0 });
    //this.myTab1.select();    
    setTimeout(()=>{
      let tmp=this.state.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
         if (this[tmp[i]]){
            this[tmp[i]].setState({value: this.state.row[tmp[i]]});
          }
      }
    });
    
  }

  handleDeleteClick = (e) => {  //ddddddd
    //删除记录
    //this.myGrid1.che
    this.myMessage1.confirm({
      msg: '是否确定删除【' + this.state.row.productid + '】这个商品？',
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
          //let rowindex=this.state.data.findIndex(item=>item.productid===this.state.row.productid);
          //当前第一页的第几行
          let { pageno, pagesize, total } = this.state;
          let rowindex = this.state.rows.findIndex(item => item.productid === this.state.row.productid);
          let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
          if (rowno >= total) rowindex--;
          //console.log(333, rowindex, rowno, total, pageno);
          if (rowindex < 0) {
            pageno--;
            rowindex = 0;   //定位到上一页第一行
          }
          if (pageno > 0) {
            /*
            if (this.state.pageno === pageno) {
              this.setState({ reloadflag:1 }, () => {
                setTimeout(() => {
                 this.loadGridData(pageno, pagesize);;
                })
             });
            }else{
              this.setState({ rowindex: rowindex, pageno: pageno, reloadflag:1 }, () => {
                 setTimeout(() => {
                  //this.loadGridData(pageno, pagesize);;
                 })
              });
            }
          */
          //删除时
          this.setState({ rowindex: rowindex, pageno: 1, data:[], total:0, reloadflag:pageno===1? 1:0 }, () => { //自动触发1次，先清空data
            setTimeout(() => {
              this.loadGridData(pageno, pagesize);;
            })
         });
        }

        }
      }
    });
  }

  handleSaveClick = async (e) => {  //sssssssssssssssssssave
 /*
    let p={};
    p.addoredit=this.state.addoredit;
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       p[tmp[i]]=this[tmp[i]].state.value;
    }
    p.sqlprocedure="demo502b";
    */
    let xdata={};
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
      //console.log(i,tmp[i]);
       if (this[tmp[i]]){
          if (tmp[i]==='photopath'){
             xdata[tmp[i]]= myStr2JsonArray(this[tmp[i]].state.value);
             console.log(xdata[tmp[i]]);
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
    console.log(p.data);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    //替换数组中的这个元素
    let {pageno, pagesize, total, rowindex}=this.state;
    if (this.state.addoredit==='add'){
      //新增记录，计算行号
       let rowno=rs.rows[0]._rowno;
       pageno=parseInt((rowno-1)/pagesize)+1;
       rowindex=rowno-(pageno-1)*pagesize-1;
       this.setState({rowindex:rowindex, pageno:pageno});
       console.log(999,pageno,rowindex,rowno,this.state.pageno);
      }   
     this.setState({addoredit:'update'});
     this.handleExitClick();
     return;
     this.setState({ pageno: 1, pagesize: pagesize, hideformpanel:true, hidegridpanel:false, reloadflag:pageno===1? 1:0}, () => {  //不触发加载数据
        setTimeout(() => {
           this.loadGridData(pageno, pagesize);    
        })
      });    
      /*
      if (pageno !== this.state.pageno) this.setState({ pageno: pageno, pagesize: pagesize, reloadflag:1 });  //这个语句会触发onPageChange事件，进而执行loadGridData函数
      else this.loadGridData(pageno, pagesize);
      this.loadGridData(pageno, pagesize);
      */
  }
  

  handleButtonClick = async (flag) => {  //filter
    if (flag == 'flitertext') {
      let p = {};
      p.filter = this.filtertext.state.value;
      p.sqlprocedure = 'demo502a';
      let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
      this.setState({ data: rs.rows }, () => {
        setTimeout(() => {
          this.myGrid1.setData(rs.rows);
          if (rs.rows.length > 0) this.myGrid1.selectRow(rs.rows[0]);
        })
      });
    }
    else if (flag == 'categoryid') {
      this.win2.open();
    }
    else if (flag == 'supplierid') {
      this.win3.open();
    }
  }


  //6.定义调用的函数。这里是实现双击后可以开启网格的直接编辑功能
  myCellDblClick = (data) => {
    console.log(data); //是双击的行参数
    this.myGrid1.beginEdit(data.row, data.column); //7.调用可以开启编辑的方法 ,网格可编辑方法需要注意的点有1。必须在GridColumn中定义可编辑，比如这里的name
  }

  render() {
    let p = {};
    p.sqlprocedure = 'demo502d';
    p.filtertext = '';
    let q= {};
    q.sqlprocedure = 'demo504w';      
    //知识点：1）网格的frozenWidth="364px"为4个列的宽度之和；2）网格的style必须这样设置，否则表头和分页栏会移动 
    return (
      <div>
        <Layout border={false} style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <LayoutPanel region="north"  border={false} style={{}}>
            <div id="toolbar1" style={{ display:this.state.hidegridpanel? 'none' : 'block', paddingTop: 2, paddingLeft: 4, backgroundColor: '#E0ECFF', height: 33, overflow: 'hidden' }}>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="addIcon" onClick={this.handleAddClick.bind(this)} >新增</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)} >修改</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >刷新</LinkButton>
              <MyTextBox params='filtertext,快速过滤,70,2,300,0,290' ref={ref => this.filtertext = ref} addonRight={() => <span className='textbox-icon icon-search' onClick={this.handleButtonClick.bind(this, 'filtertext')}></span>} />
            </div>
            <div id="toolbar2" style={{display:this.state.hideformpanel? 'none' : 'block', paddingTop: 2, paddingLeft: 4, backgroundColor: '#E0ECFF', height: 33, overflow: 'hidden' }}>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
              <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="exitIcon" onClick={this.handleExitClick.bind(this)} >返回</LinkButton>
            </div>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
          <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
             <Panel ref={ref => this.myGridPanel = ref} closed={this.state.hidegridpanel} border={false} style={{ height: '100%', width: '100%', position: 'absolute' }}>
                <DataGrid ref={ref => this.myGrid1 = ref} columnResizing pagination CheckBox border={false} style={{ width: '100%', height: '100%', position: 'absolute' }}
                data={this.state.data} frozenWidth="329px" selectionMode='single' //0.设置只能select一行，否则选中没有高亮           
                onRowSelect={(row) => this.handleSelectRow(row)} onCellDblClick={(data) => this.myCellDblClick(data)} //4.表格的单元格双击事件调用的函数
                pageOptions={{ total: this.state.total, layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'refresh', 'sep', 'manual', 'info'], displayMsg: '当前显示 {from}~{to}行， 共{total}行', beforePageText: '第', afterPageText: '页' }}
                pageNumber={this.state.pageno}
                pageSize={this.state.pagesize}
                xonPageChange={({ pageNumber, pageSize }) => {this.setState({ reloadflag:1 }, () => {
                  setTimeout(() => {
                    this.loadGridData(pageNumber, pageSize);
                  })
                });  }}
                onPageChange={({ pageNumber, pageSize }) => {console.log(101);this.setState({ reloadflag:1 }); this.loadGridData(pageNumber, pageSize);}}
                onRowContextMenu={({ row, originalEvent }) => this.handleContextMenu(row, originalEvent)} editMode='cell' >
                <GridColumn frozen width={34} align="center" field="rn" cellCss="datagrid-td-rownumber" render={({ rowIndex }) => (<span>{rowIndex + 1}</span>)}></GridColumn>
                <GridColumn frozen width={30} align="center" field="ck"
                  render={({ row }) => (<CheckBox checked={row.selected} xonChange={(checked) => this.handleRowCheck(row, checked)}></CheckBox>)}
                  header={() => (<CheckBox checked={this.state.allChecked} xonChange={(checked) => this.handleAllCheck(checked)}></CheckBox>)}>
                </GridColumn>
                <GridColumnGroup frozen align="right" width="100px">
                   <GridHeaderRow>
                     <GridColumn frozen width={100} title="操作" align="center" field="_action"
                        render={({ row }) => (
                          <div>
                            <LinkButton xiconCls='editIcon' onClick={() => this.editRow(row)}>修改</LinkButton>
                            <LinkButton xiconCls="deleteIcon" onClick={() => this.deleteRow(row)}>删除</LinkButton>
                          </div>
                        )}>
                     </GridColumn>
                   </GridHeaderRow>
                </GridColumnGroup>                 
                <GridColumn frozen width={70} field="productid" title="商品编码" halign="center" align="center" ></GridColumn>
                <GridColumn frozen width={200} field="productname" title="商品名称" halign="center"></GridColumn>
                <GridColumn field="englishname" title="英文名称" width={220} halign="center" editable
                  render={({ row }) => (
                    <div style={{ padding: '0px 0px 0px -10px', fontWeight: 'bold' }}>{row.englishname}</div>
                  )}>
                </GridColumn>
                <GridColumn field="quantityperunit" title="规格型号" width={180} halign="center" align="left" editable></GridColumn>
                <GridColumn field="unit" title="计量单位" width={80} halign="center" align="center"></GridColumn>
                <GridColumn field="unitprice" title="单价" width={100} halign="center" align="right" cellCss={this.getCellCss}></GridColumn>
                <GridColumn field="supplierid" title="供应商编码" align="center" width={100} halign="center" ></GridColumn>
                <GridColumn field="companyname" title="供应商名称" align="center" width={260} halign="center" ></GridColumn>
                <GridColumn field="address" title="供应商地址" align="center" width={260} halign="center" ></GridColumn>
                <GridColumn field="categoryid" title="类别编码" align="center" width={80} halign="center" ></GridColumn>
                <GridColumn field="categoryname" title="类别名称" align="center" width={160} halign="center" ></GridColumn>
              </DataGrid>
            </Panel>
            <Panel ref={ref => this.myFormPanel = ref} closed={this.state.hideformpanel}  border={false}  style={{ height: '100%', width: '100%', position: 'absolute' }}>
              <Tabs ref={ref => this.myTabs = ref}  border={false} style={{ height: '100%', width: '100%', position: 'absolute' }}  tabPosition='top'>
                <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="基本信息" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }}>
                    <MyTextBox params='productid,商品编码,72,20,20,0,200,,readonly' ref={ref => this.productid = ref} />
                    <MyTextBox params='productname,商品名称,72,0,20,0,350' top={20 + 1 * rowheight} ref={ref => this.productname = ref} />
                    <MyTextBox params='englishname,英文名称,72,0,20,0,350' top={20 + 2 * rowheight} ref={ref => this.englishname = ref} />
                    <MyTextBox params='quantityperunit,规格型号,72,0,20,0,200' top={20 + 3 * rowheight} ref={ref => this.quantityperunit = ref} />
                    <MyTextBox params='unit,计量单位,72,0,320,0,150' top={20 + 3 * rowheight} ref={ref => this.unit = ref} />
                    <MyTextBox params='unitprice,单价,72,0,20,0,200' top={20 + 4 * rowheight} ref={ref => this.unitprice = ref} />
                    <MyComboTree params='categoryid,类别编码,72,0,20,0,200' top={20+5*rowheight} sqlparams={q} ref={ref => this.categoryid = ref} placeholder="输入类别编码"  />
                    <MyTextBox params='categoryname,,72,0,320,0,300,,readonly' top={20 + 5 * rowheight} ref={ref => this.categoryname = ref} />
                    <MyTextBox params='supplierid,供应商,72,0,20,0,200' top={20 + 6 * rowheight} ref={ref => this.supplierid = ref} onBlur={this.handleBlurSupplierid.bind(this)} addonRight={() => <span className='textbox-icon icon-help' onClick={this.handleButtonClick.bind(this, 'supplierid')}></span>} />
                    <MyComboBox params='companyname,,72,0,320,0,300' top={20 + 6 * rowheight} sqlparams={p} ref={ref => this.companyname = ref} />
                </TabPanel>
                <TabPanel ref={ref => this.myTab2 = ref} key="myTab2" title="图片上传" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }}>
                    <MyFileUpload ref={ref => this.photopath = ref} params='imagepath,选择文件,200,120' maxsize='100' layout='span' data={this.state.row.photopath} filetag={this.state.row.productid} filepath='\\mybase\\resources' />
                </TabPanel>
              </Tabs>
            </Panel>
            </div>
          </LayoutPanel>
        </Layout>
        
        <Dialog title="供应商信息" style={{ height: 450, width: 900 }} bodyCls="f-column" modal='false' closed ref={ref => this.win3 = ref}>
          <DataGrid data={this.state.supplierData} style={{ height: '100%' }} border={false} selectionMode="single"
            onRowSelect={(row) => this.handleSelectionChange(row)} >
            <GridColumn field="supplierid" title="供应商编号" width={80} halign="center" align="center" ></GridColumn>
            <GridColumn field="companyname" title="供应商名称" width={220} halign="center" align="center"></GridColumn>
            <GridColumn field="contactname" title="联系人" width={60} halign="center" align="center" ></GridColumn>
            <GridColumn field="contacttitle" title="联系人职位" align="center" width={90} halign="center" ></GridColumn>
            <GridColumn field="address" title="供应商地址" align="center" width={260} halign="center" ></GridColumn>
          </DataGrid>
        </Dialog>

        <Messager title='系统提示' ref={ref => this.myMessage1 = ref}></Messager>
        <div>
          <Menu ref={ref => this.myMenu1 = ref}>
            <MenuItem text="新增" iconCls="addIcon" onClick={this.handleAddClick.bind(this)}></MenuItem>
            <MenuItem text="修改" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)}></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="删除" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)}></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="刷新" iconCls="refreshIcon"></MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}
//作业：1.添加右键菜单； 2.数据验证； 3.添加combotree或datagrid选择供应商和商品类别；4.使用其他方式非子窗体的方式编辑数据