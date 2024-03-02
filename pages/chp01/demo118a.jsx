import React from 'react';
export default class Demo118 extends React.Component {
    traverseJSON = (obj, arr = []) => {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                arr.push(<div key={key+arr.length}>{`属性名:${key}, 属性值: 数组对象 长度为${value.length}`}</div>);
              } else if (this.isJson(value)) {
                arr.push(<div key={key+arr.length}>{`属性名: ${key}, 属性值: JSON对象 ${value}`}</div>);
              }
              this.traverseJSON(value, arr);
            } else {
              arr.push(<div key={key+arr.length}>{`属性名: ${key}, 属性值: ${value}`}</div>);
            }
          }
        }
        return arr;
    }
    
  
  isJson =(obj) => {
    try {
      JSON.parse(JSON.stringify(obj));
      // 对象是一个JSON对象
      return true;
    } catch (error) {
      // 对象不是一个JSON对象
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
    let html = this.traverseJSON(book);
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
        <div>{html}</div>
      </div>
    )
  }
}
