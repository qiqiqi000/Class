import React, { useState, forwardRef, useRef } from 'react';  
export default class MyComponent extends React.Component {
  calculateAge = (birthdate) => {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
      return age;
  };
  render() {
    const showList = true;
    const itemList = [
      {"employeeid": "CHL523F", "name": "陈惠琳", "birthdate": "1973-10-04" },
      {"employeeid": "D-H190F", "name": "董慧",   "birthdate": "1979-01-23"},
      {"employeeid": "F-Z823M", "name": "方哲",   "birthdate": "1964-06-19"},
      {"employeeid": "FSG086M", "name": "范胜刚", "birthdate": "1993-10-21"},
      {"employeeid": "H-H808M", "name": "韩洪",   "birthdate": "1975-12-30"}
    ];
    return (
      <div>
        {showList && (
          <ul>
            {itemList.map((item, index) => (
              <li key={index}>{item.name+',年龄'+this.calculateAge(item.birthdate)}</li>
            ))}
          </ul>
        )}
        {!showList && <p>隐藏列表.</p>}
      </div>
    );
  }
}
  