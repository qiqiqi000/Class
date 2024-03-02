import React from 'react';
export default class Demo120 extends React.Component {
  render() { 
    var book={"isbn": "9787040212779", "title": "知行合一", "author": "王阳明"};
    var newbook = book;
    newbook.price = 59; 
    book.pubname="高等教育出版社";
    console.log(book);
    console.log(newbook);    
    book={ 
       "isbn": "978-7-04-059125-5", 
       "title": "数据库系统概论", 
       "pubdate": "2023-03",
       "price": 59
     };
     //方法1     
     newbook= {...book};
     newbook["authors"] = [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'杜小勇',gender:'男', unit:'中国人民大学理工学科建设处'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}];
     newbook.pubname = {
        companyname: "高等教育出版社",
        address: "北京市丰台区成寿寺路11号",
        phone: "010-58581118",
        homepage: "www.hep.com.cn"
    }; 
    console.log('book=', book);
    console.log('newbook=', newbook);
    //方法2
    newbook = Object.assign({}, book);
    newbook.pubdate="2023-03-31";
    newbook.author = "王珊、杜小勇、陈红";
    newbook.pubname = "高等教育出版社";
    console.log('book=', book);
    console.log('newbook=', newbook);
    //方法3
    book={ 
      "isbn": "978-7-04-059125-5", 
      "title": "数据库系统概论", 
      "authors": [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'杜小勇',gender:'男', unit:'中国人民大学理工学科建设处'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}],
      "pubname": {
         companyname: "高等教育出版社",
         address: "北京市丰台区成寿寺路11号",
         phone: "010-58581118",
         homepage: "www.hep.com.cn"
      }, 
      "pubdate": "2023-03"
    };
    newbook = {};
    for (let key in book) newbook[key] = book[key];
    newbook.pubdate="2018-02-10";
    newbook.authors = "王珊、杜小勇、陈红";
    newbook.price = 59;
    book.price = 49;
    console.log('book=', book);
    console.log('newbook=', newbook);

    //方法4
    newbook = JSON.parse(JSON.stringify(book));
    newbook.pubdate="2020-11-11";
    newbook.authors = "王珊;杜小勇;陈红";
    newbook.price = 40;
    book.pubdate = "2023-03-31"
    console.log('book=', book);
    console.log('newbook=', newbook);
    //属性合并
    //方式1：使用扩展运算符...合并多个对象的属性，例如：
    var obj1 = { a: 1, b: 2 };
    var obj2 = { c: 3, d: 4 };
    var mergedObj = { ...obj1, ...obj2 };
    console.log(mergedObj); // 输出 { a: 1, b: 2, c: 3, d: 4 }
    //这里使用扩展运算符将obj1和obj2的属性合并到一个新的对象mergedObj中。需要注意的是，如果存在重复的属性名，后面的属性将会覆盖前面的属性。
    //方式2：使用Object.assign()将一个或多个源对象的属性合并到目标对象中，例如：
    obj1 = { a: 1, b: 2 };
    obj2 = { c: 3, d: 4 };
    var obj3 = { b: 5, c: 6, e:7 };
    mergedObj = Object.assign({}, obj1, obj2, obj3);
    console.log(mergedObj); // 输出 {a: 1, b: 5, c: 6, d: 4, e: 7}    

    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
      </div>
    )
  }
}
