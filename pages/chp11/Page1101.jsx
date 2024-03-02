//0.导入路由组件
//import { Tooltip, FloatButton, Tree, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import React, { Component } from 'react'
import { scrollTreeNode, myNotice, myDoFiles, myLocalTime, reqdoSQL, reqdoTree, findTreeNode } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { DownOutlined, PaperClipOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Tabs, Tooltip, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import { AntdTree, AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdImageUpload, AntdHiddenField, ConfirmModal } from '../../api/antdClass.js';
import { AntdTable } from '../../api/antdTable.js';

//import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdImage } from '../../api/antdClass.js';
import { Resizable } from 'react-resizable';
const { Header, Content, Footer, Sider } = Layout;
const sys = { ...React.sys };
const rowheight = 42;
const layoutStyle = {
  height: '100%',
  width: '100%',
  position: 'relative',
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
      pageno: 1, //当前选中页
      pagesize: 20,  //每页显示行数
      rowindex: 0,   //当前页光标位置
      keyfield: 'productid',   //主键
      lastrow: {}, //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
      treefield: 'subcategoryid',  //表格中树节点列
      columns: [
        { dataIndex: 'productid', title: '商品编码', width: '80px', align: 'center', fixed: 'left' },
        { dataIndex: 'productname', title: '商品名称', width: '250px', fixed: 'left', ellipsis: true },
        { dataIndex: 'englishname', title: '英文名称', width: '250px', align: 'center', ellipsis: true },
        { dataIndex: 'quantityperunit', title: '规格型号', width: '180px' },
        { dataIndex: 'unit', title: '计量单位', width: '80px', align: 'center' },
        { dataIndex: 'unitprice', title: '单价', width: '80px', align: 'right', sorter: (a, b) => a.unitprice - b.unitprice },
        { dataIndex: 'supplierid', title: '供应商编号', width: '90px' },
        { dataIndex: 'suppliername', title: '供应商名称', width: '250px', ellipsis: true },
        { dataIndex: 'categoryid', title: '类别编号', width: '80px', align: 'center' },
        { dataIndex: 'categoryname', title: '类别名称', width: '150px', ellipsis: true }
      ],
    },
    myTree1: {
      keyfield: 'categoryid',
      treewidth: 280,
      node: {},  //当前myTree1树中选中的结点
    },
    resizing: false,
    supplierdata: [],
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
    myWin1: false,    //子窗体modal初始时为关闭状态
    activetabkey: 'myTab1',
  }

  componentDidMount = async () => {
    //this.myTable1.setState({});
    let node = {};
    node.key = '_root';
    this.handleSelectNode(node);
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

  handleSelectNode = async (node) => { //选中树节点事件
    //console.log(188,this.myTree1.state.node)
    this.myTable1.setState({ pageno: 1, rowindex: 0, attr: { ...this.myTable1.state.attr, categoryid: node.key } },
      () => this.myTable1.loadTableData()
    );
  }

  handleSelectRow = (row, index) => {
    console.log('select beigin');
    if (!row) return;
    let lastrow = this.setFormValues('myForm1', row);  //赋值到表单后同时返回旧值对象，数据格式有变化，如date，不能写last=row
    this.setState({ row: row, lastrow });
    console.log('select end');
  }

  handleDoubleClick = (row, index) => {
    this.setState({ myWin1: true, addoredit: 'query' }, () => {
      setTimeout(() => {
        this.setFormFields('myForm1', 'readOnly', true);
      })
    });
  }

  handleAddRow = () => {  //aaaaaaaa
    this.setState({ myWin1: true, addoredit: 'add' }, () => {
      this.resetFormValues('myForm1');
      this[this.myTable1.state.keyfield].setState({ readOnly: false });
    });
  }

  handleEditRow = () => { //eeeeeeee 
    console.log('edit beigin');   
    this.setState({ myWin1: true, addoredit: 'update' }, () => {
      setTimeout(() => {
        //this.setFormValues('myForm1', row);
        this.setFormFields('myForm1', 'readOnly', false);
        this[this.myTable1.state.keyfield].setState({ readOnly: true });
      })
    });
    console.log('edit end');
  }

  handleDeleteRow = async () => {  //ddddddddddddddelete
    //调用函数实现删除
    return (await this.deleteTableRow(this.myTable1, 'myForm1', 'demo901a'));
  }

  handleSaveRow = async () => {  //ssssssssssssss
    //将表单数据保存到数据库
    let rs = await this.saveTableRow(this.myTable1, 'myForm1', 'demo1101c');
    let { node, loadall, root } = this.myTree1.state;
    let data = [...this.myTree1.state.data];
    let { pagesize, pageno, rowindex } = this.myTable1.state;
    let keys = [];
    if (rs && rs.error == '' && rs.rows.length > 0) {
      //存储过程中需要返回商品的类别、祖先节点和在同类中的序号rowno
      let row = rs.rows[0];
      let key = row[this.state.myTable1.treefield];  //商品表中与myTree1的树节点key值对应的subcategoryid列的值
      //计算商品在同类中的行号与页码
      let rowno = row.rowno;
      pageno = Math.floor((rowno - 1) / pagesize) + 1;
      rowindex = rowno - (pageno - 1) * pagesize - 1;
      //逐级展开树节点
      let expandedKeys = [...this.myTree1.AntdTree.state.expandedKeys];  //如果原来展开的结点依然保持展开状态
      console.log(88, expandedKeys)
      keys = row.ancestor.split('#');
      if (!loadall) {  //逐级展开的情况
        for (let i = 0; i < keys.length - 1; i++) {
          let node = findTreeNode(data, keys[i]);
          data = await this.myTree1.loadTreeData(data, node)
        } //for
      }
      node = findTreeNode(this.myTree1.state.data, key);
      if (!node) return;
      if (root != '' && root != undefined) keys.push('_root');
      //如果原来展开的结点依然保持展开状态
      keys = keys.concat(expandedKeys);
      this.myTree1.setState({ data: data }, () => {
        this.myTree1.AntdTree.setExpandedKeys(keys);
        this.myTree1.AntdTree.setState({selectedKeys:[key]}, () => scrollTreeNode())  //选中和移动结点
      });
      //加载表格数据
      this.myTable1.setState({pageno, rowindex, attr:{ ...this.myTable1.state.attr, categoryid: node.key}},
        () => this.myTable1.loadTableData()
      );
    }
    this.setState({ addoredit: 'update', myWin1: false });
  }

  handleProductChange = (e) => {
    console.log(111111, e, this.productid.state.value)
  }

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
    //this.myForm1.setFieldValue('supplierid', row.supplierid);
  }

  render() {
    let { columns } = this.state.myTable1;
    //console.log(99, columns);
    return (<>
      <Layout style={layoutStyle} >
        <Resizable width={this.state.myTree1.treewidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div style={resizeHandle} />} resizeHandles={['e']}>
          <Sider theme='light' width={this.state.myTree1.treewidth} style={{ height: '100%', position: 'relative', marginLeft: 0,  marginRight:3, padding: 0, borderRight: '1px solid #95B8E7' }}>
            <AntdTree ref={ref => this.myTree1 = ref} style={{ overflow: 'hidden' }}
              icon={<PaperClipOutlined />} blockNode={false}
              //switcherIcon={<DownOutlined /> }
              onSelectNode={(key, e) => this.handleSelectNode(e.node)}  /*自定义属性*/
              sqlprocedure="demo804a" filterprocedure="demo804e" loadall="xtrue"
              //sqlprocedure="demo803a" filterprocedure="demo804e" loadall="true"
              root="全部类别" filter='truex' />
          </Sider>
        </Resizable>
        <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 0, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
          <AntdTable {...this.state.attr} ref={ref => this.myTable1 = ref} columns={columns} pagesize="10"
            rowbuttons='right' toolbar='-;add;edit;-;delete;-;export;refresh;-;filter' rowselection='multiple'
            contextmenu='add;edit;delete;-;save;refresh' rownumber
            keyfield='productid' keytitle='商品' sqlprocedure='demo1101b' updateprocedure="demo901a"
            onSelectRow={(row, index) => this.handleSelectRow(row, index)}
            onAddRow={(row, index) => this.handleAddRow()}
            onEditRow={(row, index) => this.handleEditRow(row)}
            onDeleteRow={(row, index) => this.handleDeleteRow()}
            onSaveRow={(row, index) => this.handleSaveRow()}
            onDoubleClick={(row, index) => this.handleDoubleClick(row, index)}
          />
        </Content>
      </Layout>
      <Modal name='myWin1' title='商品详细信息' open={this.state.myWin1} width={465} forceRender centered maskClosable={false}
        cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }}
        styles={{ position: 'relative', padding: 0, body: { overflowY: 'scroll', height: '450px', width: '430px', padding: 0, margin: 0 } }}
        closable keyboard={false}
        footer={[<Button key='btnok' type='primary' htmltype='submit' disabled={this.state.addoredit === 'query'} onClick={this.handleSaveRow}>保存</Button>, <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
        <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'hidden' }} >
          <Tabs id="myTab" activeKey={this.state.activetabkey} size="small" tabBarGutter={24}
            style={{ margin: 0, marginLeft: 0, padding: 0, paddingRight: 20, height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}
            //onChange={this.handleTabChange.bind(this)}
            onChange={(activetabkey) => this.setState({ activetabkey: activetabkey })}
            items={[
              {
                label: '基本信息', key: 'myTab1', forceRender: true, children:
                  <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    <AntdInputBox type='text' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={8 + rowheight * 0} ref={ref => this.productid = ref} />
                    <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 1} ref={ref => this.productname = ref} />
                    <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 2} ref={ref => this.englishname = ref} />
                    <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='300' top={8 + rowheight * 3} ref={ref => this.quantityperunit = ref} />
                    <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={8 + rowheight * 4} ref={ref => this.unit = ref} />
                    <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='216' width='85' top={8 + rowheight * 4} min={0.01} precision={2} controls={false} ref={ref => this.unitprice = ref} />
                    <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={8 + rowheight * 5} ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} />
                    <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='2' width='300' readOnly top={8 + rowheight * 6} ref={ref => this.categoryname = ref} />
                    <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={8 + rowheight * 7} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid' ref={ref => this.supplierid = ref} />
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
