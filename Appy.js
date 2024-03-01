import React from 'react';
import { Route, Routes, useNavigate} from 'react-router-dom';
import { Button, Layout} from 'antd';
//import ButtonGroup from 'antd/es/button/button-group';
const { Header, Content, Footer, Sider } = Layout;
//函数实现非路由组件编程式跳转功能
const buttonStyle={
  marginTop:10, marginLeft:8, width:180, height:30 
}
export default function App() {
  const navigate = useNavigate();
  const handleClick = (page) => {
    navigate('/'+page);
  }
  return (
      <Layout>
         <Sider theme='light' width={200} style={{margin:0, padding:0, height:'100%', position:'relative', marginLeft:0, padding:0, borderRight:'1px solid #95B8E7'}}>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("Page701")}>实例701</Button></div>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("Page702")}>实例702</Button></div>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("Page703")}>实例703</Button></div>
         </Sider>
         <Content style={{width:'100%', height:'100%', position:'relative', marginLeft:3, borderLeft:'1px solid #95B8E7', overflow:'auto'}}>
            <Routes>
               <Route key="route_701" path="Page701/*" element={React.createElement(require("./pages/chp07/demo701").default)} />
               <Route key="route_702" path="Page702/*" element={React.createElement(require("./pages/chp07/demo702").default)} />
               <Route key="route_703" path="Page703/*" element={React.createElement(require("./pages/chp07/demo703").default)} />
            </Routes>
         </Content>
      </Layout>
    );
  }
