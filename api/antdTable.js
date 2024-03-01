import { Divider, Tooltip, FloatButton, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import React, { Component } from 'react'
import { myDoFiles, myLocalTime, reqdoSQL, reqdoTree, myNotice } from './functions';
import { MyFormComponent } from './antdFormClass.js';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdHiddenField, AntdImage, ConfirmModal, AntdModal } from './antdClass.js';
import { RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
/*
const components = {
  body: {
    row: props => <tr className="tableRowStyle" {...props} />,
  },
};
*/
//myTableStyle在style.css中
//https://ant.design/components/overview-cn/
//https://blog.csdn.net/weixin_45991188/article/details/108050424 
const sys = { ...React.sys };
const rowheight = 42;
const rowStyle = {
  padding: 0,
  color: 'white',
  height: 32,
  textOverflow: 'ellipsis', 
  whiteSpace: 'nowrap' 

}
const buttonStyle = {
  padding: 0,
  height: 30,
  width: 65,
  marginTop: 2,
}

export class AntdTable extends MyFormComponent {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'table';
    let { modal, columns, filter, rowselect, rowbuttons, contextmenu, keyfield, keytitle, rownumber, pagesize, 
      rowselection, toolbar, height, width, showQuickJumper, showSizeChanger, rowheight } = attr;
    if (!height || isNaN(height)) height = -1;
    else height = parseInt(height);
    if (!width || isNaN(width)) width = -1;
    else width = parseInt(width);
    if (!rowheight || isNaN(rowheight)) rowheight = -1;
    else rowheight = parseInt(rowheight);    
    if (!pagesize || isNaN(pagesize)) pagesize = 20;
    else pagesize = parseInt(pagesize);
    if (rownumber) {
      columns.unshift({
        title: '序号', dataIndex: '_rowno', width: 50, fixed: 'left', className: 'rownumberStyle',
        render: (text, record, index) => (this.state.pageno - 1) * this.state.pagesize + index + 1
      });
    }
    //console.log(123, rowbuttons, columns)
    //columns = myParseColumns(columns) ;
    if (rowbuttons && rowbuttons != '') {
      let link = <Tooltip title="新增记录" placement="bottom"><Button size='small' type="text" icon={<PlusCircleOutlined style={{ textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => this.handleAddClick()} /></Tooltip>;
      columns.push({
        title: (<span>操作{link}</span>), dataIndex: '_operation', key: '_operation', fixed: 'right', width: '60px', align: 'center',
        render: (text, record, index) => <>
          <Tooltip title="修改记录" placement="bottom"><Button size='small' type="text" icon={<EditOutlined style={{ fontSize: '12px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => this.handleEditClick(record)} /></Tooltip>
          <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定删除"${record[keyfield]}"这条${keytitle}？`}
            onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft">
            <Tooltip title="删除记录" placement="bottom"><Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '12px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip>
          </Popconfirm>
        </>
      });
    }
    if (rowselection === undefined) rowselection = 'radio';
    else if (rowselection != 'checkbox' && rowselection != 'multiple') rowselection = 'radio';
    //处理工具栏
    if (toolbar === undefined) toolbar = '';
    let toolbarbuttons = [];
    let toolbarwidth = 12;
    let tmp = toolbar.split(';');
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i] == '-') {
        toolbarbuttons.push(<Divider key={'_divider' + i} type='vertical' style={{ height: 22, marginTop: 0 }} />);
        toolbarwidth += 16;
      } else if (tmp[i] == 'add') {
        toolbarbuttons.push(<Button type="text" key='_cmdadd' icon={<PlusCircleOutlined />} style={buttonStyle} onClick={this.handleAddClick}>新增</Button>)
        toolbarwidth += 65;
      } else if (tmp[i] == 'edit') {
        toolbarbuttons.push(<Button type="text" key='_cmdedit' icon={<EditOutlined />} style={buttonStyle} onClick={this.handleEditClick}>修改</Button>)
        toolbarwidth += 65;
      } else if (tmp[i] == 'delete') {
        toolbarbuttons.push(<Button type="text" key='_cmddelete' icon={<DeleteOutlined />} style={buttonStyle} onClick={this.handleDeleteClick}>删除</Button>);
        toolbarwidth += 65;
      } else if (tmp[i] == 'save') {
        toolbarbuttons.push(<Button type="text" key='_cmdsave' icon={<SaveOutlined />} style={buttonStyle} onClick={this.handleSaveClick.bind(this)}>保存</Button>);
        toolbarwidth += 65;
      } else if (tmp[i] == 'export') {
        toolbarbuttons.push(<Button type="text" key='_cmdexport' icon={<FileExcelOutlined />} style={buttonStyle} onClick={this.handleExportClick}>导出</Button>);
        toolbarwidth += 65;
      } else if (tmp[i] == 'refresh') {
        toolbarbuttons.push(<Button type="text" key='_cmdrefresh' icon={<RedoOutlined />} style={buttonStyle} onClick={this.handleRefreshClick}>刷新</Button>);
        toolbarwidth += 65;
      } else if (tmp[i] == 'filter') {
        toolbarbuttons.push(<AntdInputBox type='search' key='filtertext' id='filtertext' label='快速过滤' labelwidth='72' top='2' left={toolbarwidth} width='350' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />);
        toolbarwidth += 350;
      }
    }
    if (contextmenu == undefined) contextmenu = '';
    let menuitems = [];
    tmp = contextmenu.split(';');
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i] == '-') {
        menuitems.push({ type: 'divider', key: '_menu' + i });
      } else if (tmp[i] == 'add') {
        menuitems.push({ label: '新增', key: '_menu_add', icon: <PlusCircleOutlined /> });
      } else if (tmp[i] == 'edit') {
        menuitems.push({ label: '修改', key: '_menu_edit', icon: <EditOutlined /> });
      } else if (tmp[i] == 'delete') {
        menuitems.push({ label: '删除', key: '_menu_delete', icon: <DeleteOutlined /> });
      } else if (tmp[i] == 'refresh') {
        menuitems.push({ label: '刷新', key: '_menu_refresh', icon: <RedoOutlined /> });
      } else if (tmp[i] == 'save') {
        menuitems.push({ label: '保存', key: '_menu_save', icon: <SaveOutlined /> });
      }
    }
    //判断modal
    if (modal === undefined || modal === '' || (typeof modal === 'string' && modal !== 'true')) modal = false;
    else if (modal === 'true') modal = true;

    if (showQuickJumper === undefined) showQuickJumper = true;
    if (showSizeChanger === undefined) showSizeChanger = true;
    attr = { ...attr, columns, filter, rowselect, rowbuttons, menuitems, contextmenu, keyfield, keytitle, rownumber, pagesize, rowselection, height, width, showQuickJumper, showSizeChanger }
    this.state = {
      attr: attr,
      columns: columns,
      data: [],  //某一页数据
      total: 0,  //行总数
      pageno: 1, //当前选中页
      pagesize: pagesize,  //每页显示行数
      rownumberwidth: 50,
      rowindex: 0,   //当前页光标位置
      keyfield: keyfield,   //主键        
      keytitle: keytitle,
      sortfield: '',   //排序列，只有一列
      rowselection: rowselection,
      row: {},  //当前选中的行
      lastrow: {},  //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
      selectedkeys: [],  //antd中选中打钩的行
      addoredit: 'update',
      form: attr.form,
      window: attr.window,
      menuitems: menuitems,
      toolbarwidth: toolbarwidth,
      toolbarbuttons: toolbarbuttons,
    }
  }

  componentDidMount = async () => {
    this.loadTableData();
  }

  loadTableData = async () => { //加载每页数据
    let { pageno, pagesize, selectedkeys, rowindex, attr } = this.state;
    //将父组件的第一层属性传到p
    let p = {};
    for (let key in attr) {
      if (typeof attr[key] !== 'object') p[key] = attr[key];
    }
    p.sqlprocedure = attr.sqlprocedure;
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue = '';
    p.filter = this.filtertext?.state.value.trim() || '';
    p.sortfield = this.state.sortfield;
    const rs = await reqdoSQL(p)
    console.log(991, p, rs.rows);
    //计算total  可以没有记录total值
    let total = 0;
    if (rs.rows && rs.rows.length > 0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex < 0 || rowindex >= rs.rows.length) rowindex = 0;
    if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.keyfield]];
    else selectedkeys = [];
    //console.log(991,JSON.stringify(rs));
    this.setState({ data: rs.rows, pageno: pageno, pagesize, total, rowindex, selectedkeys: selectedkeys }, () => {
      setTimeout(() => {
        //console.log(999);
      })
    });
  }

  handleSearchFilter = async () => {
    this.setState({ pageno: 1, rowindex: 0 }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handlePageChange = (pageno, pagesize) => { //换页事件
    this.setState({ pagesize, pageno }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  showTotal = (total, range) => {
    let { pageno, pagesize } = this.state;
    let start = (pageno - 1) * pagesize + 1;
    let limit = Math.min(start + pagesize - 1, total);
    let pagecount = parseInt((total - 1) / pagesize) + 1;
    let str = `当前第${start}~${limit}行，共${total}行(共${pagecount}页)。`;
    return str;
  }

  handleContextMenu = (row, index, e) => {
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.handleSelectRow(row, index);
    //if (this.state.menuitems?.length==0) return;
    let id = document.getElementById('myTable');
    id.oncontextmenu = function (e) {
      e.preventDefault();
    }
  }

  handleSizeChange = (current, pagesize) => {
    this.setState({ pagesize }, () => {
      setTimeout(() => {
        this.loadTableData();
      })
    });
  }

  handleSorter = (v1, v2, sorter) => {
    console.log(111, sorter)
    let f = sorter.field;
    let d = sorter.order;
  }

  handleSelectRow = (row, index) => {
    console.log(1211, row);
    if (!row) return;
    let { onSelectRow } = this.state.attr;
    this.setState({ row: row, rowindex: index, selectedkeys: [row[this.state.keyfield]] }, () => {
      onSelectRow?.(row, index);
    });
  }

  selectionChange = (selectedkeys, rows) => {
    //console.log(112, rows);
    let { rowselection, keyfield, data, pagesize } = this.state;
    //checkbox选中的项,单选功能的实现
    let row = null;
    let index = -1;
    if (rows.length > 0) {
      row = rows[rows.length - 1];
      index = rows.length - 1;
    }
    if (rowselection === 'multiple') {
      this.setState({ selectedkeys: selectedkeys });
    } else if (rows.length > 0) {
      this.setState({ selectedkeys: [row[keyfield]] }, () => this.handleSelectRow(row, rows.length - 1));
    }
  }

  handleMyMenu1Click = (e) => {
    //右键菜单程序
    let key = e.key;
    if (key == '_menu_delete') this.handleDeleteClick();
    else if (key == '_menu_add') this.handleAddClick();
    else if (key == '_menu_edit') this.handleEditClick(this.state.row);
    else if (key == '_menu_refresh') this.handleRefreshClick(e);
  }

  handleAddClick = () => {  //aaaaaaaa
    let { onAddRow, form, window } = this.state.attr;
    onAddRow?.(); //清空表单+打开窗体
  }

  handleEditClick = (row) => { //eeeeeeee    
    let { onEditRow, form, window } = this.state.attr;
    this.setState({ row }, () => { //自动触发1次，先清空data
      onEditRow?.(row);  //修改表单内容+打开窗体
    });
  }

  handleDeleteClick = async (e) => {
    let { row, keyfield, keytitle, selectedkeys, rowselection } = this.state;
    let title = '';
    console.log(selectedkeys, 999)
    if (rowselection == 'multiple') {
      if (selectedkeys.length > 1) title = '是否确定删除这' + selectedkeys.length + '条' + keytitle + '记录？';
      else if (selectedkeys.length > 0) title = '是否确定删除【' + selectedkeys[0] + '】这条' + keytitle + '记录？';
    } else {
      if (row) title = '是否确定删除【' + row[keyfield] + '】这条' + keytitle + '记录？';
    }
    if (title != '') this.myDeleteModal.setState({ visible: true, description: title });
    else myNotice('没有选择需要删除的' + keytitle + '!', 'info', 200);
    //确定后执行handleDeleteRow函数
  }

  handleDeleteRow = async (row, index) => {  //ddddddddddddddelete
    //console.log(999,row, index);
    let { onDeleteRow, rowselection } = this.state.attr;
    let rs = await onDeleteRow?.(row, index) || null;
    this.myDeleteModal.setState({ visible: false });
    if (rs.pageno <= 0) return;
    let { rowindex, pageno } = rs;
    console.log(119, rs);
    this.setState({ pageno, rowindex }, () => { //自动触发1次，先清空data
      this.loadTableData();
    });
  }

  handleRefreshClick = (e) => {
    let { onRefresh } = this.state.attr;
    let rs = onRefresh?.(e) || null;
    if (!rs) return;
    this.setState({ rowindex: 0, pageno: 1 }, () => {
      this.loadTableData();
    });
  }

  handleExportClick = (e) => {
    let { onExport } = this.state.attr;

    //
  }
  handleSaveClick = (e) => {
    let { onSave } = this.state.attr;
    onSave?.();
  }

  render() {
    let { data, pagesize, total, addoredit, pageno, columns, keyfield, keytitle, menuitems, rowselection, toolbarbuttons, toolbarwidth, filter } = this.state;
    let { onAddRow, onRefresh, onExport, onDoubleClick, modal, height, width, showQuickJumper, showSizeChanger, rowheight } = this.state.attr;
    //let scrolly = (modal && height>0)? { x: '90%', y: 'calc(100vh - '+(652-height)+'px)' }: { x: '90%', y: 'calc(100vh - 148px)'}
    let scrolly = (modal && height > 0) ? { x: '90%', y: (height - 107 + (toolbarbuttons.length > 0 ? 0 : 35)) + 'px' } : { x: '90%', y: 'calc(100vh - 148px)' }
    console.log(992, scrolly);
    //let showQuickJumper = true;
    //let showSizeChanger = true;
    if (width<700) showSizeChanger = false;
    if (width<640) showQuickJumper = false;
    return (<>
      <Layout style={{ overflow: 'hidden' }}>
        {toolbarbuttons.length > 0 && <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '35px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='filterbar'>
            {toolbarbuttons}
          </Form>
        </Header>}
        <Dropdown menu={{ items: menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={[menuitems.length > 0 ? 'contextMenu' : '']}>
          <Content style={{ overflow: 'auto', position: 'relative', width: '100%' }}>
            <Table id='myTable' ref={ref => this.AntdTable = ref} className="myTableStyle" sticky={true} size='small' rowKey={keyfield} bordered={true}
              scroll={scrolly}  //页面中的表格
              style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
              //rowClassName={rowStyle}
              columns={columns} dataSource={this.state.data} pagination={false}
              onChange={this.handleSorter}
              rowSelection={{
                hideSelectAll: rowselection === 'checkbox',
                //disabled: rowselection === 'checkbox', 
                type: rowselection === 'radio' ? 'radio' : 'checkbox',
                selectedRowKeys: this.state.selectedkeys,
                onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) },
                // getCheckboxProps: (record) => {
                //   console.log(555, record);
                //   return ({
                //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
                //     name: record.name,
                //   })
                // },
              }}
              onRow={(record, index) => {
                return {
                  onClick: (e) => { this.handleSelectRow(record, index) }, // 点击行
                  onDoubleClick: (e) => { this.handleSelectRow(record, index); console.log(onDoubleClick); onDoubleClick?.(record, index); },  //点击checkbox小按钮时需要选中行
                  onContextMenu: (e) => { this.handleContextMenu(record, index, e) }
                };
              }}
            />
          </Content>
        </Dropdown>
        <Footer style={{ padding: '5px 16px 0px 16px', height: 36, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
          <Pagination size="small" total={this.state.total} className='paginationStyle' style={{ textAlign: 'center' }}
            showQuickJumper={showQuickJumper} showSizeChanger={showSizeChanger} 
            pageSizeOptions={['10', '20', '50', '100']} 
            current={this.state.pageno} defaultPageSize={this.state.pagesize}
            pageSize={this.state.pagesize}
            showTotal={(total, range) => this.showTotal(total, range)}
            onShowSizeChange={this.handleSizeChange.bind(this)}
            onChange={this.handlePageChange.bind(this)}
          />
        </Footer>
      </Layout>
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={(e) => this.handleDeleteRow(this.state.row, this.state.rowindex)} />
    </>)
  }
}
