import React from 'react';
//从数据文件中提取数据是先导入文件
import employeeData from '../../data/employees.json';
import customerData from '../../data/customers.json';
import productData from '../../data/products.json';
function MyList(props){ 
    let {data, title, id} = props;
    let array=[];  //定义一个空数组
    data.forEach(function(item, index){
      array.push(<li key={id+'_'+index}>{Object.values(item).join(', ')}</li>);
    });
    return (
      <ul>
        {array}        
      </ul>
    )    
}

const Demo124 = () => {
  let data1 = employeeData.map(function(item, index){
    let age = new Date().getFullYear() - new Date(item.birthdate).getFullYear();
    let id=item.employeeid.trim().toLowerCase();
    let gender = (id.slice(-1) == 'f'? '女' : '男');
    return ({name:item.name, title:item.title, gender:gender, age:age});
  });
  //找到单价10个20元以下的商品就退出。
  let count = 0;
  let data2 = [];
  productData.some((item, index)=>{
    let {productid, productname, quantityperunit, unit, unitprice} = item;
    if (unitprice>=10 && unitprice<=20){ 
      if (count<10){
        count++;
        data2.push({productid, productname, quantityperunit, unit, unitprice})
      }else{
        return true;
      }
    }
  });

  let n = 0;
  let flag = employeeData.some((item, index)=>{
    let age = new Date().getFullYear() - new Date(item.birthdate).getFullYear();
    let id=item.employeeid.trim().toLowerCase();
    let gender = (id.slice(-1) == 'f'? '女' : '男');
    if (age>=50 && id.slice(-1) == 'm'){
      if (n<2){
        item={...item, age, gender};
        n++;
        console.log(item);
      }else{
        return true;
      }
    }
  });
  console.log(employeeData);

  /*
  let data2 = productData.map((item, index)=>{
    let {productid, productname, quantityperunit, unit, unitprice} = item;
    return ({productid, productname, quantityperunit, unit, unitprice})
  });
  */
  return (
    <div>
      <h1>第一个组件实例——员工列表：</h1>
      <MyList id='employees' data={data1} />
      <h1>第二个组件实例——单价10-20元之间的10个商品：</h1>
      <MyList id='products' data={data2} />
    </div>
  );  
};
export default Demo124;
