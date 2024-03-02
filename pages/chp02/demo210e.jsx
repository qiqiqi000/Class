import React, { Component, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, useParams, NavLink, Link }  from "react-router-dom";

export default function Page210e(props){
  let params = useLocation();  //可以是json对象
  let {isbn, title, book} = params.state;
  console.log(book)
  return(
    <div style={{margin: 10}}>
      <p>Page210e函数组件(使用state传递参数)</p>
      <p>图书编码：{isbn}</p>
      <p>图书名称：{title}</p>
      <p>出版社：{book.publisher.companyname}</p>
      <p>出版日期：{book.pubdate}</p>
      <p>单价：{book.price}</p>      
      <NavLink to="/demo210">NavLink跳转返回主页</NavLink>      
    </div>
  )
}
   