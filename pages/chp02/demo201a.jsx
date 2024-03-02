import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'rc-easyui/dist/themes/default/easyui.css';
//import 'rc-easyui/dist/themes/material-teal/easyui.css';
import 'rc-easyui/dist/themes/icon.css';
import 'rc-easyui/dist/themes/react.css';
import { LocaleProvider } from 'rc-easyui';
import zh_CN from 'rc-easyui/dist/locale/easyui-lang-zh_CN';
import locale from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import '../../index.css'; 
import '../../css/style.css';
//import '../node_modules/react-resizable/css/styles.css';   
import App from './demo202.jsx'; //定义菜单主控程序
//easyui本地化<LocaleProvider locale={zh_CN}> 
//antd本地化<ConfigProvider locale={locale}>
ReactDom.render(  //渲染元素到DOM
  <BrowserRouter>
     <LocaleProvider locale={zh_CN}>
        <ConfigProvider locale={locale}>
           <App />  {/* 与import的菜单主控程序一致 */}
        </ConfigProvider>
     </LocaleProvider>
  </BrowserRouter>
, document.getElementById('root'))