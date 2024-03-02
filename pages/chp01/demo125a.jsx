import React from 'react';
import employeeData from '../../data/employees.json';
import orderData from '../../data/orders.json';
import productData from '../../data/products.json';
export default class Demo125 extends React.Component {
  render() {
    let filteredEmployees = employeeData.filter(item => item.birthdate>="1980-01-01");
    filteredEmployees = employeeData.filter((item) => { 
        return (item.birthdate>="1980-01-01")
    });    
    console.log(filteredEmployees);
    //查第一个满足条件的员工
    let foundEmployee = employeeData.find((item, index) => item.birthdate>="1980-01-01" && item.employeeid.toLowerCase().slice(-1)=='f');
    console.log(foundEmployee);
    //查第二个满足条件的员工
    let foundEmployees = employeeData.filter((item, index) => item.birthdate>="1980-01-01" && item.employeeid.toLowerCase().slice(-1)=='f');
    if (foundEmployees.length>1) console.log(foundEmployees[1]);
    //查第一个满足员工的下标
    let employeeIndex = employeeData.findIndex((item)=>{
        let date1 = new Date();
        let date2 = new Date(item.birthdate);        
        let md = (date1.getMonth()-date2.getMonth())*100+date1.getDate()-date2.getDate()-1;
        let age = (date1.getFullYear() - date2.getFullYear()) + (md>0 ? 1 : 0);
        let id=item.employeeid.toLowerCase().trim();
        let gender = (id.slice(-1) == 'f'? '女' : '男');
        //console.log(item,age,item.birthdate)
        if (age>=50 && age<=55 && gender=='男') return true;
        else return false;    
    });
    console.log(employeeIndex);
    console.log(employeeData[employeeIndex]);

    return (  //输出各个元素变量    
      <div>
      </div>
    )
  }
}
