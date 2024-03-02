import React, { useEffect,useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import {reqdoSQL} from './../../api/functions';
import { Button, Dropdown, Form, Input, Layout, Menu, Modal, Rate, Select, Space, Table,theme} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
const { Header, Content, Footer, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
  key:'m'+key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `ysub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: 'x'+subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const pcolumns=[
    {
        title:"商品编码",
        dataIndex:"productid",
        key:"productid"
    },
    {
        title:"商品名称",
        dataIndex:"productname",
        key:"productname"
    },
    {
        title:"英文名称",
        dataIndex:"englishname",
        key:"englishname"
    },
    {
        title:"类别编码",
        dataIndex:"categoryid",
        key:"categoryid"
    },
    {
        title:"单价",
        dataIndex:"unitprice",
        key:"unitprice"
    }
];

const P_layout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [pdata,setPdata]=useState([]);
  useEffect(()=>{
    (async ()=>{
        let p={};
        p.selectsql="select * from products";
        let rs=await reqdoSQL(p);
        
        setPdata(addKeys(rs.rows,"productid"));
    })();
},[]);

const addKeys=(arr,id)=>{
  return arr.map((item,index)=>{
      return {...item,key:item[id]};
  })
}
  
  const headHeight=10;
  const footHeight=10;
  const bodyHeight=100-headHeight-footHeight;
  return (
    <Layout>
      <Header className="header" style={{position:"sticky",padding:0,background:"#ddd",top:0,left:0,width:"100%",height:`${headHeight}vh`}}>
        Header 
      </Header>
      <Content style={{position:"relative",left:0}}>
        <Layout>
          <Sider width={300} style={{background:colorBgContainer,height:`${bodyHeight}vh`,overflow:"auto"}}>
            {/* sider的背景颜色默认和header一样是dark     */}
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
              }}
              items={items2}
            />
          </Sider>
          <Content style={{height:`${bodyHeight}vh`,overflow:"auto"}}>
            {/* sider和content一起把外面的content撑起来 */}
            <Table dataSource={pdata} columns={pcolumns} pagination={{position:['bottomCenter']}} scroll={{y:340}}></Table>
          </Content>
        </Layout>
      </Content>
      <Footer style={{height:`${footHeight}vh`,background:"#ddd",padding:0,position:"absolute",bottom:0,left:0,width:"100%"}}>
      Footer
      </Footer>
    </Layout>
  );
};
export default P_layout;