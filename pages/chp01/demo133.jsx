import React from 'react';
import { myLocalTime } from '../../api/functions.js';
import orderData from '../../data/orders.json';
import orderitemData from '../../data/orderitems.json';
import customerData from '../../data/customers.json';
export default class Demo133 extends React.Component {
  state = {
    amounts: {},

  }
  render() {   
    //方法1
    //1.1 根据订单明细表汇总每个订单销售额汇总值，实现group by orderid功能
    let t11 = myLocalTime().ms;
    /*
    orderData.map((order, index)=>{
      let items = orderitemData.filter((item)=>item.orderid===order.orderid);
      order.amount = items.reduce(function (sumup, item) {
        return sumup + item.amount;
      }, 0);
      return(order);
    });
    let t2=myLocalTime().ms;
    */
    console.log(orderData);
    
    orderData.map((order, index)=>{
      order.amount = orderitemData.reduce(function (sumup, item) {
        if (item.orderid===order.orderid) return sumup + item.amount;
        else return sumup;
      }, 0);
      return(order);
    });
    let t12 = myLocalTime().ms;
    //console.log(orderData);
    console.log(81,t12-t11);
    //console.log(orderData);
    //1.2 根据订单表汇总每个客户销售额汇总值，实现group by customerid功能
    let html = [];
    customerData.forEach((item)=>{
      /*
      if (amountsx[item.customerid]){
        htmlx.push(<li key={item.customerid}>{item.customerid+','+ item.companyname+', 销售额：'+amountsx[item.customerid].toFixed(2)}</li>);
      }
      */
      let amount = orderData.reduce(function (sumup, order) {
        if (order.customerid === item.customerid) return sumup + order.amount;
        else return sumup;
      }, 0);
      //console.log(82,item.customerid,amount)
      if (amount!=0){
        html.push(<li key={item.customerid}>{item.customerid+','+ item.companyname+', 销售额：'+amount.toFixed(2)}</li>);
      }
    });
    let t13=myLocalTime().ms;
    console.log(88,t13-t11);

    //第二种方法
    //1.在orderitems中使用json对象汇总每个订单的销售额
    let t21=myLocalTime().ms;
    let ordersx = {};
    orderitemData.forEach((item)=>{
      //ordersx.10248
      // if (!ordersx[item.orderid]) ordersx[item.orderid] = item.amount;
      // else ordersx[item.orderid] += item.amount; 
      //if (!ordersx[item.orderid]) ordersx[item.orderid] = 0;
      //ordersx[item.orderid] += item.amount;      
      ordersx[item.orderid] = (ordersx[item.orderid] ?? 0) + item.amount;
    });
    //console.log(991, ordersx)
    //2.在orders中使用json对象汇总每个客户的销售额
    let amountsx = {};
    orderData.forEach((item)=>{
      //amountsx.AHDTSM=0
      //ordersx.10248
      if (!amountsx[item.customerid]) amountsx[item.customerid] = 0;
      amountsx[item.customerid] += ordersx[item.orderid];
    });
    //console.log(992, amountsx)
    let htmlx = [];
    customerData.forEach((item)=>{
      if (amountsx[item.customerid]){
        //amountsx.AHDTSM
        htmlx.push(<li key={item.customerid}>{item.customerid+','+ item.companyname+', 销售额：'+amountsx[item.customerid].toFixed(2)}</li>);
      }else {
        amountsx[item.customerid] = 0;
      }
      item.amount = amountsx[item.customerid];  //记录每个客户的销售额汇总值，这个值会返回到原来的customerData数组中
    });
    //console.log(993, htmlx)
    let t22=myLocalTime().ms;
    console.log(98,t22-t21);
    let t31=myLocalTime().ms;
    //客户销售排序，并记录时间
    customerData.sort((a, b) => b.amount - a.amount);
    //console.log(999,customerData)
    let htmly = [];
    let index = 1;
    for (let i=0; i<customerData.length; i++){
      let item = customerData[i];
      item.rank = index;
      if (i<customerData.length-1 && customerData[i+1].amount < customerData[i].amount) index ++;
      htmly.push(<li key={item.customerid}>{item.customerid+','+ item.companyname+', 销售额：'+item.amount?.toFixed(2)+', 排名：'+item.rank}</li>);
    };
    let t32=myLocalTime().ms;
    console.log(11,t32-t31);
    //console.log(999,customerData)



    return (  //输出各个元素变量    
      <div>
        排序之前
        <ol>{htmlx}</ol>
        排序之后
        <ul>{htmly}</ul>
        每个客户每个月份的销售额
      </div>
    )
  }
}
