import { Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form,  Table, Layout, Radio , Modal} from 'antd'
import React, { Component } from 'react'
import { reqdoSQL, reqdoTree } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
import {AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined,PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview
//https://blog.csdn.net/weixin_45991188/article/details/108050424 
const sys={...React.sys};
const rowheight=42;
const buttonStyle={
  display: 'flex', 
  alignItems: 'center', 
  flexDirection: 'column',
  textAlign: 'center',
  //lineHeight:'20px',
  //fontFamily:'楷体', 
  height: 20, 
  width: 18, 
  paddingLeft: 2,
  paddingTop: 5,
}

export default class Page801 extends MyFormComponent {
  state={
    data: [],  //某一页数据
    total: 0,  //行总数
    pageno: 1, //当前选中页
    pagesize: 20,  //每页显示行数
    rowindex: 0,   //当前页光标位置
    keyfield: 'productid',   //主键
    sortfield:'',   //排序列，只有一列
    row: {},  //当前选中的行
    selectedkeys: [],  //antd中选中打钩的行
    type: 'radio',   //单选按钮还是复选按钮
    myWin1: false    //子窗体modal初始时为关闭状态
  }
          
  componentDidMount = async () => {
    this.loadData();
    /*
    this.timer = setInterval(() => {
      let scbar = document.querySelector(".ant-table-sticky-scroll-bar");
      if(scbar && scbar.parentNode){
        scbar.parentNode.removeChild(scbar);
      }
    }, 100);
    */
  }
    
  componentWillUnmount(){
    //clearInterval(this.timer);
  }    

  loadData = async () => { //加载每页数据
    let {pageno, pagesize, selectedkeys, rowindex} = this.state
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
    if (rowindex<rs.rows.length) selectedkeys=[rs.rows[rowindex][this.state.keyfield]];
    this.setState({ data:rs.rows , pageno, pagesize, total, rowindex, selectedkeys}, ()=>{
      //
    })
  }  
    
  handleSearchFilter = async () => {
    this.setState({pageno:1, rowindex:0}, ()=>{
    this.loadData();
  })} 
  
  handlePageChange = (pageno, pagesize) => {
    //alert(pageno+'----'+pagesize)
    //换页
    this.setState({pageno:pageno, pagesize:pagesize}, ()=>{
      this.loadData();
    })
  }

  selectionChange = (selectedkeys, rows) => {
    //checkbox选中的项,单选功能的实现
    this.setState({selectedkeys});    
  } 

  handleSelectRow = (row)=>{
    if (!row) return;
    //alert(row[this.state.keyfield])
    this.setState({row:row, selectedkeys:[row[this.state.keyfield]]}, () => {
      setTimeout(()=>{
        if (this.state.myWin1){
          this.setFormValues('myForm1', row);
        }   
      })
    });   
  }

  handleOpenMyWin1 = (key) => {
    this.setState({myWin1: true});    
  }

  handleCloseMyWin1 = (row) => {
    this.setState({myWin1: false})
  }
  
  showTotal = (total, range)=>{
    let {pageno, pagesize} = this.state;
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
 
  handleContextMenu=(row, e)=>{
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.handleSelectRow(row);    
    let id=document.getElementById('myTable1');
    id.oncontextmenu = function(e){
      e.preventDefault();
    }    
  }

  handleSizeChange=(current, pagesize)=>{
    this.setState({pagesize:pagesize},()=>{
      //this.loadData();
    })
  }

  handleSwitchChange=(checked, id)=>{
    console.log(id,checked);
    if (id=='switch2') this.setState({type:checked? 'radio' : 'checkbox'});     
    
  }

  handleSorter=(v1,v2,sorter)=>{
    console.log(111,sorter)
    let f=sorter.field;
    let d=sorter.order;
  }
  /*
  showImage=()=>{
    console.log(999,this.state.row[this.state.keyfield]);
    //this.imagepath.setState({src:'myServer/mybase/products/'+this.state.row[this.state.keyfield]+'.jpg'});
    //return ('myServer/mybase/products/'+this.state.row[this.state.keyfield]+'.jpg');
  }
  */

  handleReviewRowClick = (row) =>{
    message.info('确认'+row.productname+'这个商品通过审核');
  }

  render() {
    const {data, pagesize, total, addoredit, pageno} = this.state;
    /*
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };
    */
    const columns=[
    {title:'序号', dataIndex:'xrowno', width:'50px', fixed:'left', className:'rownumberStyle',
    render:(text, record, index) => (this.state.pageno-1)*this.state.pagesize + index+1 },
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
    },
    {title: '操作', dataIndex:'_operation', key: '_operation', fixed: 'right', width:'50px',
      //record对应的是render里的对象 ，dataindex对应的值
      render: (text, record, index) =><div style={{ display:'flex', alignItems:'center' }}>
       <Button size='small' type="primary" style={{...buttonStyle, marginRight:4}} icon={<FileUnknownOutlined style={{fontSize:8, color: 'white' }} />} onClick={() => this.handleOpenMyWin1(record)}></Button>
       <Popconfirm okText='确定' cancelText='取消' overlayStyle={{width:320}}
        title='系统提示' description={`是否确定审核名称为"${record.productname}"的这个商品？`}
        onConfirm={()=>{this.handleReviewRowClick(record)}}>
        <Button size='small' type="primary" style={buttonStyle} icon={<AuditOutlined style={{fontSize:8, color: 'white' }} />}></Button>
      </Popconfirm>      
      </div>
    }]

    return (
      <>
      <Layout style={{overflow:'hidden',position:'relative'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
          <Form name='filterbar'>
            <AntTextBox params='filtertext,快速过滤,72,0,16,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
            <Form.Item label='显示操作按钮' id="switch1" className='labelStyle' style={{position:'absolute', top:0, left:500}}>
              <Switch id="switch1" checkedChildren="开" unCheckedChildren="关" style={{width:56}} defaultChecked onChange={(checked)=>this.handleSwitchChange(checked,'switch1')} />
            </Form.Item>
            <Form.Item label='单选行' id="switch2" className='labelStyle' style={{position:'absolute', top:0, left:700}}>
              <Switch id="switch2" checkedChildren="开" unCheckedChildren="关" style={{width:56}} defaultChecked onChange={(checked)=>this.handleSwitchChange(checked,'switch2')} />
            </Form.Item>
          </Form>
        </Header>
        <Content style={{overflow:'hidden', position:'relative'}}>
          <Table id='myTable1' ref={ref => this.myTable1 = ref} className="myTableStyle" bordered={true} sticky={true} 
          size='small' rowKey={this.state.keyfield} 
            //scroll={{x:1022, y:3000}}   //滚动条用外层的方法
            //style={{overflow:'auto', position:'absolute', height:'100%'}}
            scroll={{x:'90%',y: 'calc(100vh - 148px)'}}
            style={{overflow:'hidden', position:'absolute', height:'100%', maxHeight:'100%'}}            
            columns={columns} dataSource={this.state.data} pagination={false}
            onChange={this.handleSorter}
            rowSelection={  {
              type: this.state.type, 
              selectedRowKeys: this.state.selectedkeys,
              onChange:(selectedRowKeys,selectedRows)=>{this.selectionChange(selectedRowKeys,selectedRows)}
            }}
            onRow={(record) => {
              return {
                onClick: (e) => {this.handleSelectRow(record)}, // 点击行
                onDoubleClick: (e) => {this.handleOpenMyWin1(record)},
                onContextMenu: (e) => {this.handleContextMenu(record,e)}
              };
            }}
            />
        </Content>
        <Footer style={{padding:'5px 16px 0px 16px', height:36, border:'1px solid #95B8E7', borderLeft:'0px', background:'#efefef'}}>
           <Pagination size="small" total={this.state.total} style={{textAlign:'center'}} 
             showSizeChanger pageSizeOptions={['10', '20', '50', '100']} showQuickJumper className='paginationStyle'
             current={this.state.pageno} defaultPageSize={this.state.pagesize} 
             pageSize={this.state.pagesize} 
             showTotal={(total, range) => this.showTotal(total,range) }
             onShowSizeChange={this.handleSizeChange.bind(this)}
             onChange={this.handlePageChange.bind(this)}             
             />
        </Footer>
      </Layout>
      <Modal name='myWin1' title='商品详细信息' open={this.state.myWin1} width={500} centered forceRender
       cancelText='关闭' onCancel={this.handleCloseMyWin1} style={{position:'relative'}}
       closable='true' footer={[<Button key='btnclose' type='primary' onClick={this.handleCloseMyWin1}>关闭</Button>]}>
        <Watermark content={['Ant Design', 'Modal窗体显示']} style={{height:'100%'}}>
           <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" 
              initialValues={this.state.row} 
              style={{position:'relative', height:500, overflow:'auto'}} >
              <AntTextBox params='productid,商品编码,82,0,14,0,160,disabled' top={16+rowheight*0} ref={this.productid} />
              <AntTextBox params='productname,商品名称,82,0,14,0,300,readonly' top={16+rowheight*1} />
              <AntTextBox params='quantityperunit,规格型号,82,0,14,0,300,readonly' top={16+rowheight*2} />
              <AntTextBox params='unit,计量单位,82,0,14,0,160,readonly' top={16+rowheight*3}  />
              <AntNumberBox params='unitprice,单价,82,0,14,0,160' top={16+rowheight*4} min={0.01} precision={2} />
              <AntTextBox params='categoryid,类别编码,82,0,14,0,160,readonly' top={16+rowheight*5}  />
              <AntTextBox params='categoryname,类别名称,82,0,14,0,300,readonly' top={16+rowheight*6}  />
              <AntTextBox params='supplierid,供应商编码,82,0,14,0,160,readonly' top={16+rowheight*7}  />
              <AntTextBox params='suppliername,供应商名称,82,0,14,0,300,readonly' top={16+rowheight*8}  />
              <AntImage params='photopath,图片预览,82,0,14,0,300' datatype='json' top={16+rowheight*9} ref={ref=>this.photopath=ref} fieldNames={{url:'filename'}} />
          </Form>
        </Watermark>
      </Modal>
      </>
    )
  }
}
