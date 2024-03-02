import React from 'react';
import { Panel, DataGrid, Tabs, TabPanel, GridColumn, Messager, CheckBox, ComboBox, Label, Layout, LayoutPanel, LinkButton,Dialog} from 'rc-easyui';
import { Menu, MenuItem, MenuSep} from 'rc-easyui';
import { MyComboBox, MyTextBox, MyFileUpload, MyComboTree } from '../../api/easyUIComponents.js'
import { reqdoSQL, reqdoTree, myStr2JsonArray } from '../../api/functions.js'

const rowheight=42;

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
      rows:[],   //当前页的数据    
      files:[],  //上传的文件  
      addoredit: 'update',
      tablename: 'products',
      keyfield: 'productid',
      fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;supplierid;categoryname;companyname;photopath',
    }
  }

  async componentDidUpdate(){
    //添加键盘控制事件
    document.addEventListener('keydown', this.handleKeyEvents);
  }
  async componentWillUnmount(){
    //删除键盘控制事件
    document.removeEventListener('keydown', this.handleKeyEvents);
  }
  async componentDidMount() {
    //加载第一页数据
    this.loadGridData(1, this.state.pagesize);
  }
  
  loadGridData = async (pageno, pagesize) => { //加载数据
    // console.log(value)
    //if (this.state.total!==total && this.state.rowindex!==rowindex && this.state.pageno!=pageno && this.state.pagesize!=pagesize) return;
    var p = {};
    p.sqlprocedure = 'demo503a';
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.filter='';
    const rs = await reqdoSQL(p); //1.获取到数据
    let total = (rs.rows.length===0? 0 : parseInt(rs.rows[0].total)); //2.获取总行数
    var data = new Array(total).fill({});   //3.建立一个总行数长度的数组,其他行为空值
    let rowindex=this.state.rowindex;
    if (rowindex<0 && total>0) rowindex=0;
    data.splice((pageno-1)*pagesize, pagesize, ...rs.rows)  //4.替换数组中指定位置的数据
    console.log(888,rs.rows,pageno,pagesize,this.state.pagesize,this.state.pageno);
    if (rowindex>rs.rows.length-1) rowindex=rs.rows.length-1;  //???
    this.setState({data: data, total:total, rows:rs.rows, rowindex:rowindex, pageno:pageno, pagesize:pagesize}, () => {
       setTimeout(()=>{
         if (rowindex>=0 && data.length>0){
             this.myGrid1.selectRow(data[(pageno-1)*pagesize+rowindex]);
             this.myGrid1.scrollTo(data[(pageno-1)*pagesize+rowindex]);
         }
        });
      });
    }

  handleKeyEvents= async (e) =>{
    //键盘判断
    if (e.keyCode===13){
      let id=document.activeElement.id;  //获取光标所在的控件id
      if ( id==='categoryid') this.handleBlurCategoryid();
      else if (id==='supplierid') this.handleBlurSupplierid();
    }
    //console.log(e.keyCode);
  }

  handleContextMenu(e) {  //定义右键菜单
    e.preventDefault();
    this.myMenu1.showContextMenu(e.pageX, e.pageY);
  }   

  handleBlurCategoryid = async () =>{
    let p={};
    p.tablename='categories';
    p.keyfield='categoryid';
    p.keyvalue=this.categoryid.state.value;
    p.sqlprocedure="sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s='';
    if (rs.rows.length>0) s=rs.rows[0].categoryname; 
    this.categoryname.setState({value: s}, () => {
       setTimeout(()=>{
         //myLoadData(this.companyname);
       })
    });
  }

  handleBlurSupplierid = async () =>{
    let p={};
    p.tablename='suppliers';
    p.keyfield='supplierid';
    p.keyvalue=this.supplierid.state.value;
    p.sqlprocedure="sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s='';
    if (rs.rows.length>0) s=rs.rows[0].companyname; 
    this.companyname.setState({value: s}, () => {
       setTimeout(()=>{
          //myLoadData(this.companyname);
       })
    });
  }

  handleSelectRow(row) {
     //选中一行，将值保存到state.row中去
     let rowindex=this.state.rows.findIndex(item=>item.productid===row.productid);
     this.setState({row:row, rowindex:rowindex});
  }

  editRow = (row)=>{
    this.myGrid1.selectRow(row);
    setTimeout(()=>{
      this.handleSelectRow(row);
      this.handleUpdateClick();    
  });
}

  deleteRow = (row)=>{
    this.myGrid1.selectRow(row);
    setTimeout(()=>{
      this.handleSelectRow(row);
      this.handleDeleteClick();
    });
  }

  handleOpenWin1(){
    //console.log(1112,this.productid);
    let tmp=this.state.fieldset.split(';');  
    if (this.state.addoredit==='add'){
      /*
      for (let i = 0; i<tmp.length;i++){
         if (this[tmp[i]]){
            this[tmp[i]].setState({value: ''});
          }
      }
      */
      for (let field of tmp){
        this[field]?.setState({value: ''})
      }    
      this.productid.setState({value: 0});
      this.categoryid.setState({value: 'A'});
      this.supplierid.setState({value: 'wlj'});
      
    }else if (this.state.addoredit==='update'){
      /*
      for (let i = 0; i<tmp.length;i++){
        if (this[tmp[i]]){
           this[tmp[i]].setState({value: this.state.row[tmp[i]]});
         }
      }
      */
      for (let field of tmp){
        this[field]?.setState({value: this.state.row[field]})
      }
    }
  }

  handleAddClick = async (e) =>{  //aaaaaa
    //清空所有控件  
    this.setState({addoredit:'add'});
    this.myWin1.open();
    /*
    setTimeout(()=>{
      let tmp=this.state.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
         if(this[tmp[i]]!== undefined){
            this[tmp[i]].setState({value:''});
          }
      }
      this.productid.setState({ value:0 });  //自增列必须为0
    });
    */
  }

  handleUpdateClick = async (e) =>{
    //修改记录
    if (!this.state.row.productid) return;
    this.setState({addoredit:'update'});
    this.myWin1.open();
    /*
    setTimeout(()=>{
      let tmp=this.state.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
         if (this[tmp[i]]){
            this[tmp[i]].setState({value: this.state.row[tmp[i]]});
          }
      }
    });
    */
  }

  handleDeleteClick =  (e) =>{  //ddddddd
    //删除记录
    this.myMessage1.confirm({
       msg: '是否确定删除【'+this.state.row.productid+'】这个商品？',
       result: async r => {
          if (r) {
             let p={};
             let xdata={};
             xdata.productid=this.state.row.productid;
             xdata._action='delete';
             xdata._reloadrow=0;
             p.sqlprocedure="demo502c";
             p.data=[];
             p.data.push(xdata);  
             console.log(JSON.stringify(p.data));
             let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
             //删除记录后，重新定位到下一行。计算下一行的行号。
             //let rowindex=this.state.data.findIndex(item=>item.productid===this.state.row.productid);
             //当前第一页的第几行
             let {pageno, pagesize, total} = this.state;
             let rowindex=this.state.rows.findIndex(item=>item.productid===this.state.row.productid);
             let rowno=(pageno-1)*pagesize+rowindex+1;  //实际行号
             if (rowno>=total) rowindex--;
             console.log(333,rowindex, rowno, total,pageno);
             if (rowindex<0){
               pageno--;
               rowindex=this.state.pagesize;   //定位到上一页第一行
             }
             if (pageno>0){
              /*
                if (this.state.pageno===pageno){
                  this.loadGridData(pageno, pagesize);
                }else{ 
                  this.setState({rowindex: rowindex, pageno:pageno}, () => {
                    setTimeout(()=>{
                      //this.loadGridData(pageno, pagesize);;
                    })
                  });   
                }
                */
                this.setState({rowindex: rowindex, pageno:pageno}, () => {
                  setTimeout(()=>{
                    this.loadGridData(pageno, pagesize);;
                  })
                });
             }
          }  
       }
    });
  }

  handleSaveClick = async (e) =>{  //sssssssssssssssssssave
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
       this.setState({rowindex:rowindex});
       this.setState({addoredit:'update'});
       console.log(999,pageno,rowindex,rowno,this.state.pageno);
    }else{
       this.setState({pageno:pageno, pagesize:pagesize});
    }
    this.myWin1.close();
    //if (pageno!==this.state.pageno) this.setState({pageno:pageno, pagesize:pagesize});  //这个语句会触发onPageChange事件，进而执行loadGridData函数
    //else this.loadGridData(pageno, pagesize);
    this.loadGridData(pageno, pagesize);
  }

  handleButtonClick = async (e) =>{  //filter
    let p={};
    p.filter=this.filter.state.value;
    p.sqlprocedure='demo502a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    this.setState({data: rs.rows}, () => {
      setTimeout(()=>{
        this.myList1.setData(rs.rows);  //更新datalist的数据
        if (rs.rows.length>0) this.myList1.selectRow(rs.rows[0]);
      })
    });
  }

  //6.定义调用的函数。这里是实现双击后可以开启网格的直接编辑功能
  myCellDblClick = (data) => {
    console.log(data); //是双击的行参数
    this.myGrid1.beginEdit(data.row, data.column); //7.调用可以开启编辑的方法 ,网格可编辑方法需要注意的点有1。必须在GridColumn中定义可编辑，比如这里的name
  }

  render() {
    let p={};
    p.sqlprocedure='demo502d';
    p.filtertext='';    

    //知识点：1）网格的frozenWidth="364px"为4个列的宽度之和；2）网格的style必须这样设置，否则表头和分页栏会移动 
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{  }}>
             <div id="toolbar1" style={{paddingTop:2, paddingLeft:4, backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
                <LinkButton style={{width:68, height:28}} iconAlign="left" iconCls="addIcon" onClick={this.handleAddClick.bind(this)} >新增</LinkButton>
                <LinkButton style={{width:68, height:28}} iconAlign="left" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)} >修改</LinkButton>
                <LinkButton style={{width:68, height:28}} iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
                <LinkButton style={{width:68, height:28}} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
                <MyTextBox params='filter;快速过滤;70;2;300;0;290' ref={ref => this.filter = ref} addonRight={()=><span className='textbox-icon icon-search' onClick={this.handleButtonClick.bind(this)}></span>} />
             </div>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <DataGrid ref={node => this.myGrid1 = node} columnResizing pagination CheckBox border={false} style={{ width:'100%', height:'100%', position:'absolute' }} 
              data={this.state.data}  frozenWidth="449px" selectionMode='single' //0.设置只能select一行，否则选中没有高亮           
              onRowContextMenu={this.handleContextMenu.bind(this)} editMode='cell' //0.设置编辑模式，单元格编辑模式  
              onRowSelect={(row) => this.handleSelectRow(row)} onCellDblClick={(data) => this.myCellDblClick(data)} //4.表格的单元格双击事件调用的函数
              pageOptions={{ total:this.state.total, layout: ['list', 'sep', 'first', 'prev', 'next', 'last', 'sep', 'refresh', 'sep', 'manual', 'info'], displayMsg: '当前显示 {from}~{to}行， 共{total}行', beforePageText:'第', afterPageText:'页' }}
              pageNumber={this.state.pageno} 
              pageSize={this.state.pagesize}
              onPageChange={({ pageNumber, pageSize }) => { this.loadGridData( pageNumber, pageSize )}} >
              <GridColumn frozen width={34} align="center" field="rn" cellCss="datagrid-td-rownumber" render={({rowIndex}) => (<span>{rowIndex+1}</span>)}></GridColumn>
              <GridColumn frozen width={40} align="center" field="ck" 
                  render={({ row }) => (<CheckBox checked={row.selected} xonChange={(checked) => this.handleRowCheck(row, checked)}></CheckBox>)}
                  header={() => (<CheckBox checked={this.state.allChecked} xonChange={(checked) => this.handleAllCheck(checked)}></CheckBox>)}>
              </GridColumn>
              <GridColumn frozen width={94} title="操作" align="center" field="_action" 
                 render={({ row }) => (
                   <div>
                      <LinkButton onClick={() => this.editRow(row)}>修改</LinkButton>
                      <LinkButton onClick={() => this.deleteRow(row)}>删除</LinkButton>
                   </div>
                 )}></GridColumn>
              <GridColumn frozen width={80} field="productid" title="商品编码" halign="center" align="center" ></GridColumn>
              <GridColumn frozen width={200} field="productname" title="商品名称" halign="center"></GridColumn>

              <GridColumn field="englishname" title="英文名称" width={220} halign="center" editable 
                  render={({ row }) => (
                    <div style={{ padding:'0px 0px 0px -10px', fontWeight: 'bold' }}>{row.englishname}</div>
                  )}>
              </GridColumn>
              <GridColumn field="quantityperunit" title="规格型号" width={180} halign="center"  align="left" editable></GridColumn>
              <GridColumn field="unit" title="计量单位" width={80} halign="center" align="center"></GridColumn>
              <GridColumn field="unitprice" title="单价" width={100} halign="center" align="right"  cellCss={this.getCellCss}></GridColumn>
              <GridColumn field="supplierid" title="供应商编码" align="center" width={100} halign="center" ></GridColumn>
              <GridColumn field="companyname" title="供应商名称" align="center" width={260} halign="center" ></GridColumn>
              <GridColumn field="address" title="供应商地址" align="center" width={260} halign="center" ></GridColumn>
              <GridColumn field="categoryid" title="类别编码" align="center" width={80} halign="center" ></GridColumn>
              <GridColumn field="categoryname" title="类别名称" align="center" width={160} halign="center" ></GridColumn>
            </DataGrid>
          </LayoutPanel>
        </Layout>

        <Dialog borderType="thick" iconCls="win1Icon" closed draggable onOpen={this.handleOpenWin1.bind(this)} title='&nbsp,编辑商品' modal closable style={{width:750, height:465}} ref={ref => this.myWin1 = ref}  >
           <Layout style={{ width: '100%', height: '100%', position:'relative' }}>
              <LayoutPanel region="north" border={false} style={{borderBottom:'1px solid #95B8E7'}}>
                <div style={{paddingTop:3, paddingLeft:8, backgroundColor:'#E0ECFF', height:32, width:'100%', position:'relative', overflow:'hidden'}}>
                    <MyTextBox params='filter2,快速过滤,70,0,10,0,290' ref={ref => this.filter2 = ref} addonRight={()=><span className='textbox-icon icon-search' onClick={this.handleButtonClick.bind(this,'filter2')}></span>} />
                </div>
              </LayoutPanel>
              <LayoutPanel region="center" border={false} style={{ height: '100%', position:'relative' }}>
                 <Tabs border={false} style={{overflow:'auto', height: '100%', width: '100%', position:'absolute'}} ref={ref => this.myTabs = ref} tabPosition='top'>
                    <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="基本信息" style={{overflow:'auto', height: '100%', width: '100%', position:'absolute'}}>
                       <MyTextBox params='productid,商品编码,72,20,20,0,200,,readonly' ref={ref => this.productid = ref} />
                       <MyTextBox params='productname,商品名称,72,0,20,0,350' top={20+1*rowheight} ref={ref => this.productname = ref} />
                       <MyTextBox params='englishname,英文名称,72,0,20,0,350' top={20+2*rowheight} ref={ref => this.englishname = ref} />
                       <MyTextBox params='quantityperunit,规格型号,72,0,20,0,200' top={20+3*rowheight} ref={ref => this.quantityperunit = ref} />
                       <MyTextBox params='unit,计量单位,72,0,320,0,150' top={20+3*rowheight} ref={ref => this.unit = ref} />
                       <MyTextBox params='unitprice,单价,72,0,20,0,200' top={20+4*rowheight} ref={ref => this.unitprice = ref} />
                       <MyTextBox params='categoryid,所属类别,72,0,20,0,200' top={20+5*rowheight} onBlur={this.handleBlurCategoryid.bind(this)} ref={ref => this.categoryid = ref} placeholder="输入类别编码" addonRight={()=><span className='textbox-icon icon-help' onClick={this.handleButtonClick.bind(this,'categoryid')}></span>} />
                       <MyTextBox params='categoryname,,72,0,320,0,300,,readonly' top={20+5*rowheight} ref={ref => this.categoryname = ref} />
                       <MyTextBox params='supplierid,供应商,72,0,20,0,200' top={20+6*rowheight} ref={ref => this.supplierid = ref} onBlur={this.handleBlurSupplierid.bind(this)} addonRight={()=><span className='textbox-icon icon-help' onClick={this.handleButtonClick.bind(this,'supplierid')}></span>} />
                       <MyComboBox params='companyname,,72,0,320,0,300' top={20+6*rowheight} sqlparams={p} ref={ref => this.companyname = ref} />
                    </TabPanel>
                    <TabPanel ref={ref => this.myTab2 = ref} key="myTab2" title="图片上传" style={{overflow:'auto', height: '100%', width: '100%', position:'absolute'}}>
                       <MyFileUpload  ref={ref => this.photopath = ref} params='imagepath,选择文件,200,120' maxsize='100' layout='span' data={this.state.row.photopath} filetag={this.state.row.productid} filepath='\\mybase\\resources' />
                    </TabPanel>
                 </Tabs>
              </LayoutPanel>
              <LayoutPanel region="south" border={false} style={{borderTop:'1px solid #95B8E7'}}>
                  <div style={{paddingTop:4, paddingLeft:14, paddingRight:16, height:38, backgroundColor:'#E0ECFF', overflow:'hidden'}}>
                     <LinkButton style={{width:68, height:28,float:'right'}} iconAlign="left" iconCls="closeIcon" onClick={()=>this.myWin1.close()} >关闭</LinkButton>
                     <LinkButton style={{width:68, height:28,float:'right'}} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
                 </div>
              </LayoutPanel>
           </Layout>
        </Dialog>
        <Messager title='系统提示' ref={ref => this.myMessage1 = ref}></Messager>
        <div>
        <Menu ref={ref=>this.myMenu1 = ref}>
           <MenuItem text="新增" iconCls="addIcon"  onClick={this.handleAddClick.bind(this)}></MenuItem>
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