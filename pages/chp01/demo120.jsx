import React from 'react';
export default class Demo120 extends React.Component {
  mergeObjects = (obj1, obj2) => {
    let merged = { ...obj1 };
    for (let key in obj2) {
      if (typeof obj2[key] === 'object' && obj1.hasOwnProperty(key) && typeof obj1[key] === 'object') {
        if (Array.isArray(obj1[key])) merged[key] = [ ...obj1[key], ...obj2[key] ];
        else if (this.isJSON(obj1[key])) merged[key] = this.mergeObjects(obj1[key], obj2[key]);
      }else{
        merged[key] = obj2[key];
      }
    }  
    return merged;
  }

  //自定义函数，使用try判断给定的对象值是不是json格式数据
  isJSON =(obj) => {
    try {
      JSON.parse(JSON.stringify(obj));  //如果不出错表示对象是一个JSON对象
      return true;
    } catch (error) {
      //对象不是一个JSON对象
      return false;
    }
  }
  render() {
    let book = { 
      isbn: "978-7-04-059125-5", 
      title: "数据库系统概论", 
      authors: [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}],
      publisher: {
        companyname: "高等教育出版社",
        address: "北京市丰台区成寿寺路11号",
        homepage: "www.hep.com.cn"
      }
    };
    let newbook = book;
    newbook.price = 59; 
    book.pubdate = "2021-10-21";
    console.log(11,book);
    console.log(12,newbook);
    
    newbook = {...book};
    newbook.price = 80;  //第一层属性值修改
    book.publisher.companyname = "机械工业出版社";  //第二层属性值修改
    console.log(21,book);
    console.log(22,newbook);
    
    newbook = Object.assign({}, book);
    newbook.pubdate="2023-03-31";  //第一层属性值修改
    newbook.authors.push({name:'杜小勇', gender:'男', unit:'中国人民大学理科建设处'}); //第二层属性值修改
    book.publisher.companyname = "电子工业出版社"; //第二层属性值修改
    console.log(31,book);
    console.log(32,newbook);

    newbook = {};
    for (let key in book) newbook[key] = book[key];
    book.pubdate = new Date("2023-03-31");
    newbook.authors.splice(2, 1);
    newbook.authors.splice(1, 0, {name:'杜小勇', gender:'男', unit:'中国人民大学理科建设处'});
    newbook.publisher={...book.publisher}
    newbook.publisher.companyname = "机械工业出版社";
    console.log(41,book);
    console.log(42,newbook);

    newbook = JSON.parse(JSON.stringify(book));
    newbook.authors.sort((a,b)=>{ return a.name.localeCompare(b.name, 'zh');});  //作者按拼音排序
    book.publisher.companyname = "高等教育出版社";
    console.log(51,book);
    console.log(52,newbook);

    newbook = structuredClone(book);
    newbook.publisher.companyname = "机械工业出版社";  //第二层属性值修改
    newbook.price = 75;  //第一层属性值修改
    book.edition = '第三版';  //第一层属性值修改    
    book.pubdate = '2023-03-31';
    console.log(61,book);
    console.log(62,newbook);


    let book1 = { 
       "isbn": "978-7-04-059125-5", 
       "title": "数据库系统概论", 
       "authors": [{name:'王珊',gender:'女', unit:'中国人民大学信息学院'},{name:'陈红',gender:'女', unit:'中国人民大学信息学院'}],
       "pubname": {
           companyname: "高等教育出版社",
           address: "北京市丰台区成寿寺路11号",
           homepage: "www.hep.com.cn"
        }, 
       "price": 59
    };
    let book2  = {
      "isbn": "978-7-04-059125-5", 
      "title": "数据库系统概论", 
      "authors":[{name:'杜小勇',gender:'男', unit:'中国人民大学理工学科建设处'}],
      "pubname": {
         companyname: "机械工业出版社",
         phone: "010-88361066"
       },       
       "pubdate": "2021-03-31",
       "price": 48
    }; 
    book= this.mergeObjects(book1, book2)
    console.log('mergedbook=', book);
    
    newbook = JSON.parse(JSON.stringify(book));
    newbook.pubdate="2020-11-11";
    newbook.authors = "王珊;杜小勇;陈红";
    newbook.price = 40;
    book.pubdate = "2023-03-31"
    console.log('book=', book);
    console.log('newbook=', newbook);

    const person = {
      name: 'Alice',
      age: 38,
      gender: 'female',
      address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA'
      }
    };
    //也可以使用属性集与减号，将一个JSON对象中某几个属性删除后，留下剩余的属性。例如：
    var { ['age']: _, ...rest } = person;
    console.log(rest);
    var { age, gender, ...remaining } = person;
    console.log(remaining);  
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
        <div style={{marginTop:10}}>第一个字符串：{JSON.stringify(book1)}</div>
        <div style={{marginTop:10}}>第二个字符串：{JSON.stringify(book2)}</div>
        <div style={{marginTop:10}}>合并后字符串：{JSON.stringify(book)}</div>
      </div>
    )
  }
}
