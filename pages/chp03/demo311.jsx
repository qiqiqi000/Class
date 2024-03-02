import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { reqdoSQL } from '../../api/functions';
//import ButtonGroup from 'antd/es/button/button-group';
const { Header, Content, Footer, Sider } = Layout;
//函数实现非路由组件编程式跳转功能
const buttonStyle = {
   marginTop: 10, marginLeft: 8, width: 180, height: 30
}
export default function Page310() {
   const [menus, setMenus] = useState([]);   
   const [routes, setRoutes] = useState([]);   
   const navigate = useNavigate();
   const handleClick = (page) => {
      //navigate('/demo701');
      
      navigate('/' + page);
   }

   useEffect(async () => {
      let p = {}
      p.sqlprocedure = 'app04';
      let rs = await reqdoSQL(p);
      let xmenus=[];
      let xroutes=[];
      rs.rows.forEach((item,index) => {
        let tmp = item.url.split('/');
        let page = tmp.pop();
        let url = tmp.pop()+'/'+page;
        //pages/chp03/demo304
        //let url = "../"+tmp.pop()+'/'+page
        console.log(page,url);
        //<Route key="route_701" path="demo701/*" element={React.createElement(require("../chp07/demo701").default)} />
        xroutes.push(<Route key={"route_"+item.key} path={page+"/*"} element={React.createElement(require("../"+url).default)} />)
        //生成菜单
        if (item.title!=''){
          //<div><Button type="primary" style={buttonStyle} onClick={() => handleClick("demo702")}>实例702</Button></div> */}
          xmenus.push(<div key={"menu_"+item.key}><Button type="primary" style={buttonStyle} onClick={() => handleClick(page)}>{item.text}</Button></div>)
          //<div style={linkStyle}><Link to="/demo305">实例305</Link></div>
        }
      });
      setMenus(xmenus); 
      setRoutes(xroutes);  
   }, [])

   return (
      <Layout>
         <Sider theme='light' width={200} style={{ height: '100%', overflow:'auto', position: 'relative', borderRight: '1px solid #95B8E7' }}>
           {menus}
         </Sider>
         <Content style={{ width: '100%', height: '100%', position: 'relative', marginLeft: 3, borderLeft: '1px solid #95B8E7', overflow: 'auto' }}>
          <Routes>
             {routes}
           </Routes>
         </Content>
      </Layout>
   );
}