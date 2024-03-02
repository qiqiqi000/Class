import React, { Component, useState } from "react";
import { Tree, Cascader, Table, Pagination,List, Layout, Menu, Form, Button, ConfigProvider } from 'antd'
import { reqdoSQL, reqdoTree } from '../../api/functions.js';
import { AntTextBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntLabel } from '../../api/antdComponents.js'
const { Header, Footer, Sider, Content } = Layout;
export default class Page801 extends Component {
    constructor(props) {
        super(props);
        //在这里初始化 state
        this.state = {
          pageNumber: 1, 
          pageSize: 10,
          columns: [
            {
                title: '商品编码',
                dataIndex: 'productid',
                key: 'productid',
                width: 95,
                align: 'center',
                fixed: true,
            }, {
                title: '商品名称',
                dataIndex: 'productname',
                key: 'productname',
                width: 160,
                align: 'center',
                fixed: true,
                }, {
                    title: '英文名称',
                    dataIndex: 'englishname',
                    key: 'englishname',
                    width: 220,
                    align: 'center'
                }, {
                    title: '规格型号',
                    dataIndex: 'quantityperunit',
                    key: 'quantityperunit',
                    width: 110,
                }, {
                    title: '计量单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    width: 90,
                    align: 'center',
                }, {
                    title: '单价',
                    dataIndex: 'unitprice',
                    key: 'unitprice',
                    width: 75,
                }, {
                    title: '供应商编码',
                    dataIndex: 'supplierid',
                    key: 'supplierid',
                    width: 105,
                    align: 'center',
                },{
                    title: '供应商名称',
                    dataIndex: 'suppliername',
                    key: 'suppliername',
                    width: 250,
                    align: 'center',
                },{
                    title: '供应商地址',
                    dataIndex: 'address',
                    key: 'address',
                    width: 295,
                    align: 'center',
                },{
                    title: '类别编码',
                    dataIndex: 'categoryid',
                    key: 'categoryid',
                    width: 90,
                    align: 'center',
                },{
                    title: '类别名称',
                    dataIndex: 'categoryname',
                    key: 'categoryname',
                    width: 95,
                    align: 'center',
            }],
            data:[]
        }
    }
    async componentDidMount() { //初始状态时提取第1页数据
        this.loadData();
    }

    loadData = async () => { //加载每页数据
        const { pageNumber, pageSize } = this.state;
        let p = {};
        p.sqlprocedure = 'demo503a';
        p.keyvalue = ''
        p.filter='';
        p.pageno = pageNumber
        p.pagesize = pageSize
        let rs = await reqdoSQL(p); //调用函数，执行存储过程
        this.setState({ data: rs.rows });
        // console.log(11111,p,rs.rows);
    }

    handleSearchFilter = async () => {
      //
    }
    render() {
        const { data, pageSize, total, pageNumber } = this.state
        return (
          <Layout >
            <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
              <Form name='filterbar'><AntTextBox params='filtertext,快速过滤,72,0,16,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} /></Form>
            </Header>
            <Content style={{overflow:'hidden'}}>
            <div>
                < Table dataSource={this.state.data} columns={this.state.columns} 
                style={{overflow:'auto',position:'absolute',height:'100%'}} rowKey='productid' sticky 
                  scroll={{ x:'90%' }} 
                  pagination={{ position: ['bottomLeft'], showQuickJumper: true, pageSize, 
                  total, current: pageNumber }}/>
            </div>
            </Content>
            </Layout>
        )
    }
}