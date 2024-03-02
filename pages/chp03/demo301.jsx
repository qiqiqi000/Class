import React, { Component } from 'react'
import axios from 'axios';  
export default class Page301 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }      
  ajax = async (url, data={}, type='GET') => {
     return new Promise((resolve, reject) => {
       let promise;
       // 1. 执行异步ajax请求
       if (type==='GET'){ //发GET请求
         promise = axios.get(url, {params: data});
       }else{ // 发POST请求
         promise = axios.post(url, data);
       }
       promise.then(response => { //2.如果成功了, 调用resolve(value)
         resolve(response.data);
       }).catch(error => { //3.如果失败,不调用reject(reason), 而是提示异常信息。
         // reject(error)
         console.log('请求出错了: ' + error.message)
       })
     });  
   }
   // 请求登陆接口
   // ajax('/login', {username: 'Tom', passsword: '12345'}, 'POST').then()
   // 添加用户
   // ajax('/manage/user/add', {username: 'Tom', passsword: '12345', phone: '13712341234'}, 'POST').then()
   async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
     let p={};
     p.sqlprocedure = 'demo301a';
     p.unitprice1 = 10;
     p.unitprice2 = 20;
     let url = '/myServer/doSQL?paramvalues=' + JSON.stringify(p)
     let rs = await this.ajax(url, {}, 'POST');  //使用与异步配套的await
     this.setState({data:rs.rows});   
  }   
  render() { 
    return (
      <div>       
        <ul>
           {this.state.data.map((item,index) => 
              <li key={"a_"+index}>{item.productid}，&nbsp;{item.productname}，&nbsp;{item.unitprice}</li>
            )
          }
        </ul>  
     </div>
    )
  }
}