import React, { Component } from 'react'
import { Image, Tabs, Tooltip, FloatButton, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import { myDoFiles, myStr2JsonArray, myLocalTime, reqdoSQL, reqdoTree, myNotice } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdTree, AntdImageUpload, AntdHiddenField, AntdImage, ConfirmModal, AntdModal } from '../../api/antdClass.js';
import { RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
const components = {
  body: {
    row: props => <tr className="tableRowStyle" {...props} />,
  },
};
const spanStyle = {
  position: 'relative',
  //border:'1px solid #95B8E7',
  border: '1px solid #C3C3C3',
  fontSize: 13,
  display: 'inline-block',
  height: 250,
  width: 300,
  padding: '2px 2px 4px 8px',
  margin: '8px 4px 8px 8px'
}
//https://ant.design/components/overview-cn/
//https://blog.csdn.net/weixin_45991188/article/details/108050424 

const rowheight = 42;
const sys = { ...React.sys };
export default class Page904 extends MyFormComponent {
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
    },
    supplierdata: [],
    addoredit: 'update',
    record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
    tabcount: 2,
    activetabkey: 'myTab1',
    myWin1: false    //子窗体modal初始时为关闭状态
  }

  componentDidMount = async () => {
    this.loadTableData();
  }

  componentWillUnmount() {
    //clearInterval(this.timer);
  }

  loadTableData = async () => { //加载每页数据
    let { pageno, pagesize, selectedkeys, rowindex } = this.state.myTable1;
    let p = {};
    p.year = 2019;
    p.month = 8;
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue = '';
    p.filter = this.filtertext.state.value.trim();
    p.sortfield = this.state.sortfield;
    p.sqlprocedure = 'demo904a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    //计算total  可以没有记录total值
    let total = 0;
    if (rs.rows && rs.rows.length > 0 && rs.rows[0]._total) total = parseInt(rs.rows[0]._total);
    else if (rs.rows) total = rs.rows.length;
    if (rowindex < 0 || rowindex >= rs.rows.length) rowindex = 0;
    if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.myTable1.keyfield]];
    else selectedkeys = [];
    console.log(991, rs.rows, selectedkeys);
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
    this.setState({ myTable1: { ...table, selectedkeys: selectedkeys } })
  }

  handleEditRow = (row, index) => {  //eeeeeeeeeee
    if (!row || index < 0) return;
    //加载表单数据
    let table = { ...this.state.myTable1 }
    let record = this.setFormValues('myForm1', row);
    this.setState({ myWin1: true, record: record, addoredit: 'update', myTable1: { ...table, row: row, rowindex: index } }, () => {
      setTimeout(() => {
        //只有点击过选项卡之后，才有表单控件，才可以赋值
        //this.setFormValues('myForm1', row);
        this[this.state.myTable1.keyfield]?.setState({ editable: false });
      })
    });
  }

  handleAddClick = () => {  //aaaaaaaa
    this.setState({ myWin1: true, addoredit: 'add' }, () => {
      this.resetFormValues('myForm1');
      this[this.state.myTable1.keyfield].setState({ editable: true });
    });
  }

  handleDeleteClick = async (row, rowindex) => {
    let table = { ...this.state.myTable1 };
    this.setState({ myTable1: { ...table, row, rowindex } }, () => { //自动触发1次，先清空data
      setTimeout(() => {
        this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + this.state.myTable1.row[this.state.myTable1.keyfield] + '】这个商品？' });
      })
    });
  }

  handleDeleteRow = async (e) => {  //ddddddddddddddelete
    let table = { ...this.state.myTable1 }
    let { pageno, pagesize, total, rowindex, keyfield, row } = table;
    //console.log(999,row, rowindex, keyfield)
    let xdata = { ...row };
    //xdata[keyfield] = row[keyfield];
    xdata._action = 'delete';
    xdata._reloadrow = 0;
    let p = {};
    p.sqlprocedure = 'demo901a'; //"demo502c";
    p.data = [];
    p.data.push(xdata);
    //console.log(JSON.stringify(p.data));
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
    if (pageno > 0) {
      this.setState({ myTable1: { ...table, pageno, rowindex } }, () => { //自动触发1次，先清空data
        setTimeout(() => {
          this.myDeleteModal.setState({ visible: false });
          this.loadTableData();
        })
      });
    }
    //message.info('确认删除'+row.productname+'这个商品？');
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
      if (addoredit == 'add') {
        //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
        data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
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
        console.log(775, JSON.stringify(p.data));
        let rs1 = await reqdoSQL(p);
      }
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

  handleCloseMyWin1 = (row) => {
    this.setState({ myWin1: false })
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

  /*
  handleContextMenu=(row, index, e)=>{
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    this.handleSelectRow(row, index);    
    let id=document.getElementById('myTable1');
    id.oncontextmenu = function(e){
      e.preventDefault();
    }    
  }
  */

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

  handleMyMenu1Click = (e) => {
    console.log(444, e);
  }

  handleTabChange = (activetabkey) => {
    this.setState({ activetabkey });
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
    const { data, pagesize, total, pageno } = this.state.myTable1;
    const { addoredit } = this.state;
    const items1 = [{
      label: '新增',
      key: 'menu11',
      icon: <PlusCircleOutlined />
    }, {
      label: '修改',
      key: 'menu12',
      icon: <EditOutlined />
    }, {
      type: 'divider',
      key: 'menu13',
    }, {
      label: '删除',
      key: 'menu14',
      icon: <DeleteOutlined />
    }, {
      label: '保存',
      key: 'menu15',
      icon: <SaveOutlined />
    }];
    //console.log(6666,this.state.myTable1.data);
    return (<>
      <Layout style={{ overflow: 'hidden', position: 'relative' }}>
        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='filterbar'>
            <div style={{ marginTop: 1, paddingTop: 1 }}>
              <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>新增</Button>
              <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </div>
            <AntdInputBox type='search' id='filtertext' label='快速过滤' labelwidth='72' top='2' left='270' width='350' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        <Content style={{ overflow: 'auto', position: 'relative' }}>
          <div>
            {data.map((item, index) => {
              let filenames = myStr2JsonArray(item.photopath);
              //let src='';
              //if (filenames?.length>0) src=filenames[0].filename;
              //border:'1px solid #95B8E7'
              //console.log(index, item.productid,item.photopath,filenames);
              //console.log(111,sys.serverpath + filenames[0].filename)
              return (
                <span key={"span_" + index} style={spanStyle} xstyle={{ border: '1px solid #D3D3D3', fontSize: 13, display: 'inline-block', height: 250, width: 290, padding: '2px 2px 4px 8px', margin: '8px 4px 8px 8px' }}>
                  {/* <center><Image id={"image_"+index} height={135} src={sys.serverpath + filenames[0].filename} datatype='xjson' /></center> */}
                  <center><AntdImage id={"image_" + index} height={135} src={filenames[0].filename} datatype='xjson' /></center>
                  <div><font color="red" size="3">{`￥${item.unitprice}`}</font></div>
                  <div>{item.productid + '-' + item.productname + ' ' + item.quantityperunit}</div>
                  <div className="textdiv" style={{ float: 'left', width: 180 }}>{item.suppliername}</div>
                  <div className="textdiv" style={{ float: 'right', width: 85, marginRight: 4 }}>{item.region + '  ' + item.city}</div>
                  <div style={{ clear: 'both' }}></div>
                  <div style={{ float: 'left' }}>本月销量：{item.qty1}</div>
                  <div style={{ float: 'right', marginRight: 4 }}>{'  累计销量：' + item.qty2}</div>
                  <div style={{ clear: 'both' }}></div>
                  <div style={{ marginTop: 6 }}>
                    <Tooltip title="修改商品" placement="bottom"><Button size='small' type="primary" icon={<EditOutlined style={{ fontSize: '12px' }} />} style={{ height: 24, width: 24, marginRight: 8 }} onClick={() => this.handleEditRow(item, index)} /></Tooltip>
                    <Tooltip title="删除商品" placement="bottom"><Button size='small' type="primary" icon={<DeleteOutlined style={{ fontSize: '12px' }} />} style={{ height: 24, width: 24 }} onClick={() => this.handleDeleteClick(item, index)} /></Tooltip>
                  </div>
                </span>
              )
            })
            }
          </div>
        </Content>
        <Footer style={{ padding: '5px 16px 0px 16px', height: 35, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
          <Pagination size="small" total={this.state.myTable1.total} style={{ textAlign: 'right', height: 35 }}
            showSizeChanger pageSizeOptions={['10', '20', '50', '100']} showQuickJumper className='paginationStyle'
            current={this.state.myTable1.pageno} defaultPageSize={this.state.myTable1.pagesize}
            pageSize={this.state.myTable1.pagesize}
            showTotal={(total, range) => this.showTotal(total, range)}
            onShowSizeChange={this.handleSizeChange.bind(this)}
            onChange={this.handlePageChange.bind(this)}
          />
        </Footer>
      </Layout>
      <Modal name='myWin1' key='myWin1' title='商品详细信息' open={this.state.myWin1} width={450} forceRender centered maskClosable={false}
        cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }} style={{ position: 'relative', padding: 0 }} closable keyboard={false}
        styles={{ body: { padding: 0, margin: 0, height: '440px' } }} //bodyStyle={{padding:0, margin:0, height:'490px'}} 
        footer={[<Button key='btnok' type='primary' htmltype='submit' onClick={this.handleSaveClick}>保存</Button>, <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
        <Form name="myForm1" key='myForm1' ref={ref => this.myForm1 = ref} autoComplete="off" style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'hidden' }} >
          <Tabs id="myTab" activeKey={this.state.activetabkey} size="small" tabBarGutter={24}
            style={{ margin: 0, marginLeft: 2, padding: 0, paddingRight: 10, height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}
            onChange={this.handleTabChange.bind(this)}
            items={[
              {
                label: '基本信息', key: 'myTab1', forceRender: true, children:
                  <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    <AntdInputBox type='text' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={2 + rowheight * 0} ref={ref => this.productid = ref} />
                    <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='2' width='300' top={2 + rowheight * 1} />
                    <AntdInputBox type='text' id='englishname' label='英文名称' labelwidth='82' left='2' width='300' top={2 + rowheight * 2} />
                    <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='300' top={2 + rowheight * 3} />
                    <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='2' width='140' top={2 + rowheight * 4} />
                    <AntdInputBox type='number' id='unitprice' label='单价' labelwidth='82' left='216' width='85' top={2 + rowheight * 4} min={0.01} precision={2} controls={false} />
                    <AntdCascader page={this} form='myForm1' id='subcategoryid' label='所属类别' labelwidth='82' left='2' width='300' top={2 + rowheight * 5} ref={ref => this.subcategoryid = ref} textfield='categoryname' valuefield='subcategoryid' sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} />
                    <AntdInputBox type='text' id='categoryname' label='商品大类' labelwidth='82' left='2' width='300' readOnly top={2 + rowheight * 6} />
                    <AntdComboBox id='supplierid' label='供应商' labelwidth='82' left='2' width='300' top={2 + rowheight * 7} sqlprocedure='demo502d' onChange={this.handleSupplierChange} textfield='suppliername' valuefield='supplierid' />
                    <AntdInputBox type='date' id='releasedate' label='发布日期' labelwidth='82' left='2' width='140' top={2 + rowheight * 8} ref={ref => this.releasedate = ref} />
                  </div>
              },
              {
                label: '上传图片', key: 'myTab2', forceRender: true, children:
                  <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    <AntdImageUpload id='photopath' label='图片预览' labelwidth='82' left='2' width='400' datatype='json' top={2 + rowheight * 0} uploadonsave ref={ref => this.photopath = ref} targetpath='mybase/resources' xfiletag='`p_${sys.productid}`' filetag='sys.productid' timeStamp={false} fieldNames={{ url: 'filename' }} maxCount='5' />
                  </div>
              }
            ]}
          />
          <AntdHiddenField id='supplieridx' />
          <AntdHiddenField id='categoryid' />
        </Form>
      </Modal>
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRow.bind(this)} />
    </>)
  }
}
