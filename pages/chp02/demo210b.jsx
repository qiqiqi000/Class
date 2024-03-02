import React, { Component } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { navigateCom } from '../../api/functions.js'

export default class Page210b extends Component {
  handleClick1=()=>{
    //修改单价和出版日期
    let book = JSON.parse(localStorage.getItem('book'));
    book.pubdate = "2023-01-31";
    book.price = 80;
    localStorage.setItem('book', JSON.stringify(book));
    console.log(999,book);
    //window.close();
    //window.location.href = '/demo210';
  }
  handleClick2=()=>{
    window.close();
    //window.location.href = '/demo210';
  }

  render() {
    let isbn = localStorage.getItem('isbn');
    let title = localStorage.getItem('title');
    let book = JSON.parse(localStorage.getItem('book'));
    console.log('isbn:', isbn);
    console.log('title:', title);
    console.log('book object', book);
    return (
      <div>
        <p>Page210b-子页面跳转(使用localStorage传递参数)</p>
        <p>图书编码：{book.isbn}</p>
        <p>图书名称：{book.title}</p>
        <p>出版社：{book.publisher.companyname}</p>
        <p>出版日期：{book.pubdate}</p>
        <p>单价：{book.price}</p>
        <div>
          <button onClick={this.handleClick1}>修改数据</button>          
          <button onClick={this.handleClick2}>返回主页</button>          
        </div>
      </div>
    )
  }
}
