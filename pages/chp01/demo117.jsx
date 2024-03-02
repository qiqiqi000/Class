import React from 'react';
export default class Demo117 extends React.Component {
  render() { 
    var book={ 
      "isbn": "978-7-04-059125-5", 
      "title": "数据库系统概论", 
      "authors": ["王珊1", "陈红"],
      "pubname": {
         companyname: "高等教育出版社",
         address: "北京市丰台区成寿寺路11号",
         phone: "010-58581118",
         homepage: "www.hep.com.cn"
      }, 
      "pubdate": "2023-03",
      "price": 59
    };       
    let newbook={...book};
    //let newbook=book;
    //let newbook=Object.assign(book);
    console.log(newbook);
    //1）修改图书编码ISBN，去除其中的第二个横杠号（-）；
    let s1=newbook.isbn;
    if (s1.indexOf('-')>=0){
      let index=s1.indexOf('-', s1.indexOf('-')+1);
      if (index>0) newbook.isbn=s1.slice(0, index)+s1.slice(index+1);
    } 
    console.log(newbook);
    
    //2）使用省略号修改出版社的地址为“北京市西城区德外大街4号”；
    newbook = {...newbook, pubname: {...newbook.pubname, address: '北京市西城区德外大街4号'}};
    console.log(newbook);
    
    //3）在图书的作者中判断是否存在“杜小勇”这个作者，如果不存在的话，则添加该作者。将该作者排名在作者“王珊”之后，其他作者之前；如果不存在作者“王珊”，则将其排到第一。
    let arr=newbook.authors;
    let n1=arr.indexOf('王珊');
    let n2=arr.indexOf('杜小勇');
    console.log(n1,n2);
    if (n1>=0) {
      if (n2<0) arr.splice(n1+1, 0, '杜小勇');
      else if (n2!=n1+1){
        arr.splice(n2,1);
        arr.splice(n1+1, 0, '杜小勇');
      }
    }else{  //不存在作者王珊
      if (n2>0) arr.splice(n2, 1); //如果存在'杜小勇'这个作者，但这个作者不是排名第一，则删除这个作者
      arr.splice(0, 0 ,'杜小勇'); //如果不存在这个作者，则这个作者到第一的位置
    }
    console.log(arr);
    let authors=arr;
    Object.assign(newbook, {authors});
    console.log(newbook);
    
    //4）将出版社“pubname”的属性名称修改为“publisher”，将出版社名称“companyname”改名为“company”，主要方法是先将旧属性的值复制给新属性，再使用delete newbook.pubname等删除旧属性。
    //修改pubname属性为publisher
    newbook = {...newbook, publisher: newbook.pubname };
    delete newbook.pubname;
    console.log(newbook);
    //修改companyname属性为company
    newbook = {...newbook, publisher: {...newbook.publisher, company: newbook.publisher.companyname}};
    delete newbook.publisher.companyname;
    console.log(newbook);

    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
        <div>原图书信息:{JSON.stringify(book)}</div>
        <div>新图书信息:{JSON.stringify(newbook)}</div>
      </div>
    )
  }
}
