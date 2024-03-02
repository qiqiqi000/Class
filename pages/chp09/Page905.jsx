import React, { Component } from 'react'
import { Tooltip, FloatButton, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import { myDoFiles, myLocalTime, reqdoSQL, reqdoTree, myNotice } from '../../api/functions'
import { MyFormComponent } from '../../api/antdFormClass.js';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdHiddenField, AntdImage, ConfirmModal, AntdModal } from '../../api/antdClass.js';
import { AntdTable } from '../../api/antdTable.js';
import { RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
const components = {
  body: {
    row: props => <tr className="tableRowStyle" {...props} />,
  },
};
//myTableStyle在style.css中
//https://ant.design/components/overview-cn/
//https://blog.csdn.net/weixin_45991188/article/details/108050424 
const sys = { ...React.sys };
const rowheight = 42;

export default class Page905 extends MyFormComponent {
  constructor(props) {
    super(props);
    this.state = {
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
        { dataIndex: 'categoryname', title: '类别名称', width: '150px', ellipsis: true, render: (text, record, index) => { return <b><i>{record.categoryname}</i></b> }
        }],
      rowindex: 0,   //当前页光标位置
      row: {},  //当前选中的行
      lastrow: {},  //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
      addoredit: 'update',      
    }
  }

  componentDidMount = async () => {
    //this.loadTableData();
  }

  handleSelectRow = (row, index) => {
    if (!row) return;
    let lastrow = this.setFormValues('myForm1', row);  //赋值到表单后同时返回旧值对象，数据格式有变化，如date，不能写last=row
    this.setState({ addoredit: 'query', row: row, lastrow });
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
      this[this.myTable1.state.keyfield].setState({readOnly:false});
    });
  }

  handleEditRow = () => { //eeeeeeee
    this.setState({ myWin1: true, addoredit: 'update' }, () => {
      setTimeout(() => {
        //this.setFormValues('myForm1', row);
        this.setFormFields('myForm1', 'readOnly', false);
        this[this.myTable1.state.keyfield].setState({readOnly:true});
      })
    });
  }

  handleDeleteRow = async () => {  //ddddddddddddddelete
    //调用函数实现删除
    return (await this.deleteTableRow(this.myTable1, 'myForm1', 'demo901a'));
  }

  handleSaveRow = async () => {
    let rs = await this.saveTableRow(this.myTable1, 'myForm1', 'demo901a');
    //console.log(888, rs);    
    if (rs && rs.error == '') {
      let {pageno, rowindex} = rs;
      this.myTable1.setState({pageno, rowindex});  //修改组件的两个值用于刷新页面和定位新增的记录
      this.setState({ addoredit: 'update', myWin1: false }, () => {
        this.myTable1.loadTableData();
      });
    }
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
    this.myForm1.setFieldValue('supplierid', row.supplierid);
  }

  onFinish = (json) => { //提交时触发
    console.log(661, json);
  }

  render() {
    let {columns, readOnly, addoredit} = this.state;
    console.log(90,addoredit==='query',addoredit)
    return (<>
      <AntdTable {...this.state.attr} ref={ref => this.myTable1 = ref} columns={columns}
        rowbuttons='right' toolbar='-;add;edit;-;delete;-;export;refresh;-;filter' rowselection='multiple'
        contextmenu='add;edit;-;delete' rownumber modal={false}
        keyfield='productid' keytitle='商品' sqlprocedure='demo503a' updateprocedure="demo901a"
        onSelectRow={(row, index) => this.handleSelectRow(row, index)}
        onAddRow={(row, index) => this.handleAddRow()}
        onEditRow={(row, index) => this.handleEditRow(row)}
        onDeleteRow={(row, index) => this.handleDeleteRow()}
        onSaveRow={(row, index) => this.handleSaveRow()}
        onDoubleClick={(row, index) => this.handleDoubleClick(row, index)}
      />

      <Modal name='myWin1' title='商品详细信息' open={this.state.myWin1} width={480} forceRender centered maskClosable={false}
        cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }}
        styles={{ position: 'relative', padding: 0, body: { overflowY: 'scroll', height: '500px', width: '450px', padding: 0, margin: 0 } }}
        closable keyboard={false}
        footer={[<Button key='btnok' type='primary' disabled={addoredit==='query'} htmltype='submit' onClick={this.handleSaveRow}>保存</Button>, <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
        <div style={{ position: 'relative' }}>  {/* 添加一个层，否则文本框需要大于30px才能输入 */}
          <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" onFinish={this.onFinish} initialValues={this.state.row}
            style={{ padding: 0, margin: 0, position: 'absolute', height: '100%', width: '430px' }} >
            <AntdInputBox type='text' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={8 + rowheight * 0} ref={ref => this.productid = ref} />
            <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 1} ref={ref => this.productname = ref} />
            <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={8 + rowheight * 2} ref={ref => this.englishname = ref} />
            <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='300' top={8 + rowheight * 3} ref={ref => this.quantityperunit = ref} />
            <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={8 + rowheight * 4} ref={ref => this.unit = ref} />
            <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='216' width='85' top={8 + rowheight * 4} min={0.01} precision={2} controls={false} ref={ref => this.unitprice = ref} />
            <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={8 + rowheight * 5} ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} />
            <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='2' width='300' readOnly top={8 + rowheight * 6} ref={ref => this.categorynmame = ref} />
            <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={8 + rowheight * 7} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid' ref={ref => this.supplierid = ref} />
            <AntdInputBox type='date' id='releasedate' label='发布日期' labelwidth='82' left='2' width='140' top={8 + rowheight * 8} ref={ref => this.releasedate = ref} />
            <AntdImageUpload id='photopath' label='图片预览' labelwidth='82' left='2' width='400' datatype='json' top={8 + rowheight * 9} uploadonsave
              ref={ref => this.photopath = ref} targetpath='mybase/resources' xfiletag='`p_${sys.productid}`' filetag='sys.productid' timeStamp={false}
              fieldNames={{ url: 'filename' }} maxCount='5' />
            <AntdHiddenField id='supplieridx' />
            <AntdHiddenField id='categoryid' />
          </Form>
        </div>
      </Modal>
    </>)
  }
}
