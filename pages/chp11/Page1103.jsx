import { Tabs, Tooltip, Dropdown, Popconfirm, Button, Form, Table, Layout, Modal } from 'antd'
import React from 'react'
import { myNotice, reqdoSQL } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { AntdTree, AntdInputBox, AntdComboBox } from '../../api/antdClass.js'
import { ConfirmModal, AntComboBox } from '../../api/antdComponents.js'
import { DownOutlined, RedoOutlined, FileExcelOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Resizable } from 'react-resizable';
import { AntdTable } from '../../api/antdTable.js';
//import './editable.css'
const { Header, Content, Sider, Footer } = Layout;

const rowheight = 42;
const resizeHandle = {
    position: 'absolute',
    top: '0',
    right: '-3px', /* 使得把手稍微突出以便于拖动 */
    bottom: '0',
    width: '3px', /* 把手宽度 */
    cursor: 'ew-resize',
    backgroundColor: 'rgb(224,236,255)',
    zIndex: '10' /* 确保把手在最前面 */
}

export default class Page1103 extends MyFormComponent {
    state = {
        myTable1: {
            columns: [
                {
                    title: '序号', dataIndex: 'xrowno', width: '50px', fixed: 'left', className: 'rownumberStyle',
                    render: (text, record, index) => (this.state.myTable1.pageno - 1) * this.state.myTable1.pagesize + index + 1
                },
                { dataIndex: 'productid', title: '商品编码', width: '90px', align: 'center', fixed: 'left' },
                { dataIndex: 'productname', title: '商品名称', width: '240px', fixed: 'left', ellipsis: true },
                { dataIndex: 'quantityperunit', title: '规格型号', width: '170px' },
                { dataIndex: 'unit', title: '计量单位', width: '80px', align: 'center' },
                { dataIndex: 'quantity', title: '数量', width: '80px', align: 'right' },
                { dataIndex: 'unitprice', title: '单价', width: '80px', align: 'right' },
                { dataIndex: 'discount', title: '折扣', width: '75px' },
                { dataIndex: 'amount', title: '金额', width: '90px', ellipsis: true },
                {
                    title: '操作', dataIndex: '_operation', key: '_operation', fixed: 'right', width: '52px',
                    render: (text, record, index) => {
                        return (<>
                            <Tooltip title="插入记录" placement="bottom">
                                <Button size='small' type="text" icon={<PlusCircleOutlined style={{ fontSize: '10px', textAlign: 'center' }} />} style={{ height: 24, width: 20, marginRight: 2 }}
                                    onClick={this.handleAddRow} />
                            </Tooltip>
                            <Popconfirm okText='确定' cancelText='取消' overlayStyle={{ width: 350 }} title='系统提示' description={`是否确定删除"${record.productname}"的这个商品？`}
                                onConfirm={() => { this.handleDeleteRow(record, index) }} placement="topLeft">
                                <Tooltip title="删除记录" placement="bottom">
                                    <Button size='small' type="text" icon={<DeleteOutlined style={{ fontSize: '10px', align: 'cmiddle', marginBottom: 3 }} />} style={{ height: 24, width: 20 }} />
                                </Tooltip>
                            </Popconfirm>
                        </>)
                    }
                }].map(item => {//遍历所有列，除去序号和操作列，其他列都可以作为可编辑列
                    if (item.dataIndex !== '_operation' && item.dataIndex !== 'xrowno') {
                        return { ...item, render: (text, record) => this.renderEditableCell(text, record, item.dataIndex, parseInt(item.width)) }
                    }
                    return item
                }),
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
            reloadflag: 1
        },
        myTable2: {
            columns: [
                { dataIndex: 'customerid', title: '客户编码', width: '80px', align: 'center', fixed: 'left' },
                { dataIndex: 'companyname', title: '客户名称', width: '230px', fixed: 'left', ellipsis: true },
                { dataIndex: 'address', title: '客户地址', width: '260px' },
                { dataIndex: 'contactname', title: '联系人', width: '100px' },
                { dataIndex: 'city', title: '所在城市', width: '80px' },
            ],
            data: [],  //某一页数据
            row: {},  //当前选中的行
            lastrow: {}, //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
            selectedkeys: [],  //antd中选中打钩的行
        },
        myTable3: {
            columns: [
                { dataIndex: 'productid', title: '商品编码', width: '90px', align: 'center', fixed: 'left' },
                { dataIndex: 'productname', title: '商品名称', width: '240px', fixed: 'left', ellipsis: true },
                { dataIndex: 'quantityperunit', title: '规格型号', width: '180px', ellipsis: true },
                { dataIndex: 'suppliername', title: '供应商', width: '200px', ellipsis: true },
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
        supplierdata: [],
        addoredit: 'update',
        record: {},    //选中的行，返回给父类。网格填充到表单修改之前的数据，旧数据
        myWin1: false,    //子窗体modal初始时为关闭状态
        myWin2: false,    //子窗体modal初始时为关闭状态
        menuitems: [{ label: '新增', key: 'menu-add', icon: <PlusCircleOutlined /> }, { label: '修改', key: 'menu-edit', icon: <EditOutlined /> }, { type: 'divider', key: 'menu13' }, { label: '删除', key: 'menu-delete', icon: <DeleteOutlined /> }, { label: '刷新', key: 'menu-refresh', icon: <RedoOutlined /> }],
        editingKey: '-1',//当前编辑的行
        preSaveData: [], //预保存数据
        productdata: {}, //商品数据
        productFlag: false, //disable的true和false与后面点击事件的开启关闭相反
    }

    componentDidMount = async () => {
        this.loadTableData();
        this.loadProcudtData();
        // let columnset = "商品编码/productid/C80d;商品名称/productname/L250;规格型号/quantityperunit/L200c;单价/unitprice/R75n";
        // let c = this.parseColumnSet(columnset);
        // console.log(111, c);
    }


    handleResize = (e) => {
        this.setState({ myTree1: { ...this.state.myTree1, treewidth: e.width } });
    }
    onResize = (event, { size }) => {
        if (!this.state.resizing) {
            this.setState({ resizing: true });
        }
        window.requestAnimationFrame(() => this.setState({ myTree1: { ...this.state.myTree1, treewidth: size.width } }));
    };
    onResizeStop = () => {
        this.setState({ resizing: false });
    };

    parseColumnSet = (columnset) => {
        const columnsArray = columnset.split(';');
        const result = columnsArray.map(item => {
            const [title, dataIndex, alignWidthType] = item.split('/');
            //alignWidthType中存储对齐方式、列宽度和数据类型
            let align = 'left';  //如果缺省，默认对齐方式为left
            let width = '';     //列宽度
            let type = 'c';     //数据类型默认为 'c'
            //获取对齐方式，用控制，这样对齐方式缺省时候可以正确获得后面的width
            let i = 0;
            if (alignWidthType[0] == 'L') { align = 'left'; i++ }
            else if (alignWidthType[0] == 'R') { align = 'right'; i++ }
            else if (alignWidthType[0] == 'C') { align = 'center'; i++ }
            //获取列宽度，循环获取其数字
            while (!isNaN(alignWidthType[i]) && i < alignWidthType.length) {
                width += alignWidthType[i];
                i++;
            }
            // 获取后面的字母（如果存在的话）
            if (i < alignWidthType.length) {
                type = alignWidthType[i];
            }
            // 创建AntD表格的列对象
            const columnObj = {
                title,
                dataIndex,
                align,
                width: `${width}px`,
                render: (text, record) => {
                    let content = '';
                    if (type === 'n' && record[dataIndex] == 0) { content = <b><i></i></b> }
                    else content = <b><i>{record[dataIndex]}</i></b>
                    // 三元表达式写法
                    // const content = type === 'n' ? (record[dataIndex] == 0 ? ' ' : record[dataIndex]) : <b><i>{record[dataIndex]}</i></b>;
                    if (type === 'n' || type === 'd') {
                        return <span style={{ fontFamily: 'Times New Roman' }}>{content}</span>;
                    }
                    return content;
                }
            };
            return columnObj;
        });
        return result;
    };
    /**
     * @加载所有的商品数据
     */

    loadProcudtData = async () => {
        let p = {};
        p.selectsql = 'select * from products';
        let rs = await reqdoSQL(p);
        let data = {};
        rs.rows.forEach(item => {
            data[item.productid] = item;
        }
        )
        this.setState({ productdata: data })
    }

    /**
     * @param {Object} rule 
     * @param {String} value -输入框的值
     * 验证商品编码填写
     */
    validateProduct = (rule, value) => {
        // console.log(888, rule, value);

        if (this.state.productdata[value]) {
            this.myForm3.setFieldValue('productname', this.state.productdata[value].productname);
            this.myForm3.setFieldValue('unit', this.state.productdata[value].unit);
            this.myForm3.setFieldValue('quantityperunit', this.state.productdata[value].quantityperunit);
            this.setState({ productFlag: false })
            return Promise.resolve();
        } else {
            this.myForm3.setFieldValue('productname', '');
            this.myForm3.setFieldValue('unit', '');
            this.myForm3.setFieldValue('quantityperunit', '');
            this.setState({ productFlag: true })
            // this.resetFormValues('myForm3');
            return Promise.reject();
        }
    }

    handleProductWrongClick = (event) => {
        if (!this.state.productFlag) return
        // 当商品编码输入错误时，无法离开输入框 同时禁用按钮
        event.stopPropagation();
        event.preventDefault();
        if (this.productid) this.productid.myInput.focus();
    }

    loadTableData = async () => { //加载每页数据
        let { selectedkeys, rowindex } = this.state.myTable1;
        let { node } = this.state.myTree1;
        if (!node || node.isparentflag > 0) return;
        let p = {}
        p.sqlprocedure = 'demo1102d';
        p.orderid = node.id || '';
        const rs = await reqdoSQL(p);
        rowindex = 0;
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

    selectionChange = (selectedkeys, rows) => {
        //checkbox选中的项,单选功能的实现
        let table = { ...this.state.myTable1 }
        this.setState({ myTable1: { ...table, selectedkeys: selectedkeys, row: rows[0] } })
    }
    /**
     * 
     * @param {JSON} row -选中的行数据 
     * @param {Number} index -选中的行号 这里不传入则用row._sysrowno-1处理
     */

    handleSelectRow = (row, index) => {
        if (!row) return;
        console.log('handleSelectRow', row, index);
        if (!index) index = row._sysrowno - 1;
        console.log('handleSelectRow处理后', row, index);
        let table = { ...this.state.myTable1 }
        //给可编辑单元格赋值
        let record = this.setFormValues('myForm3', row);
        this.setFormValues('myForm1', row);
        this.setState({ addoredit: 'update', record: record, myTable1: { ...table, row: row, rowindex: index, selectedkeys: [row[this.state.myTable1.keyfield]] } }, () => {
            setTimeout(() => {
                // this.setFormValues('myForm1', this.state.myTable1.row);
                //如果editingKey发生了改变，就把
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

    // handleEditRow = (row) => { //eeeeeeee
    //     //console.log(117,this.state.myTable1.data);
    //     //console.log(118,row);
    //     this.setState({ myWin1: true, addoredit: 'update' }, () => {
    //         setTimeout(() => {
    //             //this.setFormValues('myForm1', row);
    //             //this[this.state.myTable1.keyfield].setState({editable: false});
    //         })
    //     });
    // }

    /** 
    * @修改点击编辑后触发的事件
    * @bug 由于初始状态下没有可编辑行，也就意味着没有表单出现，所以getFormFields取不到列。
    * @解决方法 更新state后，回调触发点击事件，强制触发一次
    * @param {JSON} row -选中的行数据
    * @param {String} field -选中的行字段 用于直接聚焦到某个字段
    */
    handleEditRow = (row, field) => { //eeeeeeee 修改记录
        console.log('编辑', row);
        this.setState({ addoredit: 'update', editingKey: row._sysrowno }, () => {
            this[field]?.myInput?.focus();
            this.handleSelectRow(row);

        });
    }

    handleAddClick = () => {  //aaaaaaaa
        this.setState({ myWin1: true, addoredit: 'add' }, () => {
            this.resetFormValues('myForm1');
            this[this.state.myTable1.keyfield].setState({ editable: true });
        });
    }

    handleDeleteClick = async () => {
        let { row, keyfield } = this.state.myTable1;
        this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + row[keyfield] + '】这个商品？' });
        return;
    }

    handleDeleteRow = async (row) => {  //ddddddddddddddelete
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
        let { pageno, pagesize, total, rowindex } = table;
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


    /*
    showCellText=(text,align)=>{
      return <div className='textdiv' style={{padding:0,textAlign:align}}>{text}</div>    
    }
    */
    /**
   * @如果有编辑行禁用右键菜单的选中功能
  **/
    handleContextMenu = (row, index) => {
        //右键设置，使用原生js，第一次点击时会显示默认菜单
        this.state.editingKey === '' && this.handleSelectRow(row, index);
        let id = document.getElementById('myTable1');
        id.oncontextmenu = function (e) {
            e.preventDefault();
        }
    }

    handleRefresh = () => {

    }


    onFinish = (json) => { //提交时触发
        console.log('onFinish:', json);
        // console.log(661, json);
    }

    handleSelectNode = async (key, e) => {
        //console.log(1999, e.node);
        this.setState({ myTree1: { ...this.state.myTree1, node: e.node } }, () => this.loadTableData());
    }

    /**
  * @判断当前行是否是编辑状态
  */
    isEditing = (record) => record._sysrowno === this.state.editingKey;

    /**
     * @渲染可编辑单元格
     * @text 当前单元格的值
     * @record 当前行的数据
     * @dataIndex 当前单元格的字段名
     * @width 当前单元格的宽度
     * */
    renderEditableCell = (text, record, dataIndex, width) => {
        const DISABLED_FIELDS = ['productname', 'quantityperunit', 'unit', 'amount'];//禁止编辑的字段
        const NUMBER_FIELDS = ['unitprice', 'discount', 'amount', 'quantity'];//数字字段

        if (!this.isEditing(record)) {
            return <div className="editable-cell-value-wrap"
                //可编辑事件只有在输入编码正确后才能触发dataIndex
                onClick={() => {
                    if (this.state.productFlag) return;
                    if (DISABLED_FIELDS.includes(dataIndex)) dataIndex = this.state.myTable1.keyfield;
                    this.handleEditRow(record, dataIndex)
                }} >
                {text}
            </div>;
        }
        // 公共属性
        const commonProps = {
            id: dataIndex,
            //表格中的输入框样式调整
            width: width,
            top: 1,//5
            left: 5,//5
            height: rowheight - 10,
            // onPressEnter: this.handlePreSave,//按下回车保存
            className: 'editable-cell'
        };

        // 根据 dataIndex 来选择不同的组件
        if (NUMBER_FIELDS.includes(dataIndex)) {
            return (
                <AntdInputBox
                    {...commonProps}
                    type="number"
                    min={0.01}
                    precision={2}
                    ref={ref => this[dataIndex] = ref}
                    disabled={this.state.productFlag || dataIndex === 'amount'}
                // disabled={this.state.productFlag}
                />
            );
        }
        // 商品编码字段
        if (dataIndex === 'productid') {
            return (
                <AntdInputBox
                    {...commonProps}
                    type='search'
                    ref={ref => this.productid = ref}
                    onSearch={this.handleSearchProduct}
                    rules={[
                        { validator: this.validateProduct },//Antd中的校验规则
                    ]}
                />
            );
        }
        // 默认为文本框
        return (
            <AntdInputBox
                {...commonProps}
                type="text"
                ref={ref => this[dataIndex] = ref}
                disabled={this.state.productFlag || DISABLED_FIELDS.includes(dataIndex)}
            />
        );
    };

    /**
     * 
     * @param {Event} e 
     * @param {JSON} record 
     * @param {Number} index 
     * 失去焦点的事件中有一个e.relatedTarget属性，它指向了失去焦点后的焦点元素，如果元素中有form，证明还在一个表单中，不需要触发失去焦点保存数据
     */
    handleBlur = (e, record, index) => {
        console.log(608, '失去焦点前后', e, e.relatedTarget, e.relatedTarget?.form)
        if (e.relatedTarget?.form && e.relatedTarget?.type !== 'button') return;
        this.handlePreSave();

    }

    /**
   * @预保存数据
   * */
    handlePreSave = async () => {
        this.myForm3.validateFields().then(values => {
            console.log('提交myForm3数据:', values);
            this.handleFormSubmit(values);
            myNotice('商品记录已经保存，请刷新数据!',)
        }
        ).catch(errorInfo => {
            console.log(2223333, errorInfo);
            myNotice('商品编码不存在，请重新输入！', 'error');
        });
    };

    /* 
     * @param {JSON} json-表单提交的数据 
    */

    handleFormSubmit = (json) => { //提交时触发
        // 处理 preSaveData
        let preSaveData = [...this.state.preSaveData];
        let preSaveIndex = preSaveData.findIndex(item => item.productid === json.productid);
        if (preSaveIndex >= 0) {
            preSaveData[preSaveIndex] = { ...preSaveData[preSaveIndex], ...json };
        } else {
            preSaveData.push(json);
        }
        // 更新 state中的data
        let tableData = [...this.state.myTable1.data];
        let editingIndex = tableData.findIndex(item => item._sysrowno === this.state.editingKey);
        if (editingIndex >= 0) {
            tableData[editingIndex] = { ...tableData[editingIndex], ...json };
        }
        this.setState({ myTable1: { ...this.state.myTable1, data: tableData }, preSaveData, editingKey: '' }, () => console.log('预保存的数据', this.state.preSaveData))

    }


    /**e
     * @数量、单价、折扣可以编辑输入，金额是自动计算出来
     * @金额是自动计算出来
     * @用Antd中Form的onValuesChange事件
     */
    handleFormValueChange = (changedValues, allValues) => {
        // 检查是否更改了相关字段
        if (changedValues.quantity || changedValues.unitprice || changedValues.discount) {
            let { quantity, unitprice, discount } = allValues;
            // 设置默认值
            quantity = quantity || 0;
            unitprice = unitprice || 0;
            discount = discount || 0;
            // 确保折扣在有效范围内
            if (discount < 0 || discount > 1) discount = 1;
            // 计算金额
            let amount = quantity * unitprice * (1 - discount);
            // 更新金额字段
            this.myForm3.setFieldValue('amount', amount);
        }
    }

    /**
     * 
     * @新插入一行数据
     */
    handleAddRow = () => {
        console.log('插入新数据', 9999);
        let newrowno = this.state.myTable1.data.length + 1
        let newRow = {
            ...this.state.myTable1.row,
            productid: '',
            productname: '',
            quantityperunit: '',
            unit: '',
            collection: '',
            _sysrowno: newrowno.toString(),
        };
        // 将新行添加到表格数据中
        let newData = [...this.state.myTable1.data, newRow];
        console.log(111111, newData);
        // 更新表格数据
        this.setState(prevState => ({
            myTable1: {
                ...prevState.myTable1,
                data: newData
            },
            // editingKey:newrowno.toString()
        }), () => {
            this.handleEditRow(newRow, this.state.myTable1.keyfield)//触发选中事件，新纪录一般来说聚焦主键列
        });
    }

    handleSearchProduct = async () => {
        let s = this.myForm3.getFieldValue('productid')
        if (!this.state.productdata[s]) s = 1; //如果没有输入商品编码或者商品编码不存在，就默认为1
        let pageno = 1;
        let rowindex = 0;
        let p = {};
        p.productid = s;
        p.sqlprocedure = 'demo1103b';  //demo1102e  select count(*)+1 as rowno,(select count(*) from products) as total from products where ProductID<$ProductID;
        let rs = await reqdoSQL(p);
        let rowno = parseInt(rs.rows[0].rowno);
        let total = parseInt(rs.rows[0].total);
        pageno = Math.floor((rowno - 1) / 20) + 1;
        rowindex = rowno - (pageno - 1) * 20 - 1;
        console.log(777, total, rowno, pageno, rowindex)
        this.setState({ myWin2: true }, () => this.myTable3.setState({ pageno, rowindex }, () => this.myTable3.loadTableData()));
    }

    handleSelectProductRow = (row, index) => {
        this.setState({ myWin2: false }, () => {
            console.log(444, row);
            this.myForm3.setFieldValue('productid', row.productid);
            // 移除productid的错误
            this.myForm3.setFields([{ name: 'productid', errors: [] }]);
            this.myForm3.setFieldValue('productname', row.productname);
            this.myForm3.setFieldValue('unit', row.unit);
            this.myForm3.setFieldValue('quantityperunit', row.quantityperunit);
        })
    }

    handleSearchCustomer = async () => {
        let s = this.myForm1.getFieldValue('customerid');  //一开始的值为undefined
        let pageno = 1;
        let rowindex = 0;
        if (s && s !== '') {
            let p = {};
            p.customerid = s;
            p.sqlprocedure = 'demo1103c';
            let rs = await reqdoSQL(p);
            let rowno = parseInt(rs.rows[0].rowno);
            let total = parseInt(rs.rows[0].total);
            pageno = Math.floor((rowno - 1) / 20) + 1;
            rowindex = rowno - (pageno - 1) * 20 - 1;
            console.log(777, total, rowno, pageno, rowindex)
        }
        this.setState({ myWin1: true }, () =>
            this.myTable2.setState({ pageno, rowindex },
                () => this.myTable2.loadTableData()
            ));
    }

    handleSelectCustomerRow = (row) => {
        this.setState({ myWin1: false }, () => {
            this.myForm1.setFieldValue('customerid', row.customerid);
            this.myForm1.setFieldValue('customername', row.companyname);
        })
    }
    render() {
        const { menuitems } = this.state;
        return (<>
            <Layout onClick={this.handleProductWrongClick}>
                <Resizable width={this.state.myTree1.treewidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div style={resizeHandle} />} resizeHandles={['e']}>
                    <Sider theme='light' width={this.state.myTree1.treewidth} style={{ height: '100%', position: 'relative', marginLeft: 0, padding: 0 }}>
                        <Layout style={{ borderRight: '1px solid #95B8E7', marginRight: 2 }}>
                            <Header style={{ height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7' }}>
                                <AntdInputBox id='treefiltertext' label='' labelwidth='' top='1' left='6' width='310' type='search' />
                            </Header>
                            <Content>
                                <Tabs id='myTabs' className="custom-tabs" style={{ overflow: 'auto', height: '100%' }}
                                    items={[{
                                        key: 'myTab1', label: '当月订单', children:
                                            <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%', maxHeight: '100%' }} >
                                                <AntdTree ref={ref => this.myTree1 = ref} style={{ overflow: 'auto' }}
                                                    root={this.state.myTree1.roottitle} width={this.state.myTree1.treewidth - 2}
                                                    month='10' sqlprocedure="demo1102a" filterprocedure="demo1102m"
                                                    loadall="true" filter='false'
                                                    switcherIcon={<DownOutlined />}
                                                    onSelectNode={this.handleSelectNode.bind(this)}  /*自定义属性*/
                                                />
                                            </div>
                                    }, {
                                        key: 'myTab2', label: '当年订单', children:
                                            <div style={{ padding: 0, margin: 0, position: 'relative', height: '100%' }} >
                                                <AntdTree ref={ref => this.myTree2 = ref} style={{}}
                                                    month='10' sqlprocedure="demo806b" filterprocedure="demo1102n"
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
                <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
                    <Layout>
                        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
                            <Form name='treefilterbar' style={{ position: 'relative' }} disabled={this.state.productFlag}>
                                <div style={{ marginTop: 1, paddingTop: 1 }}>
                                    <Button type="text" icon={<PlusCircleOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick}>新增</Button>
                                    <Button type="text" icon={<FileExcelOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleAddClick.bind(this)}>导出</Button>
                                    <Button type="text" icon={<SaveOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleSaveClick.bind(this)}>保存</Button>
                                    <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
                                </div>
                                <AntdInputBox id='treefiltertext' label='快速过滤' labelwidth='72' top='1' left='320' width='300' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
                            </Form>
                        </Header>
                        <Dropdown menu={{ items: menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
                            <Content style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
                                <Layout>
                                    <Header style={{ position: 'relative', padding: 0, paddingLeft: 4, height: 135, backgroundColor: '#f2f2f2', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
                                        <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" onFinish={this.onFinish} >
                                            <AntdInputBox type='text' id='orderid' label='订单编号' labelwidth='82' left='2' width='180' top={12 + rowheight * 0} ref={ref => this.orderid = ref} readOnly />
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
                                        <Layout>
                                        <Header theme='light' style={{ padding: 0, paddingLeft: 4, height: 300, borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
                                                {/* 可编辑行最外面套一层Form */}
                                                <Form name="myForm3" ref={ref => this.myForm3 = ref} initialValues={this.state.row}
                                                    onValuesChange={this.handleFormValueChange}
                                                    onFinish={this.handleFormSubmit} >
                                                    <Table className="myTableStyle" sticky={true} size='small' rowKey={this.state.myTable1.keyfield} id='myTable1' ref={ref => this.myTable1 = ref} bordered={true}
                                                        //scroll={{ x: '90%', y:'260px)' }}
                                                        scroll={{ x: '90%' }}
                                                        style={{ overflow: 'hidden', position: 'absolute', height: '100%', maxHeight: '100%' }}
                                                        columns={this.state.myTable1.columns} dataSource={this.state.myTable1.data} pagination={false}
                                                        rowClassName={() => 'editable-row'}//每行添加className
                                                        //onChange={this.handleSorter}
                                                        rowSelection={{
                                                            type: 'radio',
                                                            selectedRowKeys: this.state.myTable1.selectedkeys,
                                                            onChange: (selectedRowKeys, selectedRows) => { this.selectionChange(selectedRowKeys, selectedRows) }
                                                        }}
                                                        onRow={(record, index) => {
                                                            return {
                                                                onContextMenu: (e) => { this.handleContextMenu(record, index, e) },
                                                                onBlur: (e) => { !this.state.myWin2 && this.handleBlur(e) }, //失去焦点保存 
                                                            };
                                                        }}
                                                    />
                                                </Form>
                                            </Header>
                                            <Content>
                                                <Form name="myForm2" ref={ref => this.myForm2 = ref} autoComplete="off" style={{ padding: 0, margin: 0, position: 'absolute', height: '100%', width: '860px' }} >
                                                    <AntdInputBox type='text' id='operator' label='制单人' labelwidth='72' left='2' width='150' top={2 + rowheight * 0} ref={ref => this.operator = ref} readOnly />
                                                    <AntdInputBox type='text' id='checker' label='审核人' labelwidth='72' left='312' width='150' top={2 + rowheight * 0} ref={ref => this.checker = ref} readOnly />
                                                    <AntdInputBox type='text' id='updatetime' label='制单日期' labelwidth='72' left='640' width='150' top={2 + rowheight * 0} ref={ref => this.updatetime = ref} readOnly />
                                                </Form>

                                            </Content>
                                        </Layout>
                                    </Content>

                                </Layout>
                            </Content>
                        </Dropdown>
                    </Layout>
                </Content>

            </Layout>
            <Modal name='myWin1' title='客户选择' open={this.state.myWin1} width={815} forceRender centered maskClosable={false}
                className="custom-modal" cancelText='关闭' onCancel={() => { this.setState({ myWin1: false }) }}
                styles={{ position: 'relative', padding: 0, body: { border: '1px solid #ccc', overflow: 'hidden', height: '450px', width: '790px', padding: 0, margin: 0 } }}
                closable keyboard={false} footer={[<Button key='btnok' type='primary' htmltype='submit' onClick={() => this.handleSelectCustomerRow(this.myTable2?.state.row)}>选择</Button>,
                <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin1: false }) }}>关闭</Button>]}>
                <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>  {/* 添加一个层，否则文本框需要大于30px才能输入 */}
                    <AntdTable ref={ref => this.myTable2 = ref} columns={this.state.myTable2.columns}
                        toolbar='refresh;filter' rowselection='checkbox' pagesize={20} height="450" width="790"
                        contextmenu='' rownumber modal={true}
                        keyfield='customerid' keytitle='客户' sqlprocedure='demo304d'
                        onDoubleClick={(row, index) => this.handleSelectCustomerRow(row, index)}
                    />
                </div>
            </Modal>

            <Modal name='myWin2' title='商品选择' open={this.state.myWin2} width={725} forceRender centered maskClosable={false}
                className="custom-modal" cancelText='关闭' onCancel={() => { this.setState({ myWin2: false }) }}
                styles={{
                    position: 'relative', padding: 0, body: {
                        border: '1px solid #ccc', overflow: 'hidden', height: '400px',
                        width: '700px', padding: 0, margin: 0
                    }
                }}
                closable keyboard={false} footer={[<Button key='btnok' type='primary' htmltype='submit' onClick={() => this.handleSelectProductRow(this.myTable3?.state.row)}>选择</Button>,
                <Button key='btnclose' type='primary' onClick={() => { this.setState({ myWin2: false }) }}>关闭</Button>]}>
                <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>  {/* 添加一个层，否则文本框需要大于30px才能输入 */}
                    <AntdTable ref={ref => this.myTable3 = ref} columns={this.state.myTable3.columns}
                        height="400" width="700" rowheight='32'
                        showQuickJumper={false} showSizeChanger={false}
                        xtoolbar='filter' rowselection='checkbox' pagesize={20}
                        contextmenu='' rownumber modal={true}
                        keyfield='productid' keytitle='商品' sqlprocedure='demo503a'
                        onDoubleClick={(row, index) => this.handleSelectProductRow(row, index)}
                    />
                </div>
            </Modal>


            <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteRow.bind(this)} />
        </>)
    }
}
