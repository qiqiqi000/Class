import React, { Component } from 'react'
import { Link, Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import { navigateCom } from '../../api/functions.js'
import { setCookie, getCookie, deleteCookie } from '../../api/functions.js'
//import Page210a from './Page210a';
//import Page210b from './Page210b';
export default class Page210 extends Component {
   constructor(props) {
     super(props);
     this.handleClick5 = this.handleClick5.bind(this);     
     this.state = {
       book: { 
         isbn: "978-7-04-059125-5", 
         title: "数据库系统概论", 
         authors: [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'杜小勇',gender:'男', unit:'中国人民大学理工学科建设处'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}],
         publisher: {
            companyname: "高等教育出版社",
            address: "北京市丰台区成寿寺路11号",
            phone: "010-58581118",
            homepage: "www.hep.com.cn"
         }, 
         pubdate: "2020-03-10",
         price: 59,
         hasEBook: true
       }
     }
   }
   turnpage = (page) => {
     //调用跳转到传入的page页面,使用localStorage和sessionStorage存储参数
      localStorage.setItem("title", "Learning React");
      localStorage.setItem("author", "zxywolf");
      let obj = {"title":"Learning React", "author":"zxywolf"}
      sessionStorage.setItem("book", JSON.stringify(obj));
      this.props.navigate('/' + page, {
        replace: true,
        state: {
          title:'Learning React',
          author:'zxywolf'
        }
      })
    }
    componentDidMount() {
      localStorage.clear();
      sessionStorage.clear();
      let book = JSON.parse(localStorage.getItem("book"));
      console.log(110,book);

    }
    /*
    setCookie =(name, value, days)=> {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookieValue;
    }
    
    getCookie = (name) => {
      console.log(document.cookie);
      const cookies = document.cookie.split('; ');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
          return cookie[1];
        }
      }
      return null;
    }
    */
    //3.在Routes组件中定义组件的路由地址和对应加载组件，在两个按钮中定义点击事件
    handleClick1 = () => {
      //使用问号?传递普通变量 
      window.location.href = '/demo210a?isbn=978-7-04-059125-5&title=数据库系统概论&price=59&hasEBook=true';
    }

    handleClick2 = () => {
      let book = JSON.parse(localStorage.getItem("book"));
      console.log(111,book);
      if (!book) book = {...this.state.book};
      //在打开页面之前把变量存储到localStorage中
      localStorage.setItem("isbn", book.isbn);
      localStorage.setItem("title", book.title);
      localStorage.setItem("book", JSON.stringify(book));
      this.setState({book});
      window.open('/demo210b', '_blank');
    }

    handleClick3 = () => {
      let book = JSON.parse(sessionStorage.getItem("book"));
      console.log(113,book);
      if (!book) book = {...this.state.book};
      //在打开页面之前把变量存储到sessionStorage中
      sessionStorage.setItem("book", JSON.stringify(book));
      //window.history.pushState(null, '', '/demo201c');
      this.setState({book});
      window.open('/demo210c', '_blank');
    }

    handleClick4 = () => {
      //设置cookie值带3个参数
      setCookie('isbn',  this.state.book.isbn, 7)
      setCookie('title', this.state.book.title, 7)
      setCookie('book', JSON.stringify(this.state.book), 7)      
      // const expirationDate = new Date();
      // expirationDate.setDate(expirationDate.getDate() + 7);
      // const cookieValue = 'book='+JSON.stringify(this.state.book)+'; expires='+expirationDate.toUTCString()+'; path=/';     
      // document.cookie = cookieValue;
      let link = document.createElement("a");
      link.href = "/demo210d";
      link.click();      
    }

    handleClick5 = (page) => {
      //const navigate = useNavigate();
      //this.props.history.push('/210d');
      this.props.navigate('/demo210d', {
        replace: true,
        state: {
          title:'Learning React',
          author:'zxywolf'
        }
      })      
    }

    handleClick7 = () => {
      let book = JSON.parse(localStorage.getItem("book"));
      console.log(119,book);
    }

    handleClick8 = () => {
      let book = JSON.parse(sessionStorage.getItem("book"));
      console.log(118,book);
    }
    
    handleClick9 = () => {
      let book = getCookie('book');
      if (book) book = JSON.parse(book);
      console.log(121,book);
      console.log(122,book.price, book.pubdate);
    }
    
    render() {
      let {book} = this.state;
      return (
        <div style={{margin:10}}>
           <h3>页面跳转</h3>          
           <p>Page210b-子页面跳转(使用localStorage传递参数)</p>
           <p>图书编码：{book.isbn}</p>
           <p>图书名称：{book.title}</p>
           <p>出版社：{book.publisher.companyname}</p>
           <p>出版日期：{book.pubdate}</p>
           <p>单价：{book.price}</p>
           <hr/>
           <div style={{marginTop:10}}><button onClick={this.handleClick1.bind(this)}>window.location页面跳转问号传递参数210a</button></div>
           <div style={{marginTop:10}}><button onClick={this.handleClick2.bind(this)}>window.open打开新标签页localStorage传递参数210b</button></div>
           <div style={{marginTop:10}}><button onClick={this.handleClick3.bind(this)}>window.open打开新标签页sessionStorage传递参数210c</button></div>
           {/* <div><Link to="/demo210d?name=zxywolf&age=26">Link跳转至子页面demo210d</Link></div> */}
           <div style={{marginTop:10}}><button onClick={this.handleClick4.bind(this)}>超链接打开新标签页传递cookie参数210d</button></div>
           <div style={{marginTop:10}}><a href="/demo303" target="_blank">超链接打开新标签页303</a></div>
           <div style={{marginTop:10}}><Link to="/demo210e" state={{ isbn: book.isbn, title: book.title, book: book }}>Link+state参数传递给函数组件210e</Link></div>
           <div style={{marginTop:10}}><Link to="/demo210f" state={{ isbn: book.isbn, title: book.title, book: book }}>Link+state参数传递给类组件210f</Link></div>
           <hr/>          
           <button style={{margin:10}} onClick={this.handleClick7}>显示localStorage数据</button>
           <button style={{margin:10}} onClick={this.handleClick8}>显示sessionStorage数据</button>
           <button style={{margin:10}} onClick={this.handleClick9}>显示Cookie数据</button>
        </div>
    );
  }
}

