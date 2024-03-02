import React, { Component } from 'react'
import { setCookie, getCookie, deleteCookie } from '../../api/functions.js'
import modalStyle from '../../css/modal.module.css';
export default class Page210d extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      openState : true
    };
  }

  /* 
  getCookie = (name) => {
    console.log(444,document.cookie);
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  }
 
  deleteCookie = (name) => {
    const expirationDate = new Date('2000-01-01'); // 设置一个过去的日期
    const cookieValue = `${name}=; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  }
  */

  handleConfirm=() => {
    //alert('点击了确定，页面返回');
    let book = getCookie('book');
    console.log(book);
    if (book){
      book=JSON.parse(book);
      book.price = 150;
      book.pubdate = '2010-12-1';
      setCookie('book', JSON.stringify(book), 7);
    }
    window.location.assign('/demo210');
  }

  render(){
    console.log(881, getCookie('isbn'))
    console.log(882, getCookie('title'))
    let book = getCookie('book');
    if (book) book=JSON.parse(book);
    return (
    <div>
      <button style={{width:80, height:30,margin:'30px 10px', color: '#fff',background: '#1677ff',border: 1,borderRadius: '5px',cursor: 'pointer'}} onClick={()=>this.setState({openState:true})}>弹窗</button>
      <Modal open={this.state.openState} width='400px' height='140px' title = '系统提示' message={"是否确认修改图书价格"} onConfirm={this.handleConfirm} >
        {/* <div>是否确认删除这个商品</div> */}
      </Modal>
    </div>      
    )
  }
}

//创建一个modal
export class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open : props.open
    }
  }
  componentDidUpdate =(prevProps,prevState) => {
     if (this.props.open !== prevState.open) {
       this.setState({
         open: this.props.open
       });
     }
  }

  closeModal = () => {
     this.setState({open:false})
  }

  render() {
    let {children, width, height, title, message, onConfirm} = this.props
    return (
      <div>
        <div className={modalStyle.background} style={{display:this.state.open?'block' : 'none'}} onClick={()=>this.closeModal()}></div>
        <div className={modalStyle.Modal} style={{display:this.state.open?'block' : 'none',width:width,height:height}}>
          <div className={modalStyle.ModalHeader}>
             <h3>{title}</h3>
             <span onClick={() => this.closeModal()}><svg t="1693827544488"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1471" width="12" height="12"><path d="M1022.583467 127.803733 894.779733 0 511.291733 383.4624 127.8464 0 0 127.803733 383.496533 511.274667 0 894.737067 127.8464 1022.5408 511.291733 639.0784 894.779733 1022.5408 1022.583467 894.737067 639.138133 511.274667Z" fill="#707070" p-id="1472"></path></svg></span>
          </div>
          <div className={modalStyle.ModalContent} >
             {message}
             {children}
          </div>
          <div className={modalStyle.ModalFooter}>
            <button onClick={()=>{onConfirm(); this.setState({open:false})}}>确定</button>
            <button onClick={()=>this.closeModal()}>取消</button>
          </div>
        </div>
      </div>
    );
  }
}
