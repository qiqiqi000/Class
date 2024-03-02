import React, { Component } from 'react'
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { reqdoSQL } from '../../api/functions';

const { Header, Content, Footer, Sider } = Layout;
//函数实现非路由组件编程式跳转功能
const buttonStyle = {
   marginTop: 10, marginLeft: 8, width: 280, height: 30
}
const linkStyle = {
  marginTop: 10, width: 280, height: 25, textAlign: 'center'
}

export default class Page310 extends Component {
  state={
    menus: [],
    routes: [],
  }

  handleClick = (page) => {
    //navigate('/demo701');    
  }

  async componentDidMount(){
    let p = {}
    p.sqlprocedure = 'app04';
    let rs = await reqdoSQL(p);
    let menus=[];
    let routes=[];
    rs.rows.forEach((item,index) => {
      let tmp = item.url.split('/');
      let page = tmp.pop();
      let url = tmp.pop()+'/'+page;
      //pages/chp03/demo304
      //let url = "../"+tmp.pop()+'/'+page
      console.log(page,url);
      //<Route key="route_701" path="demo701/*" element={React.createElement(require("../chp07/demo701").default)} />
      routes.push(<Route key={"route_"+item.key} path={page+"/*"} element={React.createElement(require("../"+url).default)} />)
      //生成菜单
      if (item.title!=''){
        //<div><Button type="primary" style={buttonStyle} onClick={() => handleClick("demo702")}>实例702</Button></div> */}
        //menus.push(<div key={"menu_"+item.key}><Button type="primary" style={buttonStyle} onClick={() => this.handleClick(page)}>{item.text}</Button></div>)
        //<div style={linkStyle}><Link to="/demo305">实例305</Link></div>
        menus.push(<div key={"menu_"+item.key} style={linkStyle}><Link to={"/"+page}>{item.text}</Link></div>)
      }
    });
    this.setState({menus, routes});    
  }
  render(){
    return (
      <Layout>
        <Sider theme='light' width={300} style={{ height: '100%', overflow:'auto', position: 'relative', borderRight: '1px solid #95B8E7'}}>
          {/* <div style={linkStyle}><Link to="/demo305">实例305</Link></div> */}
            {this.state.menus}
        </Sider>
        <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
            <Routes>
              {/* <Route key="route_701" path="demo701/*" element={React.createElement(require("../chp07/demo701").default)} /> */}
              {this.state.routes}
            </Routes>
        </Content>
      </Layout>
    );
  }
}