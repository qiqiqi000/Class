import React, { Component } from 'react';
import { Route, Routes, useNavigate  } from 'react-router-dom'
import { useLocation, useHistory } from 'react-router-dom'
//import { navigateCom } from '../../api/functions.js'
//import Page210 from './Page210';

export default class Page210a extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isbn: '',
      title: '',
      price: 0,
      isEBook: true,      
    }
  }

  /*
   let title = localStorage.getItem("title");
   let author = localStorage.getItem("author");
   let book = sessionStorage.getItem('book');
   console.log('page210a返回', title,author);
   console.log('page210a返回', book);
   //修改title,author的值
   let obj = {"title":"React in Action","author":"Thomas"}
   sessionStorage.setItem("book", JSON.stringify(obj));
   localStorage.setItem("title", "React in Action");
   localStorage.setItem("author", "Thomas");
  */
  componentDidMount(){    
    const queryString = window.location.search;
    //使用URLSearchParams解析查询字符串
    const params = new URLSearchParams(queryString);
    //获取参数值
    let isbn = params.get('isbn');
    let title = params.get('customerid');
    let price = params.get('price');
    let hasEBook = params.get('hasEBook');
    if (hasEBook === 'true') hasEBook = true;
    else hasEBook = false;
    this.setState({isbn, title, price, hasEBook})
  }

  handleClick=()=>{
    // 在子页面中使用 window.location.href 返回主页面
    window.location.href = '/demo210';
    // 在子页面中使用 window.history 返回主页面
    //window.history.back(); // 返回上一页，相当于返回主页面
  }
  render() {
    let {isbn, title, price, hasEBook} = this.state;
    return (<div>
      <h3>Page210a-子页面跳转</h3>
      <p>图书编码：{isbn}</p>
      <p>图书名称：{title}</p>
      <p>单价：{price}</p>
      <p>是否电子图书：{hasEBook? '是':'否'}</p>
      <div>
         <button onClick={() => window.history.back()}>返回主页</button>
      </div>
    </div>)
  }
}
