import React from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
//import ButtonGroup from 'antd/es/button/button-group';
const { Header, Content, Footer, Sider } = Layout;
//函数实现非路由组件编程式跳转功能
const buttonStyle = {
   marginTop: 10, marginLeft: 8, width: 180, height: 30, textAlign: 'center'
}
const linkStyle = {
   marginTop: 10, width: 180, height: 25, textAlign: 'center'
}

export default function Page202() {
   const navigate = useNavigate();
   const handleClick = (page) => {
      //navigate('/demo701');
      navigate('/' + page);
   }

   return (
      <Layout>
         <Sider theme='light' width={200} style={{ height: '100%', position: 'relative', borderRight: '1px solid #95B8E7' }}>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("demo701")}>实例701</Button></div>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("demo702")}>实例702</Button></div>
            <div><Button type="primary" style={buttonStyle} onClick={() => handleClick("demo703")}>实例703</Button></div>

            <div style={{...linkStyle, marginTop:30}}><Link to="/demo304">实例304</Link></div>
            <div style={linkStyle}><Link to="/demo305">实例305</Link></div>
            <div style={linkStyle}><Link to="/demo306">实例306</Link></div>
            <div style={linkStyle}><Link to="/demo307">实例307</Link></div>
            <div style={linkStyle}><Link to="/demo308">实例308</Link></div>

         </Sider>
         <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
            <Routes>
               <Route key="route_701" path="demo701/*" element={React.createElement(require("../chp07/demo701").default)} />
               <Route key="route_702" path="demo702/*" element={React.createElement(require("../chp07/demo702").default)} />
               <Route key="route_703" path="demo703/*" element={React.createElement(require("../chp07/demo703").default)} />

               <Route key="route_304" path="demo304/*" element={React.createElement(require("../chp03/demo304").default)} />
               <Route key="route_305" path="demo305/*" element={React.createElement(require("../chp03/demo305").default)} />
               <Route key="route_306" path="demo306/*" element={React.createElement(require("../chp03/demo306").default)} />
               <Route key="route_307" path="demo307/*" element={React.createElement(require("../chp03/demo307").default)} />
               <Route key="route_308" path="demo308/*" element={React.createElement(require("../chp03/demo308").default)} />
            </Routes>
         </Content>
      </Layout>
   );
}
