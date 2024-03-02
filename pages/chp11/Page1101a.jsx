//0.导入路由组件
//import { Tooltip, FloatButton, Tree, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import React, { Component } from 'react'
import { myNotice, myDoFiles, myLocalTime, reqdoSQL, reqdoTree } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
//import { ConfirmModal, AntImageUpload, AntCascader, AntHiddenField, AntComboTree, AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { DownOutlined, PaperClipOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Tabs, Tooltip, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import { AntdTree, AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdImageUpload, AntdHiddenField, ConfirmModal } from '../../api/antdClass.js';

//import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdImage } from '../../api/antdClass.js';
import { Resizable } from 'react-resizable';
const { Header, Content, Footer, Sider } = Layout;
const sys = { ...React.sys };
const rowheight = 42;
const layoutStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  padding: 0,
  margin: 0,
  border: '0px solid #95B8E7',
  overflow: 'hidden'
};

const resizeHandle = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '-3px', /* 使得把手稍微突出以便于拖动 */
  width: '3px', /* 把手宽度 */
  cursor: 'ew-resize',
  //backgroundColor:'rgb(224,236,255)',
  zIndex: 10 /* 确保把手在最前面 */
}

export default class Page1101 extends MyFormComponent {
  state = {
    myTable1: {
      data: [],  //某一页数据
      total: 0,  //行总数
      pageno: 1, //当前选中页
      pagesize: 20,  //每页显示行数
      rowindex: 0,   //当前页光标位置
      keyfield: 'productid',   //主键
      sortfield: '',   //排序列，只有一列
      row: {},  //当前选中的行
      lastrow: {}, //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
      selectedkeys: [],  //antd中选中打钩的行
      reloadflag: 1,
      columns: [
        {
          title: '序号', dataIndex: 'xrowno', width: '50px', fixed: 'left', className: 'rownumberStyle',
          render: (text, record, index) => (this.state.myTable1.pageno - 1) * this.state.myTable1.pagesize + index + 1
        },
        { dataIndex: 'productid', title: '商品编码', width: '80px', align: 'center', fixed: 'left' },
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
          render: (text, record, index) => { return <b><i>{record.categoryname}</i></b> }
        },
        {
          title: '操作', dataIndex: '_operation', key: '_operation', fixed: 'right', width: '52px',
          //record对应的是render里的对象 ，dataindex对应的值
          render: (text, record, index) => <>
            <Tooltip title="修改记录" placement="bottom"><Button size='small' type="text" icon={<EditOutlined style={{ fontSize: '10px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => this.handleEditRow(record)} /></Tooltip>
            <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定删除"${record.productname}"的这个商品？`}
              onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft">
              <Tooltip title="删除记录" placement="bottom"><Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '10px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip>
            </Popconfirm>
          </>
        }],
    },
    myTree1: {
      treewidth: 280,
      node: {},  //当前myTree1树中选中的结点
    },
    resizing: false,
    supplierdata: [],
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
    myWin1: false,    //子窗体modal初始时为关闭状态
    menuitems: [{ label: '新增', key: 'menu-add', icon: <PlusCircleOutlined /> }, { label: '修改', key: 'menu-edit', icon: <EditOutlined /> }, { type: 'divider', key: 'menu13' }, { label: '删除', key: 'menu-delete', icon: <DeleteOutlined /> }, { label: '刷新', key: 'menu-refresh', icon: <RedoOutlined /> }],
    activetabkey: 'myTab1',
  }


  componentDidMount = async () => {
    this.loadTableData();
  }

  loadTableData = async () => { //加载每页数据
    let { pageno, pagesize, selectedkeys, rowindex } = this.state.myTable1
    let p = {}
    p.sqlprocedure = 'demo1101b';// 'demo503a'
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue = '';
    p.filter = this.filtertext.state.value.trim();
    p.sortfield = this.state.sortfield;
    p.categoryid = this.state.myTree1.node.categoryid || '';
    const rs = await reqdoSQL(p);
    //计算total  可以没有记录total值
    let total = 0;
    if (rs.rows && rs.rows.length > 0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex < 0 || rowindex >= rs.rows.length) rowindex = 0;
    if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.myTable1.keyfield]];
    else selectedkeys = [];
    //console.log(991,JSON.stringify(rs));
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, data: rs.rows, pageno: pageno, pagesize, total, rowindex, selectedkeys: selectedkeys } }, () => {
      setTimeout(() => {
        //console.log(999);
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

  selectionChange = (selectedkeys, rows) => {
    //checkbox选中的项,单选功能的实现
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, selectedkeys: selectedkeys, row: rows[0] } })
  }

  handleSelectRow = (row, index) => {
    if (!row) return;
    let table = { ...this.state.myTable1 }
    let record = this.setFormValues('myForm1', row);
    this.setState({ addoredit: 'update', record: record, myTable1: { ...table, row: row, rowindex: index, selectedkeys: [row[this.state.myTable1.keyfield]] } }, () => {
      setTimeout(() => {
        if (this.state.myWin1) {
          this[this.state.myTable1.keyfield].setState({ editable: false });
        }
      })
    });
  }

  handleMyMenu1Click = (e) => {
    //右键菜单程序
    let key = e.key;
    if (key == 'menu-delete') this.handleDeleteClick();
    else if (key == 'menu-add') this.handleAddClick();
    else if (key == 'menu-edit') this.handleEditRow(this.state.myTable1.row);
    else if (key == 'menu-refresh') this.handleRefreshRow(e);
  }

  handleEditRow = (row) => { //eeeeeeee
    //console.log(117,this.state.myTable1.data);
    //console.log(118,row);
    this.setState({ myWin1: true, addoredit: 'update' }, () => {
      setTimeout(() => {
        //this.setFormValues('myForm1', row);
        //this[this.state.myTable1.keyfield].setState({editable: false});
      })
    });
  }

  handleAddClick = () => {  //aaaaaaaa
    this.setState({ myWin1: true, addoredit: 'add' }, () => {
      this.resetFormValues('myForm1');
      this[this.state.myTable1.keyfield].setState({ editable: true });
    });
  }

  handleDeleteClick = async (e) => {
    let { row, keyfield } = this.state.myTable1;
    this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + row[keyfield] + '】这个商品？' });
    return;
  }

  handleDeleteRow = async (row, index) => {  //ddddddddddddddelete
    let table = { ...this.state.myTable1 }
    let { pageno, pagesize, total, rowindex, keyfield } = table;
    row = this.state.myTable1.row;
    console.log(999, row, rowindex, keyfield)
    let xdata = { ...row };
    //xdata[keyfield] = row[keyfield];
    xdata._action = 'delete';
    xdata._reloadrow = 0;
    let p = {};
    p.sqlprocedure = 'demo901a'; // "demo502c";
    p.data = [];
    p.data.push(xdata);
    //console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
    this.deleteUploadedFiles('myForm1', p.data);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex--;
    //console.log(333, rowindex, rowno, total, pageno);
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    if (pageno > 0) {
      this.myDeleteModal.setState({ visible: false });
      this.setState({ myTable1: { ...table, pageno, rowindex } }, () => { //自动触发1次，先清空data
        setTimeout(() => {
          this.loadTableData();
        })
      });
    }
  }

  handleSaveClick = async () => {  //sssssssssssave
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
      if (this.state.addoredit == 'add') {
        //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
        data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
        //修改新增时上传文件的名称，可能需要把临时文件改成与主键列相关的文件名
        let data0 = this.renameUploadedFiles('myForm1', rs.rows[0]);
        console.log(222, data0);
        data = Object.assign({}, data, data0);  //合并对象属性
        data._action = 'update';
        data._reloadrow = 1;
        data._treeflag = 0;
        let p = {};
        p.sqlprocedure = 'demo901a';  //"demo504a";;
        p.data = [];
        p.data.push(data);  //p.data只有一行时，where修改条件取第一行的值
        //console.log(775,JSON.stringify(p.data));
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
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.handleSelectRow(row, index);
    let id = document.getElementById('myTable1');
    id.oncontextmenu = function (e) {
      e.preventDefault();
    }
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
  /*
  showImage=()=>{
    console.log(999,this.state.row[this.state.myTable1.keyfield]);
    //this.imagepath.setState({src:'myServer/mybase/products/'+this.state.row[this.state.myTable1.keyfield]+'.jpg'});
    //return ('myServer/mybase/products/'+this.state.row[this.state.myTable1.keyfield]+'.jpg');
  }
  */

  handleRefresh = () => {

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

  handleTabChange = (activetabkey) => {
    console.log(activetabkey);
    this.setState({ activetabkey });   
  }

  handleSelectNode = async (key, e) => {
    this.setState({ myTable1: { ...this.state.myTable1, pageno: 1 }, myTree1: { ...this.state.myTree1, node: e.node } }, () => this.loadTableData());
  }


  onResize = (event, { element, size }) => {
    if (!this.state.resizing) {
      this.setState({ resizing: true });
    }
    window.requestAnimationFrame(() => this.setState({ myTree1: { ...this.state.myTree1, treewidth: size.width } }));
  };

  onResizeStop = () => {
    this.setState({ resizing: false });
  };

  render() {
    return (<>
      <Layout style={layoutStyle} >
        <Resizable width={this.state.myTree1.treewidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div style={resizeHandle} />} resizeHandles={['e']}>
          <Sider theme='light' width={this.state.myTree1.treewidth} style={{ height: '100%', position: 'relative', marginLeft: 0, padding: 0, borderRight: '1px solid #95B8E7' }}>
            <AntdTree ref={ref => this.myTree1 = ref} style={{ overflow: 'hidden' }}
              icon={<PaperClipOutlined />}
              //switcherIcon={<DownOutlined /> }
              root="全部类别" filter='truex'
              onSelectNode={this.handleSelectNode.bind(this)}  /*自定义属性*/
              sqlprocedure="demo804a" filterprocedure="demo804e" loadall="xtrue" />
          </Sider>
        </Resizable>
        <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
          <Layout>
            <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: sys.toolbarcolor, borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
              <Form name='filterbar' style={{ position: 'relative' }}>
                <div style={{ marginTop: 1, paddingTop: 1 }}>
                  <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>新增</Button>
                  <Button type="text" icon={<FileExcelOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>导出</Button>
                  <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
                </div>
                <AntdInputBox id='filtertext' label='快速过滤' labelwidth='72' top='1' left='250' width='300' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
              </Form>
            </Header>
            <Dropdown menu={{ items: this.state.menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
              <Content style={{ overflow: 'hidden', position: 'relative', width: '100%', overflowX: 'auto' }}>
                <Table className="myTableStyle" sticky={true} size='small' rowKey={this.state.myTable1.keyfield} id='myTable1' ref={ref => this.myTable1 = ref} bordered={true}
                  //scroll={{x:'80%'}}   //滚动条用外层的方法
                  //style={{overflow:'auto', position:'absolute', height:'100%'}}
                  scroll={{ x: '90%', y: 'calc(100vh - 148px)' }}
                  style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
                  columns={this.state.myTable1.columns} dataSource={this.state.myTable1.data} pagination={false}
                  onChange={this.handleSorter}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: this.state.myTable1.selectedkeys,
                    onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) }
                  }}
                  onRow={(record, index) => {
                    return {
                      onClick: (e) => { this.handleSelectRow(record, index) }, // 点击行
                      onDoubleClick: (e) => { this.handleEditRow(record, index) },
                      onContextMenu: (e) => { this.handleContextMenu(record, index, e) }
                    };
                  }}
                />
              </Content>
            </Dropdown>
            <Footer style={{ padding: '5px 16px 0px 16px', height: 36, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: sys.footercolor }}>
              <Pagination size="small" total={this.state.myTable1.total} style={{ textAlign: 'center' }}
                showSizeChanger pageSizeOptions={['10', '20', '50', '100']} showQuickJumper className='paginationStyle'
                current={this.state.myTable1.pageno} defaultPageSize={this.state.myTable1.pagesize}
                pageSize={this.state.myTable1.pagesize}
                showTotal={(total, range) => this.showTotal(total, range)}
                onShowSizeChange={this.handleSizeChange.bind(this)}
                onChange={this.handlePageChange.bind(this)}
              />
            </Footer>
          </Layout>
        </Content>
      </Layout>
      <Modal name='myWin1' title='商品详细信息' open={this.state.myWin1} width={480} forceRender centered maskClosable={false}
        cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }}
        styles={{ position: 'relative', padding: 0, body: { overflowY: 'scroll', height: '500px', width: '450px', padding: 0, margin: 0 } }}
        closable keyboard={false}
        footer={[<Button key='btnok' type='primary' htmltype='submit' onClick={this.handleSaveClick}>保存</Button>, <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
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
                    <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 1} />
                    <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 2} />
                    <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='300' top={8 + rowheight * 3} />
                    <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={8 + rowheight * 4} />
                    <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='216' width='85' top={8 + rowheight * 4} min={0.01} precision={2} controls={false} />
                    <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={8 + rowheight * 5} ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} />
                    <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='2' width='300' readOnly top={8 + rowheight * 6} />
                    <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={8 + rowheight * 7} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid' />
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
      </Modal>
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRow.bind(this)} />
    </>);
  }
}
