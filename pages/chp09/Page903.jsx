import React, { Component } from 'react'
import { myLocalTime, reqdoSQL, reqdoTree,  myNotice } from '../../api/functions'
//import { ConfirmModal, AntImageUpload, AntCascader, AntHiddenField, AntComboTree, AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { MyFormComponent } from '../../api/antdFormClass.js';
import { Tabs, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdImageUpload, ConfirmModal, AntdHiddenField } from '../../api/antdClass.js';
import { RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Resizable } from 'rc-easyui';
const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview-cn/
//https://procomponents.ant.design/components
//https://marketplace.visualstudio.com/items?itemName=WhenSunset.chatgpt-china
//网格+选项卡
const rowheight = 48;
export default class Page903 extends MyFormComponent {
  state = {
    myTable1: {
      data: [],      //某一页数据
      total: 0,       //行总数
      pageno: 1,      //当前选中页
      pagesize: 20,   //每页显示行数
      rowindex: 0,    //当前页光标位置
      keyfield: 'productid',   //主键
      sortfield: '',     //排序列，只有一列
      row: {},          //当前选中的行
      selectedkeys: [], //antd中选中打钩的行主键值
      selectedrows: [], //antd中选中打钩的行
    },
    tabcount: 2,   //tabs的选项卡个数
    activetabkey: 'myTab1',
    myWin1: false,
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
    deleteconfirm: false,   //是否打开删除确认框
    confirmtitle: ''
  }

  componentDidMount = async () => {
    this.loadTableData();
  }

  componentWillUnmount() {
    //clearInterval(this.timer);
  }

  startTabComponents = () => {
    //激活选项卡中的控件，只要执行一次就可以，放在componentDidMount好像不可以
    let activetabkey = this.state.activetabkey;
    if (activetabkey == '') { //页面只执行一次的设置及与判断
      activetabkey = 'myTab1';
      for (let i = 1; i <= this.state.tabcount; i++) {
        //激活其它选项卡
        if (this.state.activetabkey != 'myTab' + i) {
          this.setState({ activetabkey: 'myTab' + i }, () => {
            setTimeout(() => {
              this[this.state.myTable1.keyfield]?.setState({ editable: false });
            })
          });
        }
      }
      this.setState({ activetabkey: activetabkey }, () => {
        setTimeout(() => {
          this[this.state.myTable1.keyfield]?.setState({ editable: false });
        })
      });
      //激活选项卡结束
    }
  }

  loadTableData = async () => { //加载每页数据
    let { pageno, pagesize, selectedkeys, rowindex } = this.state.myTable1
    let p = {}
    p.sqlprocedure = 'demo503a'
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue = '';
    p.filter = this.filtertext.state.value.trim();
    p.sortfield = this.state.sortfield;
    const rs = await reqdoSQL(p)
    //计算total  可以没有记录total值
    let total = 0;
    if (rs.rows && rs.rows.length > 0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex < 0 || rowindex >= rs.rows.length) rowindex = 0;
    if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.myTable1.keyfield]];
    else selectedkeys = [];
    //console.log(991,selectedkeys);    
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, data: rs.rows, pageno: pageno, pagesize, total, rowindex, selectedkeys: selectedkeys } }, () => {
      setTimeout(() => {
        this.handleSelectRow(rs.rows[rowindex], rowindex);
      })
    });
  }

  handleSearchFilter = async () => {
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, pageno: 1, rowindex: 0 } }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handlePageChange = (pageno, pagesize) => { //换页事件
    //alert(pageno+'----'+pagesize)    
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, pagesize, pageno } }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  selectionChange = (selectedkeys, selectedrows) => {
    //checkbox选中的项,单选功能的实现
    //console.log(444,selectedkeys, rows)
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, selectedkeys, selectedrows } })
  }

  handleTabChange = (activetabkey) => {
    this.setState({ activetabkey });
    //this.setFormValues('myForm1', this.state.myTable1.row);
    //this[this.state.myTable1.keyfield]?.setState({editable: false});
  }

  handleSelectRow = (row, index) => {
    //console.log(551, this.state.myTable1.data)
    console.log(1552, row, index)
    if (!row || index < 0) return;
    //加载表单数据,之前必须激活选项卡
    let table = { ...this.state.myTable1 }
    let record = this.setFormValues('myForm1', row);
    this.setState({ addoredit: 'update', record: record, myTable1: { ...table, row: row, rowindex: index, selectedkeys: [row[this.state.myTable1.keyfield]] } }, () => {
      setTimeout(() => {
        //只有点击过选项卡之后，才有表单控件，才可以赋值
        this[this.state.myTable1.keyfield]?.setState({ editable: false });
      })
    });
  }

  handleEditRow = (e) => {
    let row = this.state.myTable1.row;
    this.setState({ myWin1: true, addoredit: 'update' }, () => {
      setTimeout(() => {
        //this.startTabComponents();  //激活选项卡中的控件
        //this.setFormValues('myForm1', row);
        //this[this.state.myTable1.keyfield]?.setState({editable: false});
      })
    });
  }

  handleAddRow = () => {  //aaaaaaaa
    this.setState({ myWin1: true, addoredit: 'add' }, () => {
      //this.startTabComponents();  //激活选项卡中的控件
      this.resetFormValues('myForm1');
      this[this.state.myTable1.keyfield]?.setState({ editable: true });
    });
  }

  handleDeleteClick = async (e) => {
    let keys = this.state.myTable1.selectedkeys;
    if (keys.length > 0) {
      this.myDeleteModal.setState({ visible: true, description: '是否确定删除' + (keys.length == 1 ? '【' + keys[0] + '】这个商品' : '这' + keys.length + '个商品') });
      this.setState({ deleteconfirm: true, confirmtitle: keys.length == 1 ? '【' + keys[0] + '】这个商品？' : '这' + keys.length + '个商品？' });
    }
    return;
  }

  handleDeleteRows = async (e) => {  //ddddddddddddddelete
    let table = { ...this.state.myTable1 }
    let { selectedkeys, keyfield, pageno, pagesize, total, data } = table;
    //console.log(999,row, rowindex, keyfield)
    //一次删除一行
    let p = {};
    p.sqlprocedure = "demo901a";
    let rows = [];
    let rowindex = -1;
    for (let i = 0; i < selectedkeys.length; i++) {
      let n = data.findIndex((item) => item[keyfield] == selectedkeys[i]);
      if (n >= 0) {
        rowindex = rowindex < 0 ? n : Math.min(n, rowindex);
        let xdata = { ...data[n] };
        xdata._action = 'delete';
        xdata._reloadrow = 0;
        rows.push(xdata);
        p.data = [xdata];
        let rs = await reqdoSQL(p);
      }
    }
    total = total - selectedkeys.length;
    //p.sqlprocedure = "demo502c";
    //console.log(JSON.stringify(p.data));
    //let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
    //删除服务器端上传的文件，调用函数
    this.deleteUploadedFiles('myForm1', rows);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex = total - 1 - (pageno - 1) * pagesize;
    //console.log(333, rowindex, rowno, total, pageno);
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    if (pageno <= 0) pageno = 0;
    this.myDeleteModal.setState({ visible: false });
    this.setState({ myTable1: { ...table, pageno, rowindex }, deleteconfirm: false }, () => { //自动触发1次，先清空data
      setTimeout(() => {
        this.loadTableData();
      })
    });
    //message.info('确认删除'+row.productname+'这个商品？');
  }

  handleSaveRow = async (e) => {  //sssssssssssave
    //保存数据
    let table = { ...this.state.myTable1 }
    let { pageno, pagesize, total, rowindex, row, keyfield } = table;
    let { record, addoredit } = this.state;
    let data = this.getFormValues('myForm1');  //转换数据内容
    //if (data._action=='add') data[this.state.myTable1.keyfield]=0;  //主键值自动生成
    //console.log(664, data);
    data._action = addoredit;
    data._reloadrow = 1;
    data._treeflag = 0;
    let p = {};
    p.sqlprocedure = 'demo901a';  //"demo504a";
    p.data = [];
    p.data.push(data);
    if (addoredit != 'add') {
      p.data.push(record);  //旧的没有修改过的数据
    }
    //console.log(p.data);
    //console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    if (rs.rows.length > 0 && (rs.rows[0]._error == undefined || rs.rows[0]._error == '')) { //数据验证
      //替换数组中的这个元素
      //console.log(665,rs.rows);
      if (addoredit == 'add') {
        //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
        data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
        let data0 = this.renameUploadedFiles('myForm1', rs.rows[0]);
        data = Object.assign({}, data, data0);  //合并对象属性
        data._action = 'update';
        data._reloadrow = 1;
        data._treeflag = 0;
        let p = {};
        p.sqlprocedure = 'demo901a';  //"demo504a";;
        p.data = [];
        p.data.push(data);  //p.data只有一行时，where修改条件取第一行的值
        console.log(775, JSON.stringify(p.data));
        let rs1 = await reqdoSQL(p);
      }
      //新增记录或修改记录后可能排序次序发生变化，重新进行分页，计算行号定位到新行的这一页这一行
      let rowno = parseInt(rs.rows[0]._rowno);
      if (pagesize > 0) {  //分页时计算页码和行号
        //console.log(666,rowno);
        pageno = parseInt((rowno - 1) / pagesize) + 1;
        rowindex = rowno - (pageno - 1) * pagesize - 1;
        total++;
      } else { //不分页不计算行号
        rowindex = rowno - 1;
      }
      this.setState({ addoredit: 'update', myWin1: false, myTable1: { ...table, total, rowindex, pageno } }, () => {
        setTimeout(() => {
          this.loadTableData();
          myNotice('商品记录已经保存，请刷新数据!', '', 200)
        })
      });
    } else {
      myNotice('商品编码重复，记录保存失败！', 'error');  //
    }
  }

  handleProductChange = (e) => {
    console.log(111111, e, this.productid.state.value)
  }

  showTotal = (total, range) => {
    let { pageno, pagesize } = this.state.myTable1;
    let start = (pageno - 1) * pagesize + 1;
    let limit = Math.min(start + pagesize - 1, total);
    let pagecount = parseInt((total - 1) / pagesize) + 1;
    let str = `当前第${start}~${limit}行，共${total}行（共${pagecount}页）。`;
    return str;
  }

  /*
  showCellText=(text,align)=>{
    return <div className='textdiv' style={{padding:0,textAlign:align}}>{text}</div>    
  }
  */
  handleContextMenu = (row, index, e) => {
    //右键设置，选中这一行
    this.handleSelectRow(row, index);
    return;
    /*   
    let id=document.getElementById('myTable1');
    id.oncontextmenu = function(e){
      e.preventDefault();
    } 
    */
  }

  handleSizeChange = (current, pagesize) => {
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, pagesize } }, () => {
      setTimeout(() => {
        //this.loadTableData();
      })
    });
  }

  handleSorter = (v1, v2, sorter) => {
    console.log(111, sorter)
    let f = sorter.field;
    let d = sorter.order;
  }

  handleRefresh = () => {  //rrrrrrrr 
    this.filtertext.setState({ value: '' });    //不会清空
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, pageno: 1, rowindex: 0, selectedkeys: [] }, addoredit: 'update', activetabkey: 'myTab1' }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handleMyMenu1Click = (e) => {
    //在Table设置右键菜单时需要在dropdown与Table之间添加一个<div>
    let key = e.key;
    if (key == 'menu-delete') this.handleDeleteClick(e);
    else if (key == 'menu-add') this.handleAddRow();
    else if (key == 'menu-edit') this.handleEditRow();
    else if (key == 'menu-refresh') this.handleRefresh();
  }

  handleCategoryChange = (value, row) => {
    //console.log(666,value[0],row[0])
    if (value?.length > 0) {
      this.myForm1.setFieldValue('categoryid', value[0]);
      this.myForm1.setFieldValue('categoryname', row[0].categoryname);
    }
  }

  handleSupplierChange = (value, row) => {
    //console.log(value,row)
    this.myForm1.setFieldValue('supplierid', row.supplierid);
  }

  onFinish = (json) => { //提交时触发
    console.log(661, json);
  }

  render() {
    const { data, pagesize, total, addoredit, pageno } = this.state;
    const items1 = [
      { label: '新增', key: 'menu-add', icon: <PlusCircleOutlined /> },
      { label: '修改', key: 'menu-edit', icon: <EditOutlined /> },
      { type: 'divider', key: 'menu13' },
      { label: '删除', key: 'menu-delete', icon: <DeleteOutlined /> },
      { type: 'divider', key: 'menu15' },
      { label: '刷新', key: 'menu-refresh', icon: <RedoOutlined /> }
    ];

    const columns = [
      {
        title: '序号', dataIndex: 'xrowno', width: '50px', fixed: 'left', className: 'rownumberStyle',
        render: (text, record, index) => (this.state.myTable1.pageno - 1) * this.state.myTable1.pagesize + index + 1
      },
      { dataIndex: 'productid', title: '商品编码', width: '80px', align: 'center', datatype: 'c', fixed: 'left' },
      { dataIndex: 'productname', title: '商品名称', width: '250px', fixed: 'left', ellipsis: true },
      { dataIndex: 'englishname', title: '英文名称', width: '250px', align: 'center', ellipsis: true },
      { dataIndex: 'quantityperunit', title: '规格型号', width: '180px' },
      { dataIndex: 'unit', title: '计量单位', width: '80px', align: 'center' },
      { dataIndex: 'unitprice', title: '单价', width: '80px', align: 'right', sorter: (a, b) => a.unitprice - b.unitprice },
      { dataIndex: 'supplierid', title: '供应商编号', width: '90px' },
      { dataIndex: 'suppliername', title: '供应商名称', width: '250px', ellipsis: true },
      { dataIndex: 'categoryid', title: '类别编号', width: '80px', align: 'center' },
      {
        dataIndex: 'categoryname', title: '类别名称', width: '150px', ellipsis: true,
        render: (text, record, index) => { return <b><i>{text}</i></b> }
      }
    ]

    return (<>
      <Layout style={{ overflow: 'hidden', position: 'absolute', height: '100%' }}>
        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='filterbar'>
            <div style={{ marginTop: 1, paddingTop: 1 }}>
              <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddRow.bind(this)}>新增</Button>
              <Button type="text" icon={<EditOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleEditRow.bind(this)}>修改</Button>
              <Button type="text" icon={<DeleteOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleDeleteClick.bind(this)}>删除</Button>
              <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </div>
            <AntdInputBox type='search' id='filtertext' label='快速过滤' labelwidth='72' top='2' left='330' width='350' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        <Content style={{ overflow: 'hidden', position: 'relative' }}>
          <Dropdown menu={{ items: items1, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}><div>
            <Table className="myTableStyle" sticky={true} size='small' rowKey={this.state.myTable1.keyfield} id='myTable1' ref={ref => this.myTable1 = ref} bordered={true}
              scroll={{ x: '90%', y: 'calc(100vh - 148px)' }}
              style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
              columns={columns} dataSource={this.state.myTable1.data} pagination={false}
              onChange={this.handleSorter}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: this.state.myTable1.selectedkeys,
                onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) }
              }}
              onRow={(record, index) => {
                return {
                  onClick: (e) => { this.handleSelectRow(record, index) }, // 点击行
                  onDoubleClick: (e) => { this.handleEditRow(record, index) },
                  onContextMenu: (e) => { this.handleContextMenu(record, index, e) }
                };
              }} />
          </div></Dropdown>
        </Content>
        <Footer style={{ padding: '6px 16px 0px 16px', height: 38, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
          <Pagination size="small" total={this.state.myTable1.total} style={{ textAlign: 'center' }}
            showSizeChanger pageSizeOptions={['10', '20', '50', '100']} showQuickJumper className='paginationStyle'
            current={this.state.myTable1.pageno} defaultPageSize={this.state.myTable1.pagesize} pageSize={this.state.myTable1.pagesize} showTotal={(total, range) => this.showTotal(total, range)}
            onShowSizeChange={this.handleSizeChange.bind(this)} onChange={this.handlePageChange.bind(this)} />
        </Footer>
      </Layout>
      <Drawer name='myWin1' title='编辑商品信息' open={this.state.myWin1} width={440} forceRender centered maskClosable={false} keyboard={false}
        placement='right' size='small' onClose={() => { this.setState({ myWin1: false }) }} style={{ position: 'relative', padding: 0, margin: 0 }} closable
        styles={{ body: { padding: 0, margin: 0 }, header: { height: 45 } }}
        footer={[
          <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }} style={{ float: 'right', marginRight: 4 }} >关闭</Button>,
          <Button key='btnok' type='primary' htmltype='submit' onClick={this.handleSaveRow} style={{ float: 'right', marginRight: 6 }}>保存</Button>,
        ]}>
        <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'hidden' }} >
          <Tabs id="myTab" activeKey={this.state.activetabkey} size="small" tabBarGutter={24}
            style={{ margin: 0, marginLeft: 16, padding: 0, paddingRight: 20, height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}
            //onChange={this.handleTabChange.bind(this)}
            onChange={(activetabkey) => this.setState({activetabkey: activetabkey})}            
            items={[
              {
                label: '基本信息', key: 'myTab1', forceRender: true, children:
                  <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    <AntdInputBox type='text' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={8 + rowheight * 0} ref={ref => this.productid = ref} />
                    <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 1}  ref={ref => this.productname = ref} />
                    <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 2}  ref={ref => this.englishname = ref} />
                    <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='300' top={8 + rowheight * 3}  ref={ref => this.quantityperunit = ref} />
                    <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={8 + rowheight * 4}  ref={ref => this.unit = ref} />
                    <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='216' width='85' top={8 + rowheight * 4} min={0.01} precision={2} controls={false} ref={ref => this.unitprice = ref} />
                    <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={8 + rowheight * 5} ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} />
                    <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='2' width='300' readOnly top={8 + rowheight * 6}  ref={ref => this.categoryname = ref} />
                    <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={8 + rowheight * 7} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid'  ref={ref => this.supplierid = ref}/>
                    <AntdInputBox type='date' id='releasedate' label='发布日期' labelwidth='82' left='2' width='140' top={8 + rowheight * 8} ref={ref => this.releasedate = ref} />                    
                  </div>
              }, {
                label: '上传图片', key: 'myTab2', forceRender: true, children:
                  <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    <AntdImageUpload id='photopath' label='图片预览' labelwidth='82' left='2' width='400' datatype='json' top={2 + rowheight * 0} uploadonsave
                      ref={ref => this.photopath = ref} targetpath='mybase/resources' xfiletag='`p_${sys.productid}`' filetag='sys.productid' timeStamp={false}
                      fieldNames={{ url: 'filename' }} maxCount='5' />
                  </div>
              }
            ]}
          />
          <AntdHiddenField id='supplieridx' />
          <AntdHiddenField id='categoryid' />
        </Form>
      </Drawer>
      {/*
       <div style={{margin:'140px 0px 100px 60px'}}>
          <Popconfirm open={this.state.deleteconfirm} arrow title='系统确认' description={`是否确定删除${this.state.confirmtitle}？`}
           okText="确定" cancelText="取消" overlayStyle={{width:350}} placement='right' onCancel={()=>this.setState({deleteconfirm: false})}
           onConfirm={this.handleDeleteRows.bind(this)} />
       </div>
       */}
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRows.bind(this)} />
    </>)
  }
}
