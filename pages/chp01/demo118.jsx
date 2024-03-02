import React from 'react';
export default class Demo118 extends React.Component {
  traverseJSON = (obj) => {
    for (var key in obj) {
       if (obj.hasOwnProperty(key)) {
          var value = obj[key];
          //检查属性值是否为对象
          if (typeof value === 'object' && value !== null) {
             if (Array.isArray(value)) console.log( "属性名: ", key, ", 属性值: 数组对象 长度为", value.length);
             else if (this.isJson(value)) console.log( "属性名: ", key, ", 属性值: JSON对象 ", value);
             //递归遍历嵌套的属性
             this.traverseJSON(value);
          }else{
             console.log("属性名: "+ key+ ", 属性值: "+ value);
          }
       }
    }
 }
//自定义函数，使用try判断给定的对象值是不是json格式数据
 isJson =(obj) => {
   if (!obj || typeof obj !== 'object' || Array.isArray(obj) || obj instanceof Date || obj instanceof Function) return false;
   try {
     JSON.parse(JSON.stringify(obj));  //如果不出错表示对象是一个JSON对象
     return true;
   } catch (error) {
     //对象不是一个JSON对象
     return false;
   }
 }
 render() { 
   var book={ 
     "isbn": "978-7-04-059125-5", 
     "title": "数据库系统概论", 
     "authors": [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'杜小勇',gender:'男', unit:'中国人民大学理工学科建设处'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}],
     "pubname": {
        companyname: "高等教育出版社",
        address: "北京市丰台区成寿寺路11号",
        phone: "010-58581118",
        homepage: "www.hep.com.cn"
     }, 
     "pubdate": "2023-03",
     "price": 59
  };
  //使用实例1.17中的book对象变量，遍历这个对象中的各层属性 
  this.traverseJSON(book);  //调用函数
  console.log(Object.keys(book)); 
  console.log(Object.values(book));
  let r1=Object.keys(book).map((item,index)=><div key={'A'+index}>{item}</div>)
  console.log(r1)
  Object.keys(book).forEach((item,index)=>console.log(item));
  Object.values(book).forEach((item,index)=>console.log(item));

  let obj ={"city": "New York", "country": "USA"};
  obj=[30, 20];
  console.log(typeof obj, JSON.parse(JSON.stringify(obj))); 
  let date= new Date();
  console.log(this.isJson([1,2,3,4]),this.isJson(date));


  return (  //输出各个元素变量    
     <div style={{marginLeft:10, marginTop:10}}>
        <div>Object.keys()方法</div>
        {r1}
     </div>
   )
 }
}
