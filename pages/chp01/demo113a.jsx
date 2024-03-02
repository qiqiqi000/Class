import React from 'react';
const carlist="Toyota;Volkswagen;Ford;Chevrolet;Honda;BMW;Mercedes-Benz;Audi;Chevrolat;Nissan;Tesla;Hyundai;Kia;Subaru;Porsche;Ferrari;Lamborghini;Jaguar;Volvo;Mazda";
export default class Demo113 extends React.Component {
    render() { 
        var aa = [18, 38, 15, 131, 58, 26];
        aa.sort((a, b) => {
          return a-b;  //返回正数，表示b应该在a前面，交换元素位置          
        });
        console.log(aa);
        let cars = carlist.split(';');        
        cars.sort();
        console.log(cars)
        var arr = [18, 38, 15, 131, 58, 26];
        arr.sort();
        console.log(arr);
        cars = carlist.split(';');        
        cars.sort((a, b) => {
           if (b > a) {
              return -1;  //返回负数，交换元素位置
           }
        });
        console.log(cars);
        var arr = Array.from(10, () => Array(6).fill(0));
        console.log(arr);
    return (  //输出各个元素变量    
    <div style={{marginLeft:10, marginTop:20}}>
    </div>
    )
}
}
