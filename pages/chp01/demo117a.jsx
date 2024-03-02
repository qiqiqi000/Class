import React from 'react';
export default class Demo117 extends React.Component {
  render() { 
    let person={
        "name": "John Doe",
        "age": 30,
        "email": "johndoe@example.com",
        "address": {
          "street": "123 Main Street",
          "city": "Anytown",
          "state": "California",
          "country": "USA"
        },
        "hobbies": ["reading", "traveling", "cooking"],
        "isStudent": false
    }
    let student=person;
    console.log('student1', student); 


    //方法1：使用点符号修改属性值
    person.name = 'Bob';
    console.log(person); // 输出 { name: 'Bob', age: 38, address:… }
    //同样也可以使用点符号访问person对象中的address属性，并使用点符号访问嵌套对象address中的city属性，并将其值更新为 'Newtown'。
    person.address.city = 'Newtown';
    console.log(person); // 输出 { name: 'Alice', age: 38, address: { street: '123 Main St', city: 'Newtown', state: 'CA' } }
    //方法2：使用方括号符号修改属性值
    //使用方括号符号访问person对象中的name属性，并将其值更新为 'Bob'。同样适用于修改嵌套对象中的属性值city。
    person['name'] = 'Bob';
    console.log(person); // 输出 { name: 'Bob', age: 38 }
    person['address']['city']= 'Newtown';
    //方法3：使用Object.assign()方法修改属性值
    //使用 Object.assign() 方法将新的属性对象 { name: 'Bob' } 合并到person对象中，并将 name 属性值更新为 'Bob'。
    Object.assign(person, { name: 'Bob' });
    Object.assign(person, { name: 'Bob', age: 38, address: {street:'789 Main St', city: 'Anytown', state: 'CA' }});
    console.log(person); // 输出 { name: 'Bob', age: 38 }
    //思考题：使用Object.assign修改不存在的属性或嵌套属性时，JavaScript将返回什么值?是否会引发错误？
    //方法4：使用扩展运算符（…）修改属性值
    //使用扩展运算符 ... 将 person 对象的所有属性解构到新对象中，并将 name 属性值更新为 'Bob'。
    person = { ...person, name: 'Bob' };
    console.log(person); // 输出 { name: 'Bob', age: 38 }
    //使用扩展运算符修改嵌套对象中的属性值。
    person = {  ...person, name: 'Bob', address: { ...person.address, city: 'Newtown' }};
    console.log(person); // 输出 { name: 'Bob', age: 38, address: { street: '123 Main St', city: 'Newtown', state: 'CA' } }        
    console.log('student2', student); 
    console.log({...person}); 

    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
      </div>
    )
  }
}
