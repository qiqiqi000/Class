import React, { Component } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { navigateCom } from '../../api/functions.js'

export default class Page210c extends Component {

  handleClick1=()=>{
    //修改单价和出版日期
    let book = JSON.parse(sessionStorage.getItem('book'));
    console.log(333, book);
    book.pubdate = "2010-12-31";
    book.price = 100;
    sessionStorage.setItem('book', JSON.stringify(book));
    //book = JSON.parse(sessionStorage.getItem('book'));
    //console.log(334, book);
  }

  handleClick2=()=>{
    //window.close();
    window.location.href = '/demo210';
  }

  render() {
    let book = JSON.parse(sessionStorage.getItem('book'));
    console.log('book object', book);
    return (
      <div>
        <p>Page210c-子页面跳转(使用sessionStorage传递参数)</p>
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


// import { Link } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';

// export default function MyComponent() {
//   //npm install react-router-dom
//   const history = useHistory();

//   const handleClick1=()=>{
//     //修改单价和出版日期
//     let book = JSON.parse(localStorage.getItem('book'));
//     book.pubdate = "2023-01-31";
//     book.price = 80;
//     localStorage.setItem('book', JSON.stringify(book));
//     console.log(999,book);
//     //window.close();
//     //window.location.href = '/demo210';
//   }

//   const handleClick2 = () => {

//     history.push('/demo201');
//   };
//   return (<>
//         <p>图书编码：{book.isbn}</p>
//         <p>图书名称：{book.title}</p>
//         <p>出版社：{book.publisher.companyname}</p>
//         <p>出版日期：{book.pubdate}</p>
//         <p>单价：{book.price}</p>

//     <button onClick={handleClick1}>修改数据</button>
//     <button onClick={handleClick2}>跳转到主页</button>
//     </>
//   );
// }


