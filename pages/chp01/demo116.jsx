import React from 'react';
export default class Demo116 extends React.Component {
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
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
        <div>studentjson:{JSON.stringify(person)}</div>
        <div>addressjson:{JSON.stringify(person.address)}</div>
      </div>
    )
  }
}
