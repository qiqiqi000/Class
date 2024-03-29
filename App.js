//0.导入路由组件
import { BrowserRouter } from "react-router-dom";
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { searchAllTreeNodes, myPreventRightClick, reqdoSQL, reqdoTree } from './api/functions.js'
import React, { useEffect, useState } from 'react';
import { RightOutlined, LeftOutlined, CopyOutlined, PaperClipOutlined, SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Layout, Menu, Modal, Rate, Select, Space, Table, theme, Image, Avatar } from 'antd';
//import { Resizable } from 'rc-easyui'; 
import { Resizable } from 'react-resizable';
import ButtonGroup from 'antd/es/button/button-group';
//import demo303a from '././pages/chp03/demo303a'; 
//https://www.runoob.com/js/js-switch.html
//https://blog.csdn.net/qq_36123470/article/details/119992858     menu样式设置
//https://github.com/react-grid-layout/react-resizable   组件下载npm install --save react-resizable
/*
npm install --save react-resizable
注意样式引入才有效果：
import '../node_modules/react-resizable/css/styles.css';
*/
//console.log(333,React.sys)
const sys = { ...React.sys };
//1.导入自定义的页面组件
var buttonstyle = {
  height: '28px',
  width: '230px',
  margin: '5px 0px 0px 4px'
}

//在index.css中将body这样设置 {margin: 0; padding:0;}！必须，否则屏幕100%时会有滚动条出现
const layoutStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  padding: 0,
  margin: 0,
  border: '1px solid #95B8E7',
  overflow: 'hidden'
};

const resizeHandle = {
  position: 'absolute',
  top: '0',
  right: '-3px', /* 使得把手稍微突出以便于拖动 */
  bottom: '0',
  width: '3px', /* 把手宽度 */
  cursor: 'ew-resize',
  backgroundColor: 'rgb(224,236,255)',
  zIndex: 10 /* 确保把手在最前面 */
}

const { Header, Content, Footer, Sider } = Layout;

function anonyCom(A) {
  return (props) => {
    let navigate = useNavigate();
    return <A {...props} navigate={navigate} />
  }
}

class App extends React.Component {
  state = {
    siderwidth: 260,
    treewidth: 260,
    resizing: false,
    collapsed: false,
    menus: [],
    pages: [],
    url: {} //记录每个菜单的url，菜单key中无法记录带路径的url
  }

  async componentDidMount() {
    myPreventRightClick();
    let p = {};
    p.style = "full";
    p.sqlprocedure = 'app02';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
    //console.log(rs.nodes);
    let rows = rs.rows;
    let menus = this.setAllTreeNodeIcons(rs.rows);
    let url = {};
    let pages = [];
    let k = 0;
    //rs.nodes是线性表结构
    for (let i = 0; i < rs.nodes.length; i++) {
      if (rs.nodes[i].url != undefined && rs.nodes[i].url != '') {
        let page = rs.nodes[i].url.split('/').pop();  //去掉文件所在的文件夹路径
        let index = page.lastIndexOf('.');
        if (index !== -1) page = page.substring(0, index); //去掉文件扩展名
        //console.log(rs.nodes[i].id,page)
        let item = {};
        item = {};
        item.id = rs.nodes[i].id;
        item.path = page + "/*";   //rs.nodes[i].url+"/*";          
        //item.element=require(""+rs.rows[i].children[j].url).default;  //必须加""
        item.url = "./" + rs.nodes[i].url;
        item.element = require("./" + rs.nodes[i].url).default;
        //console.log(99,"./pages/chp"+rs.rows[i].children[j].parentnodeid+"/"+rs.rows[i].children[j].url);
        //console.log(99, pages[k].url, pages[k].id);
        url[item.id] = page; //rs.nodes[i].url;
        pages.push(item);
        //console.log("./"+rs.nodes[i].url)
      }
      /*
      if (rs.nodes[i].submodules !=''){
        //添加submodules,用于其他子菜单中使用，不显示在主菜单中，但加载到项目中
        let page = rs.nodes[i].submodules.split('/').pop();  //去文件所在的文件夹路径
        pages[k] = {};
        pages[k].id = rs.nodes[i].id+'_'+k;
        pages[k].path = page + "/*";   //rs.nodes[i].url+"/*";          
        pages[k].url="./" + rs.nodes[i].submodules;
        pages[k].element = require("./" + rs.nodes[i].submodules).default;
        url[rs.nodes[i].key + '_' + k] = page; //rs.nodes[i].url;
        k++;
      }
      */
    }

    p = {};
    p.sqlprocedure = 'app03';
    rs = await reqdoSQL(p);
    for (let i = 0; i < rs.rows.length; i++) {
      let page = rs.rows[i].url.split('/').pop();  //去文件所在的文件夹路径
      let index = page.lastIndexOf('.');
      if (index !== -1) page = page.substring(0, index);
      let item = {};
      item = {};
      item.id = rs.rows[i].id;
      item.path = page + "/*";
      item.url = "./" + rs.rows[i].url;
      item.element = require("./" + rs.rows[i].url).default;
      url[item.id] = page;
      pages.push(item);
    }
    //console.log(111,JSON.stringify(pages));    
    //console.log(111,JSON.stringify(rs.rows));
    //console.log(112,JSON.stringify(pages));
    //console.log(111, menus);
    //console.log(112, pages);
    this.setState({ menus: menus, pages: pages, url: url });
  }

  turnpage = (page) => {
    //3.调用跳转到传入的page页面
    //console.log(555,page)
    this.props.navigate(page, {
      replace: true,
      state: {
        id: '111',
        title: '222'
      }
    })
  }

  setAllTreeNodeIcons = (arr) => { //
    arr.forEach((item) => {
      if (item.isparentflag == 0) item.icon = <CopyOutlined style={{ marginLeft: -20, marginRight: -4 }} />;  //<PaperClipOutlined/>;
      else item.icon = <RightOutlined style={{ marginLeft: -20 }} />
      if (item.children?.length > 0) {
        this.setAllTreeNodeIcons(item.children);
      }
    })
    return arr;
  }

  handleMenuClick = (e) => {
    //console.log(333,this.state.url[e.key]);
    let page = this.state.url[e.key];  //+e.key;
    this.turnpage(page);
  }

  //4.在Routes组件中定义组件的路由地址和对应加载组件，在两个按钮中定义点击事件
  setCollapsed = () => {
    let width;
    if (!this.state.collapsed) {
      width = 30;
      this.setState({ collapsed: !this.state.collapsed, siderwidth: width })
    } else {
      width = this.state.treewidth;
      if (width < 160) width = 160;
      this.setState({ collapsed: !this.state.collapsed, siderwidth: width, treewidth: width })
    }
    //console.log(width)
  }

  handleResize = (e) => {
    this.setState({ siderwidth: e.width, treewidth: e.width });
  }

  onResize = (event, { element, size }) => {
    if (!this.state.resizing) {
      this.setState({ resizing: true });
    }
    window.requestAnimationFrame(() => this.setState({ siderwidth: size.width }));
  };

  onResizeStop = () => {
    this.setState({ resizing: false });
  };

  render() {
    return (
      <Layout style={layoutStyle} >
        <Header theme='light' style={{ background:'#DCE2F1', paddingLeft:12, height:40, lineHeight:36, borderBottom: '1px solid #95B8E7' }}>
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            { className: 'trigger', onClick: () => this.setCollapsed() })
          }
          <label style={{ marginLeft: 12 }}>React+JavaScript、React+AntDesign、React+EasyUI在线学习系统</label>
        </Header>
        <Layout>
          {/* <Resizable onResizing={this.handleResize.bind(this)} minWidth={100} maxWidth={400}>
            <div style={{width:this.state.siderwidth}}> */}
          <Resizable width={this.state.siderwidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div style={resizeHandle} />} resizeHandles={['e']}>
            <Sider theme='light' width={this.state.siderwidth} collapsed={this.state.collapsed} collapsible={false}
              zeroWidthTriggerStyle={true} collapsedWidth={60} style={{ margin: 0, padding: 0, height: '100%', position: 'relative', marginLeft: 0, padding: 0, borderRight: '1px solid #95B8E7' }}>
              <Layout>
                <Header style={{ padding: 0, fontSize: '14px', background: sys.toolbarcolor, height: 35, lineHeight: '35px', borderRight: '1px solid #95B8E7', borderBottom: '1px solid #95B8E7' }}>
                  <SettingOutlined style={{ marginRight: 12, marginLeft: 10 }} /><b>菜单导航</b>
                </Header>
                <Content style={{ margin: 0, padding: 0, width: '100%', height: '100%', position: 'relative', borderRight: '1px solid #95B8E7' }} >
                  <Menu onClick={this.handleMenuClick.bind(this)} mode="inline" items={this.state.menus}
                    style={{ height: '100%', position: 'relative', overflow: 'auto' }} />
                </Content>
              </Layout>
            </Sider>
          </Resizable>
          {/* </div>
            </Resizable> */}
          <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
            <Routes>
              {this.state.pages.map((item, idx) => (
                <Route key={'route_' + item.id} path={item.path} element={React.createElement(item.element)} />
              ))
              }
            </Routes>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default anonyCom(App); //2.将组件包装成可编程式跳转的路由组件