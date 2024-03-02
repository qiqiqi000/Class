import React from 'react';
//import { pinyin } from 'pinyin-pro';
//const str = "zhejiangligongdaxue浙江理工大学jingjiguanlixueyuan经济管理学院25-308办公室";
export default class Demo114 extends React.Component {
  render() {   
    var cars1 = ['Saab', 'Volvo', 'BMW', 'Benz']; 
    var cars2=['Nissan', 'Suzuki', 'Toyota'];
    //1）concat()函数
    var cars=cars1.concat(cars2);
    cars=cars.concat(['Bentley', 'Buick']);
    console.log(cars);  //9个元素 
    //2）for循环方法
    var cars=[];
    for (var i in cars1){ //这里的for循环语句中i是数组的下标，即0,1,2,….值
      cars.push(cars1[i]);  //追加一个新元素
    }
    for (var i in cars2){
      cars[cars.length]=cars2[i];  //添加一个新元素值
    }
    console.log(cars);
    //3）使用push.apply()函数
    var cars=[];
    cars.push.apply(cars, cars1);
    cars.push.apply(cars, cars2);
    cars.push.apply(cars, ['Bentley', 'Buick']);
    console.log(cars);
    //4）使用展开运算符
    var cars=[];
    cars=[...cars1, ...cars2]
    console.log( cars);
    cars=['Chevroler', ...cars1, ...['Bentley', 'Buick']];
    console.log(cars);
    var cars=[];
    cars.push(...cars1);
    cars.push(...cars2);    
    console.log(cars); 
    return (  //输出各个元素变量    
      <div style={{marginLeft: 10, marginTop: 20}}>
      </div>
    )
  }
}
