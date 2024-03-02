import { Tabs, Tooltip, FloatButton, Tree, Dropdown, Popconfirm, Drawer, Button, Pagination, message, Watermark, Switch, Form, Table, Layout, Radio, Modal } from 'antd'
import React, { Component } from 'react'
import { myDeleteUploadedFiles, myRenameUploadedFiles, myNotice, myDoFiles, myLocalTime, reqdoSQL, reqdoTree } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { AntdTree, AntdInputBox, AntdComboBox } from '../../api/antdClass.js'
import { ConfirmModal, AntImageUpload, AntCascader, AntHiddenField, AntComboTree, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { DownOutlined, PaperClipOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Resizable } from 'react-resizable';
import { AntdTable } from '../../api/antdTable.js';
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
const resizeHandle = {
    position: 'absolute',
    top: '0',
    right: '-3px', /* 使得把手稍微突出以便于拖动 */
    bottom: '0',
    width: '3px', /* 把手宽度 */
    cursor: 'ew-resize',
    backgroundColor: 'rgb(224,236,255)',
    zIndex: '10' /* 确保把手在最前面 */,
    borderRight: '1px solid #95B8E7',
    borderLeft: '1px solid #95B8E7'
}

export default class Page1102 extends MyFormComponent {
    state = {
        myTable1: {
            columns: [
                { title: '序号', dataIndex: 'xrowno', width: '50px', fixed: 'left', className: 'rownumberStyle', render: (text, record, index) => (this.state.myTable1.pageno - 1) * this.state.myTable1.pagesize + index + 1 },
                { dataIndex: 'productid', title: '商品编码', width: '70px', align: 'center', fixed: 'left' },
                { dataIndex: 'productname', title: '商品名称', width: '240px', fixed: 'left', ellipsis: true },
                { dataIndex: 'quantityperunit', title: '规格型号', width: '170px' },
                { dataIndex: 'unit', title: '计量单位', width: '80px', align: 'center' },
                { dataIndex: 'quantity', title: '数量', width: '80px', align: 'right' },
                { dataIndex: 'unitprice', title: '单价', width: '80px', align: 'right' },
                { dataIndex: 'discount', title: '折扣', width: '75px', align: 'right' },
                { dataIndex: 'amount', title: '金额', width: '90px', ellipsis: true, align: 'right' },
                {
                    title: '操作', dataIndex: '_operation', key: '_operation', fixed: 'right', width: '40px',
                    //record对应的是render里的对象 ，dataindex对应的值
                    render: (text, record, index) => <>
                        {/* <Tooltip title="修改记录" placement="bottom"><Button size='small' type="text" icon={<PlusCircleOutlined style={{ fontSize: '10px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }} onClick={() => this.handleEditRow(record)} /></Tooltip> */}
                        <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定删除这个订单明细？`}
                            onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft">
                            <Tooltip title="删除记录" placement="bottom"><Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '10px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} /></Tooltip>
                        </Popconfirm>
                    </>
                }],
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
        },

        myTable2: {
            columns: [
                { dataIndex: 'customerid', title: '客户编码', width: '90px', align: 'center', fixed: 'left' },
                { dataIndex: 'companyname', title: '客户名称', width: '240px', fixed: 'left', ellipsis: true },
                { dataIndex: 'address', title: '客户地址', width: '170px' }
            ],
            data: [],  //某一页数据
            row: {},  //当前选中的行
            lastrow: {}, //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
            selectedkeys: [],  //antd中选中打钩的行
        },
        myTree1: {
            roottitle: '10月份',
            treewidth: 320,
            node: {},  //当前myTree1树中选中的结点
        },
        myTree2: {
            treewidth: 320,
            node: {},  //当前myTree1树中选中的结点
        },
        resizing: false,
        collapsed: false,
        supplierdata: [],
        addoredit: 'update',
        record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
        myWin1: false,    //子窗体modal初始时为关闭状态
        menuitems: [{ label: '新增', key: 'menu-add', icon: <PlusCircleOutlined /> }, { label: '修改', key: 'menu-edit', icon: <EditOutlined /> }, { type: 'divider', key: 'menu13' }, { label: '删除', key: 'menu-delete', icon: <DeleteOutlined /> }, { label: '刷新', key: 'menu-refresh', icon: <RedoOutlined /> }],
    }

    componentDidMount = async () => {
        console.log(444, this.myTree1.state.data);
        //this.loadTableData();
        // let columnset="商品编码/productid/C80d;商品名称/productname/L250;规格型号/quantityperunit/L200c;单价/unitprice/R75n";
        // let c=this.parseColumnSet(columnset);
        // console.log(111,c);

    }


    loadTableData = async () => { //加载每页数据
        let { pageno, pagesize, selectedkeys, rowindex } = this.state.myTable1;
        let { node } = this.state.myTree1;
        if (!node || node.isparentflag > 0) return;
        let p = {}
        p.sqlprocedure = 'demo1102d';
        p.orderid = node.id || '';
        const rs = await reqdoSQL(p);
        if (rowindex > rs.rows.length - 1 || rowindex == -1) rowindex = 0;
        if (rowindex < rs.rows.length) selectedkeys = [rs.rows[rowindex][this.state.myTable1.keyfield]];
        else selectedkeys = [];
        let row = rs.rows[rowindex];
        let table = { ...this.state.myTable1 }
        this.setState({ myTable1: { ...table, data: rs.rows, row, rowindex, selectedkeys: selectedkeys } }, () => {
            setTimeout(() => {
                this.handleSelectRow(row, rowindex)
                //this.setFormValues('myForm1', this.state.myTable1.row);
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
        let record = this.setFormValues('myForm2', row);
        this.setState({ addoredit: 'update', record: record, myTable1: { ...table, row: row, rowindex: index, selectedkeys: [row[this.state.myTable1.keyfield]] } }, () => {
            setTimeout(() => {
                this.setFormValues('myForm1', row);
                // this[this.state.myTable1.keyfield].setState({ readOnly: true })
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
        this.setState({ addoredit: 'update' }, () => {
            setTimeout(() => {
                //this.setFormValues('myForm1', row);
                //this[this.state.myTable1.keyfield].setState({editable: false});
            })
        });
    }

    handleAddClick = () => {  //aaaaaaaa
        this.setState({ addoredit: 'add' }, () => {
            this.resetFormValues('myForm2');
            // this[this.state.myTable1.keyfield].setState({ readOnly: false })
            // this[this.state.myTable1.keyfield].setState({ editable: true });
        });
    }

    handleDeleteClick = async (e) => {
        let { row, keyfield } = this.state.myTable1;
        let { orderid } = this.state.myTable1.row;
        this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + orderid + ' ' + row.productname + '】这个订单明细？' });
        return;
    }


    handleDeleteRow = async (row, index) => {  //ddddddddddddddelete
        row = this.state.myTable1.row;
        let p = {};
        p.action = 'delete'
        p.sqlprocedure = 'demo1102h';
        p.orderid = row.orderid
        p.oldproductid = row.productid;
        for (let key in row) {
            if (key === 'unitprice' || key === 'productid' || key === 'quantity' || key === 'discount') {
                p[key] = row[key]
            }
        }
        await reqdoSQL(p);
        this.loadTableData()
        this.myDeleteModal.setState({ visible: false })
    }

    handleSaveClick = async () => {  //sssssssssssave
        let row = this.myForm2.getFieldsValue();
        let { orderid, productid } = this.state.myTable1.row;
        let data = [this.state.myTable1.data]
        let p = {};
        p.action = this.state.addoredit
        p.sqlprocedure = 'demo1102h';
        p.orderid = orderid
        p.oldproductid = productid;
        for (let key in row) {
            if (key === 'unitprice' || key === 'productid' || key === 'quantity' || key === 'discount' || key === 'amount') {
                p[key] = row[key]
            }
        }
        let rs = await reqdoSQL(p);
        this.setState({ myTable1: { ...this.state.myTable1, rowindex: rs.rows.length - 1 } })
        this.loadTableData()
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
      console.log(this.state.row[this.state.myTable1.keyfield]);
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

    handleOnShow = () => { //刚开始就定位到第一个订单
        let { data } = this.myTree1.state;
        console.log(1234, this.myTree1.AntdTree)
        let keys = [data[0].key];
        if (data[0].children?.length > 0) keys.push(data[0].children[0].key);
        let node = data[0].children[0].children[0]
        if (node) {
            this.myTree1.AntdTree.setExpandedKeys(keys);
            this.myTree1.AntdTree.setState({ selectedKeys: [node.key] });
            let e = {}; e.node = node;
            this.handleSelectNode(node.key, e);
        }
    }

    onFinish = (json) => { //提交时触发
        console.log(661, json);
    }

    onResize = (event, { element, size }) => {
        if (!this.state.resizing) {
            this.setState({ resizing: true });
        }
        window.requestAnimationFrame(() =>
            this.setState({ myTree1: { ...this.state.myTree1, treewidth: size.width } })
        );
    };

    onResizeStop = () => {
        this.setState({ resizing: false });
    };

    handleSelectNode = async (key, e) => {
        console.log(1999, e.node);
        this.setState({ myTree1: { ...this.state.myTree1, node: e.node } }, () => this.loadTableData());
    }

    handleSearchCustomer = async () => {  //rrrrrrrrrrrrrrr
        let s = this.myForm1.getFieldValue('customerid');
        let pageno = 1;
        let rowindex = 0;
        if (s !== '') {
            let p = {};
            p.customerid = s;
            p.sqlprocedure = 'demo1102e';
            let rs = await reqdoSQL(p);
            let rowno = parseInt(rs.rows[0].rowno);
            let total = parseInt(rs.rows[0].total);
            pageno = Math.floor((rowno - 1) / 20) + 1;
            rowindex = rowno - (pageno - 1) * 20 - 1;
            console.log(777, total, rowno, pageno, rowindex)
        }
        this.setState({ myWin1: true }, () => this.myTable2.setState({ pageno, rowindex }, () => this.myTable2.loadTableData()));

    }


    handleSelectCustomerRow = (row, index) => {
        this.setState({ myWin1: false }, () => {
            console.log(444, row.companyname);
            this.myForm1.setFieldValue('customerid', row.customerid);
            this.myForm1.setFieldValue('customername', row.companyname);

        })
    }


    handleSearchProduct = async () => {  //rrrrrrrrrrrrrrr
        let productid = this.myForm2.getFieldValue('productid');
        let p = {};
        p.sqlprocedure = 'demo1102g'
        p.productid = productid;
        let rs = await reqdoSQL(p);
        let rows = rs.rows;
        if (rows.length > 0) {
            this.myForm2.setFieldsValue(rows[0])
            return rows[0];
        } else {
            this.myForm2.setFieldValue('productid', '')
            this.myForm2.setFieldValue('productname', '')
        }
    }

    handleForm2Change = async (changed, all) => {
        let index = this.state.myTable1.rowindex;
        let data = [...this.state.myTable1.data]
        let changedid = Object.keys(changed)[0];
        let value = Object.values(changed)[0];
        let rows=[];
        if (changedid === 'unitprice' || changedid === 'quantity' || changedid === 'discount') {
            let amount = this.handleAmount()
            all = { ...all, amount }
        } else if (changedid === 'productid') {
            rows = data.filter(item => item.productid === value)
            if (rows.length === 0) {
                let row = await this.handleSearchProduct()
                this.setState({ myTable1: { ...this.state.myTable1, selectedkeys: [value] } })
                all = { ...all, ...row }   //复制，all中与row的key一样的，以row为主
            }
        }
        if (rows.length === 0) {
            data[index] = all
            this.setState({ myTable1: { ...this.state.myTable1, data } })
        } else {
            alert('订单明细记录重复！')
            data[index] = this.state.myTable1.row
            this.setState({ myTable1: { ...this.state.myTable1, selectedkeys: [this.state.myTable1.row.productid], data } })
            this.setFormValues('myForm2', this.state.myTable1.row)
        }
    }

    //amount是计算列
    handleAmount = () => {
        let row = this.myForm2.getFieldsValue();
        let amount = (1 - row.discount) * row.quantity * row.unitprice;
        this.myForm2.setFieldValue('amount', amount)
        return amount;
    }

    render() {
        const { data, pagesize, total, addoredit, pageno, columns, menuitems } = this.state;
        return (<>
            <Layout style={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
                <Resizable width={this.state.myTree1.treewidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div style={resizeHandle} />} resizeHandles={['e']}>
                    <Sider theme='light'
                        width={this.state.myTree1.treewidth}
                        collapsed={this.state.collapsed}
                        collapsible={false}
                        zeroWidthTriggerStyle={true}
                        collapsedWidth={60}
                        style={{ margin: 0, padding: 0, height: '100%', position: 'relative', marginLeft: 0 }}>
                        <Layout>
                            <Header style={{ height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7' }}>
                                <AntdInputBox id='filtertext' label='' labelwidth='' top='1' left='6' width='200' type='search' />
                            </Header>
                            <Content style={{ overflow: 'auto' }}>
                                <Tabs id='myTabs' style={{ overflow: 'auto', height: '100%' }} items={[
                                    {
                                        key: 'myTab1', label: '当月订单', children:
                                            <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', maxHeight: '100%' }} >
                                                <AntdTree ref={ref => this.myTree1 = ref} style={{}}
                                                    root={this.state.myTree1.roottitle} width={this.state.myTree1.treewidth - 2}
                                                    month='10' sqlprocedure="demo1102a" filterprocedure="demo1102m"
                                                    loadall="true" filter='false'
                                                    onShow={this.handleOnShow}
                                                    switcherIcon={<DownOutlined />}
                                                    onSelectNode={this.handleSelectNode.bind(this)}  /*自定义属性*/
                                                />
                                            </div>
                                    }, {
                                        key: 'myTab2', label: '当年订单', children:
                                            <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%' }} >
                                                <AntdTree ref={ref => this.myTree2 = ref} style={{}}
                                                    month='10' sqlprocedure="demo1102b" filterprocedure="demo1102n"
                                                    loadall="false" filter='false' width={this.state.myTree2.treewidth - 2}
                                                    switcherIcon={<DownOutlined />}
                                                    onSelectNode={this.handleSelectNode.bind(this)}  /*自定义属性*/
                                                />
                                            </div>
                                    }]}>
                                </Tabs>
                            </Content>
                        </Layout>
                    </Sider>
                </Resizable>
                <Content>
                    <Layout>
                        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
                            <Form name='filterbar' style={{ position: 'relative' }}>
                                <div style={{ marginTop: 1, paddingTop: 1 }}>
                                    <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>新增</Button>
                                    <Button type="text" icon={<FileExcelOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>导出</Button>
                                    <Button type="text" icon={<DeleteOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleDeleteClick.bind(this)}>删除</Button>
                                    <Button type="text" icon={<SaveOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleSaveClick.bind(this)}>保存</Button>
                                    <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
                                </div>
                                <AntdInputBox id='filtertext' label='快速过滤' labelwidth='72' top='1' left='370' width='300' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
                            </Form>
                        </Header>
                        <Dropdown menu={{ items: menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
                            <Content style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
                                <Layout>
                                    <Header style={{ position: 'relative', padding: 0, paddingLeft: 4, height: 135, backgroundColor: '#f2f2f2', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
                                        <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" onFinish={this.onFinish} >
                                            <AntdInputBox type='text' id='orderid' label='订单编号' labelwidth='82' left='2' width='180' top={12 + rowheight * 0} ref={ref => this.productid = ref} readOnly />
                                            <AntdInputBox type='date' id='orderdate' label='订单日期' labelwidth='82' left='300' width='135' top={12 + rowheight * 0} ref={ref => this.orderdate = ref} />
                                            <AntdInputBox type='date' id='requireddate' label='要货日期' labelwidth='82' left='563' width='135' top={12 + rowheight * 0} ref={ref => this.requireddate = ref} />
                                            <AntdInputBox type='search' id='customerid' label='客户编码' labelwidth='82' left='2' width='180' top={12 + rowheight * 1} ref={ref => this.customerid = ref} onSearch={this.handleSearchCustomer.bind(this)} />
                                            <AntdInputBox type='text' id='customername' label='客户名称' labelwidth='82' left='300' width='400' top={12 + rowheight * 1} ref={ref => this.companyname = ref} readOnly />
                                            <AntdComboBox id='employeeid' label='员工编码' labelwidth='82' left='2' width='180' top={12 + rowheight * 2} ref={ref => this.employeeid = ref} valuefield='employeeid' labelfield='employeename' sqlprocedure='sys_fromtable' tablename='employees' />
                                            <AntdComboBox id='shipperid' label='运输公司' labelwidth='82' left='300' width='200' top={12 + rowheight * 2} ref={ref => this.shipperid = ref} valuefield='shipperid' labelfield='companyname' sqlprocedure='sys_fromtable' tablename='shippers' />
                                            <AntdInputBox type='number' id='freight' label='运输费用' value={0} labelwidth='82' left='600' width='100' top={12 + rowheight * 2} ref={ref => this.freight = ref} precision='2' />
                                        </Form>
                                    </Header>
                                    <Content>
                                        <Table className="myTableStyle" sticky={true} size='small' rowKey={this.state.myTable1.keyfield} id='myTable1' ref={ref => this.myTable1 = ref} bordered={true}
                                            scroll={{ x: '90%', y: 'calc(100vh - 148px)' }}
                                            // style={{ overflowX: 'auto', position: 'absolute', height: '100%', maxHeight: '100%' }}
                                            columns={this.state.myTable1.columns} dataSource={this.state.myTable1.data} pagination={false}
                                            //onChange={this.handleSorter}
                                            rowSelection={{
                                                type: 'radio',
                                                selectedRowKeys: this.state.myTable1.selectedkeys,
                                                onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) }
                                            }}
                                            onRow={(record, index) => {
                                                return {
                                                    onClick: (e) => { this.handleSelectRow(record, index) }, // 点击行
                                                    // onDoubleClick: (e) => { this.handleEditRow(record, index) },
                                                    onContextMenu: (e) => { this.handleContextMenu(record, index, e) }
                                                };
                                            }}
                                        />
                                    </Content>

                                </Layout>
                            </Content>
                        </Dropdown>
                        <Footer style={{ padding: '5px 16px 0px 16px', height: 136, borderTop: '1px solid #95B8E7', borderLeft: '0px', background: '#efefef' }}>
                            <Form name="myForm2" ref={ref => this.myForm2 = ref} onValuesChange={this.handleForm2Change.bind(this)} autoComplete="off" onFinish={this.onFinish} initialValues={this.state.row} style={{ padding: 0, margin: 0, position: 'absolute', height: '100%', width: '860px' }} >
                                <AntdInputBox type='search' id='productid' label='商品编码' labelwidth='82' left='2' width='140' top={2 + rowheight * 0} ref={ref => this.productid = ref} onSearch={this.handleSearchProduct.bind(this)} />
                                <AntdInputBox type='text' id='productname' label='商品名称' labelwidth='82' left='412' width='315' top={2 + rowheight * 0} readOnly />
                                <AntdInputBox type='text' id='quantityperunit' label='规格型号' labelwidth='82' left='2' width='298' top={2 + rowheight * 1} readOnly />
                                <AntdInputBox type='text' id='unit' label='计量单位' labelwidth='82' left='412' width='140' top={2 + rowheight * 1} readOnly />
                                <AntdInputBox type='number' id='quantity' label='销售数量' labelwidth='82' left='2' width='90' top={2 + rowheight * 2} min={0.01} precision={0} />
                                <AntdInputBox type='number' id='unitprice' label='销售单价' labelwidth='82' left='200' width='100' top={2 + rowheight * 2} min={0.01} precision={2} />
                                <AntdInputBox type='number' id='discount' label='折扣' labelwidth='82' left='412' width='100' top={2 + rowheight * 2} min={0.00} precision={2} />
                                <AntdInputBox type='number' id='amount' label='销售金额' labelwidth='82' left='620' width='105' top={2 + rowheight * 2} min={0.01} precision={2} readOnly />
                            </Form>
                        </Footer>
                    </Layout>
                </Content>
            </Layout>
            <Modal name='myWin1' title='客户选择' open={this.state.myWin1} width={680} forceRender centered maskClosable={false}
                cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }}
                styles={{ position: 'relative', padding: 0, body: { border: '1px solid #ccc', overflow: 'hidden', height: '500px', width: '650px', padding: 0, margin: 0 } }}
                closable keyboard={false}
                footer={[<Button key='btnok' type='primary' htmltype='submit' onClick={this.handleSaveClick}>选择</Button>, <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
                <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>  {/* 添加一个层，否则文本框需要大于30px才能输入 */}
                    <AntdTable ref={ref => this.myTable2 = ref} columns={this.state.myTable2.columns}
                        toolbar='refresh;filter' rowselection='checkbox' pagesize={20}
                        contextmenu='add;edit;delete;-;save;refrsh' rownumber
                        keyfield='customerid' keytitle='客户' sqlprocedure='demo304d'
                        onDoubleClick={(row, index) => this.handleSelectCustomerRow(row, index)}
                    />
                </div>
            </Modal>
            <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRow.bind(this)} />
        </>)
    }
}
