import React from 'react';
import data from '../../data/employees.json';
import orderData from '../../data/orders.json';
import productData from '../../data/products.json';
export default class Demo125 extends React.Component {
  render() {   
    //在汇总出每个订单销售额的基础上进行订单过滤
    let filteredOrders = orderData.filter((elem)=>{ //回调函数中的参数名称不要重复
        let items = elem.items;
        /*
        //使用forEach计算某个订单销售额的汇总值
        let sum = 0;        
        items.forEach((item) => { //回调函数中的参数名称不要重复
           sum += parseFloat( (item.quantity*item.unitprice*(1-item.discount)).toFixed(2) ); //toFixed(2)之后变成字符型
        })
        */
        //使用reduce计算某个订单销售额的汇总值
        let sum = items.reduce((total, item) => { //回调函数中的参数名称不要重复
           return total+ item.quantity*item.unitprice*(1-item.discount);
        }, 0);
        elem.amount = parseFloat(sum.toFixed(2));
        if (sum>100000) return true;  //返回true，表示这个元素被筛选出来的。继续遍历，不会退出
        else return false;  //返回false，表示这个元素不被筛选出来。继续遍历，不会退出
    });
    console.log(filteredOrders);
    //按销售额降序排序
    filteredOrders.sort((a,b)=>{
      return b.amount - a.amount;
    });
    console.log(filteredOrders);    

    //2）根据商品JSON对象数组products.json，在订单数组orders.json中找到销售明细中包含“雪花啤酒”这个商品的第一条订单的信息。
    let order;
    //根据商品名称检索得到商品编码
    let product = productData.find((item) => item.productname == '雪花啤酒');    
    if (product){ //找到商品编码
      let productid = product.productid;
      //用some循环遍历每个订单
      let flag = orderData.some((row, index) => {  
        //循环遍历订单中的每个销售明细中的商品
        let rowno = row.items.findIndex((item)=> item.productid == productid);
        if (rowno >=0 ) {
          order = row;  //保存订单
          return true;  //利用some退出循环遍历
        }
      });
      console.log('found order=', order)
    }

    return (  //输出各个元素变量    
      <div>
         <ul>
           {filteredOrders.map((item, index) => <li key={index}>{'订单编号：'+item.orderid+',订单日期：'+item.orderdate+',客户编码：'+item.customerid+',销售额：'+item.amount}</li>)}
         </ul>
         <div style={{marginLeft:20}}>第一条包含“雪花啤酒”的订单信息
            <div>订单编号: {order.orderid}</div>
            <div>订单日期: {order.orderdate}</div>
            <div>客户编码: {order.customerid}</div>
            <div>销售额: {order.amount}</div>
            <ul>第一条订单信息的明细销售记录
              { order.items.map((item, index) => 
              <li key={'item_'+index}>
                {'商品编码：'+item.productid+',销售量：'+item.quantity+',销售单价：'+item.unitprice+',折扣：'+item.discount}
              </li>) }
            </ul>
         </div>
      </div>
    )
  }
}
