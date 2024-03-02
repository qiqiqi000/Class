//npm install antd@5.10.2   //升级antd

import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'rc-easyui/dist/themes/default/easyui.css';
//import 'rc-easyui/dist/themes/material-teal/easyui.css';
import 'rc-easyui/dist/themes/icon.css';
import 'rc-easyui/dist/themes/react.css';
import { LocaleProvider } from 'rc-easyui';
import zh_CN from 'rc-easyui/dist/locale/easyui-lang-zh_CN';
import locale from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import './css/style.css';
//import data from './data/pinyin.json';
//import {reqdoSQL} from './api/functions.js'
//import '../node_modules/react-resizable/css/styles.css'; 
//import App from '././pages/chp02/demo202'; //定义菜单主控程序
//import App from '././pages/chp03/demo311'; //定义菜单主控程序
import App from './App.js'; //定义菜单主控程序
//easyui本地化<LocaleProvider locale={zh_CN}> 
//antd本地化<ConfigProvider locale={locale}>
//console.log(111,React.sys)
const sys = React.sys;
//console.log(991,sys.pinyin);
ReactDom.render(
  <BrowserRouter>
     <LocaleProvider locale={zh_CN}>
        <ConfigProvider locale={locale}>
           <App />  {/* 与import的菜单主控程序一致 */}
        </ConfigProvider>
     </LocaleProvider>
  </BrowserRouter>
, document.getElementById('root'))