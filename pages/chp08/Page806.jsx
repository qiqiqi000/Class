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

export default class Page806 extends MyFormComponent {
    state = {
        myTree1: {
            keyfield: 'categoryid',
            treewidth: 320,
            node: {},  //当前myTree1树中选中的结点
        },
        myTree2: {
            keyfield: 'categoryid',
            node: {},  //当前myTree1树中选中的结点
        },
        resizing: false,
    }

    componentDidMount = async () => {
        //this.myTable1.setState({});
        let node = {};
        node.key = '_root';
        this.handleSelectNode(node);
    }

    handleSelectNode = async (node) => { //选中树节点事件
        //console.log(188,this.myTree1.state.node)
    }

    handleRefresh = () => {

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
                            icon={<PaperClipOutlined />} blockNode={true}
                            onSelectNode={(key, e) => this.handleSelectNode(e.node)}  /*自定义属性*/
                            sqlprocedure="demo803a" filterprocedure="demo804e" loadall="true"
                            //sqlprocedure="demo803a" filterprocedure="demo804e" loadall="true"
                            root="全部类别" filter='truex' />
                    </Sider>
                </Resizable>
                <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
                    <AntdTree ref={ref => this.myTree1 = ref} style={{ overflow: 'hidden' }}
                        blockNode={false}
                        switcherIcon={<DownOutlined /> }
                        onSelectNode={(key, e) => this.handleSelectNode(e.node)}  /*自定义属性*/
                        sqlprocedure="demo806b" loadall="false"
                        filter='truex' />

                </Content>
            </Layout>

        </>);
    }
}
