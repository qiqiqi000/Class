import React from 'react';
import { myLocalTime } from '../../api/functions.js';
import orderData from '../../data/orders.json';
import orderitemData from '../../data/orderitems.json';
import customerData from '../../data/customers.json';
export default class Demo134 extends React.Component {
  state = {

  }
  render() {
    //1.在orderitems中使用json对象汇总每个订单的销售额
    let t21=myLocalTime().ms;
    //求每个订单的销售额
    let orderAmount = {};   //每个订单的销售额汇总
    //orderAmount.10248=18818.10, orderAmount.10249	= 38875.92, orderAmount.10250=21342.00, orderAmount.10251=35493.00这种形式
    orderitemData.forEach((item)=>{
      if (!orderAmount[item.orderid]) orderAmount[item.orderid] = 0;
      orderAmount[item.orderid] += item.amount;
      //orderAmount[item.orderid] = (orderAmount[item.orderid] ?? 0) + item.amount;
    });
    //console.log(111, orderAmount)

    //2.求每个客户的销售额
    let customerAmount = {};   //每个订单的销售额汇总
    //customerAmount.GDZYYL=2173792.77,  customerAmount.BJLCWT=14386439.14这种形式
    //没有orderitems没有客户的编码，但是可以根据orderid得到客户编码，先把每个订单的客户编码求出来，设一个orderCustomer对象
    let orderCustomer={};
    //orderCustomer.10248='GDZYYL', orderCustomer.10249='BJLCWT', orderCustomer.10250='BJHLLG' 类似于这种形式
    orderData.forEach((item)=>{
       orderCustomer[item.orderid] = item.customerid;
    });
    //console.log(211, orderCustomer)
    //有了每个订单的客户编码，再在orderitems求客户与商品的汇总值
    orderitemData.forEach((item)=>{
        let customerid = orderCustomer[item.orderid];   //求出每个订单的客户编码
        if (!customerAmount[customerid]) customerAmount[customerid]=0;
        customerAmount[customerid]+=item.amount;
    });
    //console.log(212, customerAmount)

    //3.求每个客户每个商品的销售额
    let customerProductAmount = {};
    //用一个对象customerProductAmount={}，两层json，相当于二维数组，例如
    /*
    customerProductAmount.AHDTSM.2=9285.12
    customerProductAmount.AHDTSM.4=23868.00
    customerProductAmount.AHDTSM.5=7282.80
    customerProductAmount.AHDTSM.6=4850.40
    ...
    customerProductAmount.AHPPSP.3=11216.48
    customerProductAmount.AHPPSP.7=1899.50
    customerProductAmount.AHPPSP.9=3279.65
    ...
    */
    orderitemData.forEach((item)=>{
       let customerid = orderCustomer[item.orderid];   //求出每个订单的客户编码
       let productid = item. productid;
       if (!customerProductAmount[customerid]) customerProductAmount[customerid] = {};
       if (!customerProductAmount[customerid][productid]) customerProductAmount[customerid][productid] = 0;
       customerProductAmount[customerid][productid] += item.amount;
    });
    let t22=myLocalTime().ms;
    console.log(22, t22-t21)
    console.log(213, customerProductAmount)


    let items= [{"quantity": 195, "productid": 3, "unitprice": 20.55}, {"quantity": 290, "productid": 3, "unitprice": 19.55}, {"quantity": 175, "productid": 3, "unitprice": 20.70}, {"quantity": 170, "productid": 2, "unitprice": 41.70}, {"quantity": 310, "productid": 1, "unitprice": 30.70}, {"quantity": 160, "productid": 1, "unitprice": 29.50}, {"quantity": 265, "productid": 1, "unitprice": 31.50}, {"quantity": 235, "productid": 3, "unitprice": 20.60}, {"quantity": 200, "productid": 2, "unitprice": 41.70}, {"quantity": 235, "productid": 2, "unitprice": 42.50}, {"quantity": 165, "productid": 3, "unitprice": 20.45}, {"quantity": 170, "productid": 3, "unitprice": 19.50}, {"quantity": 185, "productid": 1, "unitprice": 30.55}, {"quantity": 165, "productid": 1, "unitprice": 30.25}, {"quantity": 215, "productid": 3, "unitprice": 18.30}];
    let total = items.reduce((result, item) => {
      result += item.unitprice * item.quantity;
      return result;
    }, 0);
    console.log('销售额汇总值:', total);

    let productAmount = items.reduce((result, item) => {
      const amount = item.unitprice * item.quantity;
      if (!result.hasOwnProperty(item.productid)) result[item.productid] = 0;
      result[item.productid] += amount;
      return result;
    }, {});
    console.log('每个商品销售额汇总值:', productAmount);    

    return (  //输出各个元素变量    
      <div>
        每个客户每个月份的销售额
      </div>
    )
  }
}
