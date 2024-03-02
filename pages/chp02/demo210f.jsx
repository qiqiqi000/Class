import React, { Component, useRef } from 'react';
import { NavLink, Link }  from "react-router-dom";

export default class Demo210f extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // 使用 this.props.location.state 访问传递的 state 数据
    const { isbn, title, book } = this.props.location.state;
    return (
      <div>
        <h1>类组件 Demo210e</h1>
        <p>ISBN: {isbn}</p>
        <p>Title: {title}</p>
        <p>Book: {book}</p>
      </div>
    );
  }
}

