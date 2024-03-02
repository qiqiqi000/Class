import { Tooltip, Dropdown, Popconfirm, Button, Pagination, Form, Table, Layout, } from 'antd'
import React from 'react'
import { reqdoSQL,myNotice } from '../../api/functions'
import { MyFormComponent } from '../../api/antdFormClass'
import { ConfirmModal,AntDateBox } from '../../api/antdComponents.js'
import {AntdInputBox, AntdComboBox,AntdCascader } from '../../api/antdClass.js'
import { RedoOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
//import '../../css/editable.css'
const { Header, Content, Footer, Sider } = Layout;

const sys = { ...React.sys };
const rowheight = 42;
export default class Page908 extends MyFormComponent {

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
      selectedkeys: [],  //antd中选中打钩的行
      reloadflag: 1
    },
    supplierdata: [],
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据

    editingKey: '',//当前编辑的行
    preSaveData: [], //预保存数据

  }

  componentDidMount = async () => {
    this.loadTableData();
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
    //console.log(991,JSON.stringify(rs));
    let table = { ...this.state.myTable1 }
    this.setState({ myTable1: { ...table, data: rs.rows, pageno: pageno, pagesize, total, rowindex, selectedkeys: selectedkeys } });
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

  /**
   * @修改
   * @当有记录正在编辑时关闭单击事件
   * */
  handleSelectRow = (row, index) => {
    if (!row) return;
    let table = { ...this.state.myTable1 }
    let record = this.setFormValues('myForm1', row);
    this.setState({ addoredit: 'update', record: record, myTable1: { ...table, row: row, rowindex: index, selectedkeys: [row[this.state.myTable1.keyfield]] } });
  }

  handleMyMenu1Click = (e) => {
    //右键菜单程序
    let key = e.key;
    if (key == 'menu-delete') this.handleDeleteClick();
    else if (key == 'menu-add') this.handleAddClick();
    else if (key == 'menu-edit') this.handleEditRow(this.state.myTable1.row);
    else if (key == 'menu-refresh') this.handleRefreshRow(e);
  }

  /**
   * @修改点击编辑后触发的事件
   * @bug 由于初始状态下没有可编辑行，也就意味着没有表单出现，所以getFormFields取不到列。
   * @解决方法 更新state后，回调触发点击事件，强制触发一次
   */
  handleEditRow = (row, index, e,dataIndex) => { //eeeeeeee 修改记录
    console.log('编辑', row,e,dataIndex);
    //如果当前的行正在编辑，则不再执行该行，否则会重新加载数据
    if (this.state.editingKey === row.key) return;
    this.setState({ addoredit: 'update', editingKey: row.key }, () => {
      this.handleSelectRow(row, index);
     this[dataIndex]?.myInput?.focus(); //聚焦到当前单元格
  });
  }
  /**
   * @新增功能暂时注释
   */
  handleAddClick = () => {  //aaaaaaaa
    // this.setState({ myWin1: true, addoredit: 'add' }, () => {
    //   this.resetFormValues('myForm1');
    //   this[this.state.myTable1.keyfield].setState({ editable: true });
    // });
  }

  handleDeleteClick = async (e) => {
    let { row, keyfield } = this.state.myTable1;
    this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + row[keyfield] + '】这个商品？' });
    return;
  }


  handleDeleteRow = async (row, index) => {  //ddddddddddddddelete
    console.log(4444, row, index);
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

  /**
   * @预保存数据
   * @数据保存在state中的preSaveData
   * @将myTable1的data更改方便显示
   * 
   * */
  handlePreSave = async () => {
    //提取编辑完的数据
    let data = this.getFormValues('myForm1');

    // 处理 preSaveData
    const preSaveData = [...this.state.preSaveData];
    const preSaveIndex = preSaveData.findIndex(item => item.productid === data.productid);
    if (preSaveIndex >= 0) {
      preSaveData[preSaveIndex] = { ...preSaveData[preSaveIndex], ...data };
    } else {
      preSaveData.push(data);
    }

    // 处理 myTable1.data
    const table = { ...this.state.myTable1 };
    const tableData = [...table.data];
    const tableIndex = tableData.findIndex(item => item.productid === data.productid);
    if (tableIndex >= 0) {
      tableData[tableIndex] = { ...tableData[tableIndex], ...data };
    }

    this.setState({ preSaveData, myTable1: { ...table, data: tableData }, editingKey: '' }, () => {
      console.log('预保存完的数据', this.state.preSaveData);
    });
  };


  handleSaveClick = async () => {  //sssssssssssave
    //保存数据
    let table = { ...this.state.myTable1 }
    let { pageno, pagesize, total, rowindex, row, keyfield } = table;
    let { record, addoredit } = this.state;
    let data = this.getFormValues('myForm1');  //转换数据内容

    //if (data._action=='add') data[this.state.myTable1.keyfield]=0;  //主键值自动生成
    console.log(664, data);
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
    console.log('保存保存保存', p.data);
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


  /**
   * @提交数据按钮事件
   * @将预保存的数据执行后续操作
   **/
  handleAllSaveClick = async () => {
    //拿到预保存的数据
    let data = this.state.preSaveData
    console.log(11, '保存的数据为', data);
  }



  showTotal = (total, range) => {
    let { pageno, pagesize } = this.state.myTable1;
    let start = (pageno - 1) * pagesize + 1;
    let limit = Math.min(start + pagesize - 1, total);
    let pagecount = parseInt((total - 1) / pagesize) + 1;
    let str = `当前第${start}~${limit}行，共${total}行（共${pagecount}页）。`;
    return str;
  }

  /**
   * @如果有编辑行禁用右键菜单的选中功能
  **/
  handleContextMenu = (row, index, e) => {
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.state.editingKey === '' && this.handleSelectRow(row, index);

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


  handleRefresh = () => {
  }


  /**
   * @类别下拉框
   * @当选中类别编码时将类别的名称赋值给类别名称
   * */
  handleCategoryChange = (value, row) => {
    // console.log(666,value[0],row[0])
    console.log(777, value, row)
    // value[0]类别名称
    // row[0]父类数据
    if (value?.length > 0) {
      // this.myForm1.setFieldValue('categoryid', value[0]);
      this.myForm1.setFieldValue('categoryname', row[0].categoryname);
      // this.myForm1.setFieldValue('categoryname', value[0]);
      this.myForm1.setFieldValue('categoryid', row[0].categoryid);



    }
  }

  /**
   * @供应商下拉框
   * @当选中供应商编码时将供应商的名称赋值给供应商名称
   **/
  handleSupplierChange = (value, row) => {
    // console.log(444444,value,row)
    // this.myForm1.setFieldValue('supplierid', row.supplierid);
    this.myForm1.setFieldValue('suppliername', row.suppliername);//将供应商的名称赋值
  }

  onFinish = (json) => { //提交时触发
    console.log(661, json);
  }

  /**
   *@判断当前行是否是编辑状态
   */
  isEditing = (record) => record.key === this.state.editingKey;

  /**
   * @渲染可编辑单元格
   * @text 当前单元格的值
   * @record 当前行的数据
   * @dataIndex 当前单元格的字段名
   * @width 当前单元格的宽度
   * */
  renderEditableCell = (text, record, dataIndex, width) => {
    // console.log(record);
    // 当前选中的行是否是编辑状态
    if (!this.isEditing(record)) {
      return <div  className="editable-cell-value-wrap" onClick={() => this.handleEditRow(record,'','',dataIndex)} >{text}</div>;
    }

    // 公共属性
    const commonProps = {
      id: dataIndex,
      //表格中的输入框样式调整
      width: width - 10,
      top: 1,//5
      left: 5,//5
      height: rowheight - 10,
      className: 'editable-cell'
    };
    // 根据 dataIndex 来选择不同的组件
    switch (dataIndex) {
      case 'unitprice':
        return <AntdInputBox {...commonProps} type='number' min={0.01} precision={2} />;
      case 'releasedate':
      //  return <AntdInputBox  {...commonProps} type= 'date'  />;
      // return <AntDateBox {...commonProps}   />;
        return <AntdInputBox  {...commonProps} type= 'text'  />;
      case 'supplierid':
        return  <AntdComboBox  {...commonProps}  valuefield='supplierid' labelfield='supplierid' sqlprocedure='demo502d' onChange={this.handleSupplierChange} />
      case 'subcategoryid':
        // return <AntCascader {...commonProps}   textfield='categoryname' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange} />;
        return <AntdCascader page={this} form='myForm1' ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' 
        onChange={this.handleCategoryChange} />
      default:
       return <AntdInputBox {...commonProps}  type='text' ref={ref => this[dataIndex] = ref} disabled={['productid','categoryid','suppliername','categoryname'].includes(dataIndex)}   />
    }
  };




  /**
   * @当文本框处于编辑状态时的键盘事件
   * */
  handleKeyDown = (e, record, index) => {
    // console.log(e);

    /**
     * @按键保存后的回调函数
     * @param {Function} callback 
     */
    const saveAndThen = (callback) => {
      this.handlePreSave();// 每次按键都会触发保存
      this.setState({ editingKey: '' }, callback);
    };

    switch (e.key) {
      case 'Enter': // 回车键保存
        saveAndThen();
        break;

      case 'ArrowDown': // 下一行
        saveAndThen(() => {
          const nextIndex = index + 1 < this.state.myTable1.data.length ? index + 1 : 0;
          this.handleEditRow(this.state.myTable1.data[nextIndex], nextIndex);
        });
        break;

      case 'ArrowUp': // 上一行
        if (index > 0) {
          saveAndThen(() => {
            this.handleEditRow(this.state.myTable1.data[index - 1], index - 1);
          });
        }
        break;

      default:
        // 其他键不做处理
        break;
    }
  };



  render() {
    const { data, pagesize, total, addoredit, pageno } = this.state;
    const items1 = [{
      label: '新增',
      key: 'menu-add',
      icon: <PlusCircleOutlined />
    }, {
      label: '修改',
      key: 'menu-edit',
      icon: <EditOutlined />
    }, {
      type: 'divider',
      key: 'menu13',
    }, {
      label: '删除',
      key: 'menu-delete',
      icon: <DeleteOutlined />
    }, {
      label: '刷新',
      key: 'menu-refresh',
      icon: <RedoOutlined />
    }];

    //字段定义
    let columns = [
      {
        title: '序号', dataIndex: 'xrowno', width: '50px', fixed: 'left', className: 'rownumberStyle',
        render: (text, record, index) => (this.state.myTable1.pageno - 1) * this.state.myTable1.pagesize + index + 1
      },
      {
        dataIndex: 'productid', title: '商品编码', width: '80px', align: 'center', fixed: 'left',
      },
      {
        dataIndex: 'productname', title: '商品名称', width: '250px', fixed: 'left', ellipsis: true,
      },
      {
        dataIndex: 'englishname', title: '英文名称', width: '250px', align: 'center', ellipsis: true,
      },
      {
        dataIndex: 'quantityperunit', title: '规格型号', width: '180px',
      },
      {
        dataIndex: 'unit', title: '计量单位', width: '80px', align: 'center',
      },
      {
        dataIndex: 'unitprice', title: '单价', width: '80px', align: 'right', sorter: (a, b) => a.unitprice - b.unitprice,
      },
      {
        dataIndex: 'releasedate', title: '上架时间', width: '140px', ellipsis: true,
      },
      {
        dataIndex: 'supplierid', title: '供应商编号', width: '100px',
      },
      {
        dataIndex: 'suppliername', title: '供应商名称', width: '250px', ellipsis: true,
      },
      {
        // dataIndex: 'categoryid', title: '类别编号', width: '80px', align: 'center',
        dataIndex: 'categoryid', title: '所属大类', width: '80px', align: 'center',
      },
      {
        dataIndex: 'categoryname', title: '大类名称', width: '150px', ellipsis: true,
      },
      {
        dataIndex: 'subcategoryid', title: '所属类别', width: '90px', ellipsis: true, align: 'center',
      },
      {
        title: '操作', dataIndex: '_operation', key: '_operation', fixed: 'right', width: '52px',
        //record对应的是render里的对象 ，dataindex对应的值
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return editable ? (
            //竖着排列 编辑行撑开一点较为明显
            // <span>
            //   <a onClick={this.handlePreSave} style={{ marginRight: 8 }}>保存</a>
            //   <Popconfirm title="确定取消编辑吗?" onConfirm={() => this.setState({ editingKey: '' })}>
            //     <a>取消</a>
            //   </Popconfirm>
            // </span>
            <>
              <Tooltip title={"保存记录"} placement="bottom"  >
                <Button size='small' type="text" icon={<CheckCircleOutlined style={{ fontSize: '10px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={this.handlePreSave} />
              </Tooltip>
              <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定取消编辑"${record.productname}"的这个商品？`}
                onConfirm={() => this.setState({ editingKey: '' })} placement="topLeft">
                <Tooltip title="取消编辑" placement="bottom"><Button size='small' type="text" icon={<CloseCircleOutlined style={{ fontSize: '10px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip>
              </Popconfirm>
            </>


          ) : (<>
            <Tooltip title={"修改记录"} placement="bottom"  >
              <Button size='small' type="text" icon={<EditOutlined style={{ fontSize: '10px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={(e) => this.handleEditRow(record, index,e)} />
            </Tooltip>
            <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定删除"${record.productname}"的这个商品？`}
              onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft">
              <Tooltip title="删除记录" placement="bottom"><Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '10px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip>
            </Popconfirm>
          </>
          )
        }
      }].map(item => {//遍历所有列，除去序号和操作列，其他列都可以编辑
        if (item.dataIndex != '_operation' && item.dataIndex != 'xrowno') {
          return { ...item, render: (text, record) => this.renderEditableCell(text, record, item.dataIndex, parseInt(item.width)) }
        }
        return item
      })

    return (<>
      <Layout style={{ overflow: 'hidden', position: 'relative' }} id="page">
        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='filterbar'>
            <div style={{ marginTop: 1, paddingTop: 1 }}>
              <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick}>新增</Button>
              <Button type="text" icon={<SaveOutlined />} style={{ padding: 0, width: 90, height: 30 }} onClick={this.handleAllSaveClick}>提交数据</Button>
              <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh}>刷新</Button>
            </div>
            <AntdInputBox id='filtertext' label='快速过滤' labelwidth='72' top='1' left='320' width='300' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        <Dropdown menu={{ items: items1, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
          <Content style={{ overflow: 'hidden', position: 'relative', width: '100%', overflowX: 'auto' }}>
            <Form name="myForm1" ref={ref => this.myForm1 = ref} onFinish={this.onFinish} initialValues={this.state.row} >
              <Table className="myTableStyle" sticky={true} size='small' rowKey={this.state.myTable1.keyfield} id='myTable1' ref={ref => this.myTable1 = ref} bordered={true}
                scroll={{ x: '90%', y: 'calc(100vh - 148px)' }}
                style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
                columns={columns} dataSource={this.state.myTable1.data} pagination={false}
                onChange={this.handleSorter}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: this.state.myTable1.selectedkeys,
                  onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) }
                }}
                rowClassName={() => 'editable-row'}//每行添加className
                onRow={(record, index) => {
                  return {
                    
                    onContextMenu: (e) => { this.handleContextMenu(record, index, e) },
                    // 添加一个键盘事件
                    onKeyDown: (e) => { this.handleKeyDown(e, record, index) },
                  };
                }}
              />
            </Form>
          </Content>
        </Dropdown>
        <Footer style={{ padding: '5px 16px 0px 16px', height: 36, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
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
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRow.bind(this)} />
    </>)
  }
}
