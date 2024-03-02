import React from 'react';
//从数据文件中提取数据是先导入文件
import employeeData from '../../data/employees.json';
export default class Demo123 extends React.Component {
  render() {
    let data = employeeData;
    console.log(data);    
    let newData = data.map(function(item, index, array) {
        let today = new Date();
        let birthday = new Date(item.birthdate);
        item.age = today.getFullYear() - birthday.getFullYear();
        let id=item.employeeid.toLowerCase().trim();
        if (id.slice(-1) == 'f') item.gender = '女';
        else item.gender='男';
        return item; 
      });
      console.log(newData);     

      newData = data.map((item, index) => {
        let today = new Date();
        let birthday = new Date(item.birthdate);
        let md1 = (today.getMonth()+1)*100 + today.getDate();
        let md2 = (birthday.getMonth()+1)*100 + birthday.getDate();  
        let age = today.getFullYear() - birthday.getFullYear() + ((md1 >= md2)? 1 : 0);
        let id=item.employeeid.toLowerCase().trim();
        let gender = '男';
        if (id.slice(-1) == 'f') gender = '女';
        return {  //减少属性，修改属性名称
           id: item.employeeid,
           name: item.name,
           title: item.title,
           gender: gender,
           age: age
        }
     });
     console.log(newData);
     var book={ 
       "isbn": "978-7-04-059125-5", 
       "title": "数据库系统概论", 
       "authors": "王珊;杜小勇;陈红",
       "pubname": "高等教育出版社",
       "pubdate": "2023-03",
       "price": 59
    };
    console.log(Object.keys(book));
    console.log(Object.values(book));

    return (
      <div style={{marginLeft:10, marginTop:10}}>
       
      </div>
    )
  }
}
