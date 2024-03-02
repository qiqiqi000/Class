import React, { Component } from 'react'
import { Tabs, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form,  Table, Layout, Radio , Modal} from 'antd'
import { myLocalTime, reqdoSQL, reqdoTree, myNotice } from '../../api/functions'
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdHiddenField, AntdImage, ConfirmModal, AntdModal } from '../../api/antdClass.js';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { FullscreenOutlined, FullscreenExitOutlined, DownOutlined, UpOutlined, RightOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Resizable } from 'rc-easyui'; 
const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview-cn/
//https://procomponents.ant.design/components
//https://marketplace.visualstudio.com/items?itemName=WhenSunset.chatgpt-china
//网格+选项卡
const rowheight=42;
export default class Page902 extends MyFormComponent {
  state={
    myTable1:{
      data: [],  //某一页数据
      total: 0,  //行总数
      pageno: 1, //当前选中页
      pagesize: 20,  //每页显示行数
      rowindex: 0,   //当前页光标位置
      keyfield: 'productid',   //主键
      sortfield:'',   //排序列，只有一列
      row: {},  //当前选中的行
      selectedkeys: [],  //antd中选中打钩的行
    },
    tabcount: 2,   //tabs的选项卡个数
    activetabkey: 'myTab1',
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
    formcollapsed: false,
    footerheight: 270,
  }
          
  componentDidMount = async () => {   
    this.loadTableData();
  }
    
  componentWillUnmount(){
    //clearInterval(this.timer);
  }    

  loadTableData = async () => { //加载每页数据
    let {pageno, pagesize, selectedkeys, rowindex} = this.state.myTable1
    let p = {}
    p.sqlprocedure = 'demo503a'
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue='';
    p.filter = this.filtertext.state.value.trim();
    p.sortfield=this.state.sortfield;   
    const rs = await reqdoSQL(p) 
    //计算total  可以没有记录total值
    let total = 0;   
    if (rs.rows && rs.rows.length>0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex<0 || rowindex>=rs.rows.length) rowindex=0;
    if (rowindex<rs.rows.length) selectedkeys=[rs.rows[rowindex][this.state.myTable1.keyfield]];
    else selectedkeys=[];
    //console.log(991,selectedkeys);
    //激活选项卡中的控件，可以用forceRender:true替代了
    /*
    let activetabkey=this.state.activetabkey;
    for (let i=1; i<=this.state.tabcount; i++){
      //激活其它选项卡
      if (this.state.activetabkey!='myTab'+i) {
        this.setState({activetabkey:'myTab'+i}, () => { 
          setTimeout(() => {        
             this[this.state.myTable1.keyfield]?.setState({editable: false});
          })
        });
      }
    }
    this.setState({activetabkey: activetabkey}, () => { 
      setTimeout(() => {        
        this[this.state.myTable1.keyfield]?.setState({editable: false});
      })
    });
    //激活选项卡结束
    */
    let table={...this.state.myTable1}
    this.setState({myTable1:{...table, data:rs.rows , pageno:pageno, pagesize, total, rowindex, selectedkeys:selectedkeys}}, () => { 
      setTimeout(() => {
        this.handleSelectRow(rs.rows[rowindex], rowindex);
      })
    });
  }  
    
  handleSearchFilter = async () => {
    let table={...this.state.myTable1}
    this.setState({myTable1:{...table, pageno:1, rowindex:0}}, () => { 
      setTimeout(() => {
        this.loadTableData();
      })
    });
  } 
  
  handlePageChange = (pageno, pagesize) => { //换页事件
    //alert(pageno+'----'+pagesize)    
    let table={...this.state.myTable1}
    this.setState({myTable1:{...table, pagesize, pageno}}, () => { 
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handleTabChange=(activetabkey)=>{
    this.setState({activetabkey});
  }

  selectionChange = (selectedkeys, rows) => {
    //checkbox选中的项,单选功能的实现
    let table={...this.state.myTable1}
    this.setState({myTable1:{...table, selectedkeys: selectedkeys, row: rows[0]}})
  } 

  handleSelectRow = (row, index)=>{
    if (!row || index<0) return;
    //加载表单数据
    let table={...this.state.myTable1}
    let record= this.setFormValues('myForm1', row);
    this.setState({addoredit:'update', record:record, myTable1:{...table, row:row, rowindex:index, selectedkeys:[row[this.state.myTable1.keyfield]]}}, () => { 
      setTimeout(() => {        
        //只有点击过选项卡之后，才有表单控件，才可以赋值
        //this.setFormValues('myForm1', row);
        this[this.state.myTable1.keyfield]?.setState({editable: false});
      })
    });
  }

  handleEditClick = (e) => {
    let row = this.state.myTable1.row;
    this.setState({addoredit:'update'},() => {
      setTimeout(()=>{
        //this.setFormValues('myForm1', row);
        //this[this.state.myTable1.keyfield]?.setState({editable: false});
      })
    });
  }
  
  handleAddClick = (e) =>{  //aaaaaaaa
    this.setState({myWin1:true, addoredit:'add'},()=>{
      this.resetFormValues('myForm1');
      this[this.state.myTable1.keyfield]?.setState({editable: true});
    });    
  }

  handleDeleteClick = async (e) =>{  
    this.myDeleteModal.setState({visible: true, description:'是否确定删除【'+this.state.myTable1.row[this.state.myTable1.keyfield]+'】这个商品？'});
    return;
  }
  
  handleDeleteRow = async (e) =>{  //ddddddddddddddelete
    let table={...this.state.myTable1}
    let {row, pageno, pagesize, total, rowindex, keyfield} = table;
    //console.log(999,row, rowindex, keyfield)
    let xdata = {...row};
    //xdata[keyfield] = row[keyfield];
    xdata._action = 'delete';
    xdata._reloadrow = 0;
    let p = {};
    p.sqlprocedure = 'demo901a'; // "demo502c";
    p.data = [];
    p.data.push(xdata);
    //console.log(JSON.stringify(p.data));
    //执行数据库删除
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
    //删除服务器端上传的文件
    this.deleteUploadedFiles('myForm1', p.data);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex--;
    //console.log(333, rowindex, rowno, total, pageno);
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    if (pageno>0) {
      this.myDeleteModal.setState({visible: false});
      this.setState({myTable1:{...table, pageno, rowindex}}, () => { //自动触发1次，先清空data
          setTimeout(() => {
            this.loadTableData();
          })
        });            
    } 
    //message.info('确认删除'+row.productname+'这个商品？');
  }

  handleSaveClick = async (e) => {  //sssssssssssave
    //保存数据
    let table={...this.state.myTable1}
    let {pageno, pagesize, total, rowindex, row, keyfield} = table;
    let {record, addoredit} = this.state;
    let data = this.getFormValues('myForm1');  //转换数据内容
    //if (data._action=='add') data[this.state.myTable1.keyfield]=0;  //主键值自动生成
    //console.log(664, data);
    data._action=addoredit;
    data._reloadrow=1;
    data._treeflag=0;
    let p={};
    p.sqlprocedure='demo901a';  //"demo504a";
    p.data=[];
    p.data.push(data);
    if (addoredit!='add'){
      p.data.push(record);  //旧的没有修改过的数据
    }
    //console.log(p.data);
    //console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    if (rs.rows.length>0 && (rs.rows[0]._error==undefined || rs.rows[0]._error=='')){ //数据验证
      if (addoredit=='add'){
        //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
        data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
        let data0 = this.renameUploadedFiles('myForm1', rs.rows[0]);
        data = Object.assign({}, data, data0);  //合并对象属性
        data._action='update';
        data._reloadrow=1;
        data._treeflag=0;
        let p={};
        p.sqlprocedure='demo901a';  //"demo504a";;
        p.data=[];
        p.data.push(data);  //p.data只有一行时，where修改条件取第一行的值
        console.log(775,JSON.stringify(p.data));
        let rs1 = await reqdoSQL(p);          
      }
      //新增记录或修改记录后可能排序次序发生变化，重新进行分页，计算行号定位到新行的这一页这一行
      let rowno=parseInt(rs.rows[0]._rowno);
      if (pagesize>0){  //分页时计算页码和行号
        //console.log(666,rowno);
        pageno=parseInt((rowno-1)/pagesize)+1;
        rowindex=rowno-(pageno-1)*pagesize-1;
        total++;
      }else{ //不分页不计算行号
        rowindex=rowno-1;
      }      
      this.setState({addoredit:'update', myWin1: false, myTable1:{...table, total, rowindex, pageno}}, () => { 
        setTimeout(() => {
           this.loadTableData();
           myNotice('商品记录已经保存，请刷新数据!', '', 200)
        })
      });
    }else{
       myNotice('商品编码重复，记录保存失败！', 'error');  //
    }
  }

  handleMyMenu1Click =(e)=>{
    //右键菜单程序
    //console.log(444,e);
    let key=e.key;
    if (key=='menu-delete') this.handleDeleteClick(e);
    else if (key=='menu-add') this.handleAddClick(e);
    else if (key=='menu-edit') this.handleEditClick(e);
    else if (key=='menu-save') this.handleSaveClick(e);
  }

  handleProductChange=(e)=>{
    console.log(111111,e,this.productid.state.value)  
  }

  handleCloseMyWin1 = (row) => {
    this.setState({myWin1: false})
  }
  
  showTotal = (total, range)=>{
    let {pageno, pagesize} = this.state.myTable1;
    let start=(pageno-1)*pagesize+1;
    let limit=Math.min(start+pagesize-1, total);
    let pagecount = parseInt((total-1)/pagesize)+1;
    let str = `当前第${start}~${limit}行，共${total}行（共${pagecount}页）。`;
    return str;
  }

  /*
  showCellText=(text,align)=>{
    return <div className='textdiv' style={{padding:0,textAlign:align}}>{text}</div>    
  }
  */
  handleContextMenu=(row, index, e)=>{
    //右键设置，选中行
    this.handleSelectRow(row, index);    
  }

  handleSizeChange=(current, pagesize)=>{
    let table={...this.state.myTable1}
    this.setState({myTable1:{...table, pagesize}}, () => { 
      setTimeout(() => {
        //this.loadTableData();
      })
    });
  }

  handleSorter = (v1,v2,sorter)=>{
    console.log(111,sorter)
    let f=sorter.field;
    let d=sorter.order;
  } 

  handleRefresh = () =>{  //rrrrrrrr 
    this.filtertext.setState({value:''});    //不会清空
    let table={...this.state.myTable1}
    this.setState({ myTable1:{...table, pageno:1, rowindex:0, selectedkeys:[]}, addoredit:'update', activetabkey:'myTab1'},() => {
      setTimeout(()=>{        
        this.loadTableData();
      })
    });    
  }

   handleCategoryChange =(value, row)=>{
    //console.log(666,value[0],row[0])
    if (value?.length>0){
      this.myForm1.setFieldValue('categoryid', value[0]);
      this.myForm1.setFieldValue('categoryname', row[0].categoryname);
    }
  }

  handleSupplierChange =(value, row)=>{
    //console.log(value,row)
    this.myForm1.setFieldValue('supplierid', row.supplierid);
  }

  setformCollapsed = () => {
    this.setState({formcollapsed: !this.state.formcollapsed})
  }

  handleResize=(e)=>{
    this.setState({footerheight: e.height});
  }

  onFinish = (json) => { //提交时触发
    console.log(661, json);
  }  

  render() {
    const {data, pagesize, total, addoredit, pageno} = this.state;
    const items1 = [{
        label: '新增',
        key: 'menu-add',
        icon: <PlusCircleOutlined />
     },{
       label: '修改',
       key: 'menu-edit',
       icon: <EditOutlined />
     },{
       type: 'divider',
       key: 'menu13',      
    },{
        label: '删除',
        key: 'menu-delete',
        icon: <DeleteOutlined />
   },{
        type: 'divider',
        key: 'menu15',
   },{
        label: '保存',
        key: 'menu-save',
        icon: <SaveOutlined />
    }];         
  
    const columns=[
      {title:'序号', dataIndex:'xrowno', width:'50px', fixed:'left', className:'rownumberStyle',
      render:(text, record, index) => (this.state.myTable1.pageno-1)*this.state.myTable1.pagesize + index+1 },
      {dataIndex:'productid',title:'商品编码', width:'80px', align:'center', fixed:'left'},
      {dataIndex:'productname',title:'商品名称', width:'250px',fixed:'left', ellipsis: true},
      {dataIndex:'englishname',title:'英文名称', width:'250px',align:'center', ellipsis: true},
      {dataIndex:'quantityperunit',title:'规格型号', width:'180px'},
      {dataIndex:'unit',title:'计量单位', width:'80px', align:'center'},
      {dataIndex:'unitprice',title:'单价', width:'80px', align:'right', sorter: (a, b) => a.unitprice - b.unitprice},
      {dataIndex:'supplierid',title:'供应商编号', width:'90px'},
      {dataIndex:'suppliername',title:'供应商名称', width:'250px', ellipsis: true},
      {dataIndex:'categoryid',title:'类别编号', width:'80px', align:'center'},
      {dataIndex:'categoryname',title:'类别名称', width:'150px', ellipsis: true, 
       render: (text, record, index) =>{return <b><i>{record.categoryname}</i></b>}
    }]

    return (<>
      <Layout style={{overflow:'hidden', position:'absolute', height:'100%'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
          <Form name='filterbar'>
            <div style={{marginTop:1, paddingTop:1, position:'relative'}}>
               <Button type="text" icon={<PlusCircleOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleAddClick.bind(this)}>新增</Button>
               <Button type="text" icon={<EditOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleEditClick.bind(this)}>修改</Button>
               <Button type="text" icon={<DeleteOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleDeleteClick.bind(this)}>删除</Button>
               <Button type="text" icon={<SaveOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleSaveClick.bind(this)}>保存</Button>
               <Button type="text" icon={<RedoOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </div>
            {/* <AntTextBox params='filtertext,快速过滤,72,0,400,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} /> */}
            <AntdInputBox type='search' id='filtertext' label='快速过滤' labelwidth='72' top='2' left='400' height='30' width='350' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        
        <Layout style={{overflow:'hidden', height:'100%', position:'relative'}}>
          <Dropdown menu={{ items:items1, onClick:this.handleMyMenu1Click.bind(this) }} overlayStyle={{width:160}} trigger={['contextMenu']}>            
            <Content style={{overflow:'hidden', position:'relative', width: '100%',overflowX: 'auto'}}>
              <Table id='myTable1' ref={ref => this.myTable1 = ref} sticky={true} size='small' rowKey={this.state.myTable1.keyfield} bordered={true} rowClassName="tableRowStyle"
                //scroll={{x:'90%'}}
                //style={{overflow:'auto', position:'absolute', height:'100%', maxHeight:'100%'}}
                scroll={{x:'90%',y: 'calc(100vh - 300px)'}}
                style={{overflow:'hidden', position:'absolute', height:'100%', maxHeight:'100%'}}

                
                columns={columns} dataSource={this.state.myTable1.data} pagination={false}
                onChange={this.handleSorter}
                rowSelection={  {
                  type: 'radio', 
                  selectedRowKeys: this.state.myTable1.selectedkeys,
                  onChange:(selectedRowKeys,selectedRows)=>{this.selectionChange(selectedRowKeys,selectedRows)}
                }}
                onRow={(record,index) => {
                  return {
                    onClick: (e) => {this.handleSelectRow(record,index)}, // 点击行
                    onDoubleClick: (e) => {this.handleEditClick(record,index)},
                    onContextMenu: (e) => {this.handleContextMenu(record,index,e)}
                  };
                }}
              />
            </Content>
          </Dropdown>
          <Footer style={{padding:'5px 16px 0px 16px', height:36, border:'1px solid #95B8E7', borderLeft:'0px', background:'#efefef'}}>
            <>
            <span style={{float:'left',marginTop:2, marginRight:24}}>            
              {React.createElement(this.state.formcollapsed ? FullscreenOutlined : FullscreenExitOutlined, {className: 'trigger', onClick: () => this.setformCollapsed()})}
            </span>
            <span style={{float:'right',textAlign:'center', marginRight:8}}>
              <Pagination size="small" total={this.state.myTable1.total} 
               showSizeChanger pageSizeOptions={['10', '20', '50', '100']} showQuickJumper className='paginationStyle'
               current={this.state.myTable1.pageno} defaultPageSize={this.state.myTable1.pagesize} 
               pageSize={this.state.myTable1.pagesize} 
               showTotal={(total, range) => this.showTotal(total,range) }
               onShowSizeChange={this.handleSizeChange.bind(this)}
               onChange={this.handlePageChange.bind(this)}             
              />
            </span>
          </></Footer>
        </Layout>
        
        <Resizable onResizing={this.handleResize.bind(this)} minHeight={150} maxHeight={360}>
         <div style={{height:this.state.footerheight, display: this.state.formcollapsed? 'none':'block'}}>
            <Footer style={{display: this.state.formcollapsed? 'none':'block', padding:0, paddingRight:0, marginTop:3, borderTop:'1px solid #95B8E7', position:'relative', overflow:'hidden', height:this.state.footerheight}}>
              <Dropdown menu={{ items:items1, onClick:this.handleMyMenu1Click.bind(this) }} overlayStyle={{width:160}} trigger={['contextMenu']}>
                <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" style={{position:'relative', height:'100%', overflow:'hidden'}} >
                  <Tabs id="myTab" activeKey={this.state.activetabkey} size="small" tabBarGutter={24} 
                    onChange={this.handleTabChange.bind(this)}
                    style={{marginLeft:16, padding:0, paddingRight:20, height:'100%', width:'100%', position:'relative', overflow:'hidden'}}
                    items={[              
                      {label: '基本信息', key: 'myTab1', forceRender:true, children: 
                        <div style={{padding:0, margin:0, position:'relative', height:'100%', overflow:'auto'}} >
                            <AntdInputBox type='text' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={2+rowheight*0} ref={ref=>this.productid=ref}  />
                            <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='432' width='300' top={2+rowheight*0} />
                            <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={2+rowheight*1} />
                            <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='432' width='300' top={2+rowheight*1} />
                            <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={2+rowheight*2}  />
                            <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='432' width='85' top={2+rowheight*2} min={0.01} precision={2} controls={false} />
                            <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={2+rowheight*3} ref={ref=>this.subcategoryid=ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} /> 
                            <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='432' width='300' readOnly top={2+rowheight*3} />
                            <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={2+rowheight*4} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid' />
                            <AntdInputBox type='date' id='releasedate' label='发布日期' labelwidth='82' left='432' width='140' top={2+rowheight*4} ref={ref=>this.releasedate=ref} />
                        </div>
                      },
                      {label: '上传图片', key: 'myTab2', forceRender:true, children: 
                        <div style={{padding:0, margin:0, position:'relative', height:'100%', overflow:'auto'}} >
                          <AntdImageUpload id='photopath' label='图片预览' labelwidth='82' left='2' width='400' datatype='json' top={2+rowheight*0} uploadonsave
                            ref={ref=>this.photopath=ref} targetpath='mybase/resources' xfiletag='`p_${sys.productid}`' filetag='sys.productid' timeStamp={false} 
                            fieldNames={{url:'filename'}} maxCount='5' />
                        </div>
                      }
                    ]}
                  />
                  <AntdHiddenField id='supplieridx' />
                  <AntdHiddenField id='categoryid' />
                </Form>
              </Dropdown>
            </Footer>
          </div>
        </Resizable>
      </Layout>
      <ConfirmModal ref={ref=>this.myDeleteModal=ref} onConfirm={this.handleDeleteRow.bind(this)} />
   </>)
  }
}
