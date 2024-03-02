import React from 'react';
//1.10 模板字符串与js程序流控制
export default class Demo110 extends React.Component {
  //在render之前定义一个函数，随机生成一个区间内的日期
  randomDate =() => {
    //提取两个日期的时间戳
    const date1 = '1950-01-01';
    const date2 = '2020-12-31';
    let d1 = new Date(date1).getTime();
    let d2 = new Date(date2).getTime();
    //在计算两个日期的时间戳差值的基础上，随机生成一个新日期的时间戳
    let ms = parseInt(d1+(d2-d1)*Math.random());
    //console.log(new Date(date1).getTime());
    //console.log(new Date(date2).getTime());
    console.log(new Date(ms),ms);
    //根据时间戳创建一个新日期对象，作为出生日期
    const date = new Date(ms);
    console.log(date);
    return date;
  }

  render() {
    //调用函数，获取一个随机日期
    let date1 = this.randomDate();
    //根据出生日期计算年龄（动态值）
    let age = (new Date()).getFullYear() - date1.getFullYear();
    //使用if语句，显示这个年龄值计算所在的年龄段分类值
    let msg1 ='';
    if (age < 7) msg1 = '幼儿期';
    else if (age < 18) msg1 = '少年期';
    else if (age < 36) msg1 = '青年期';
    else if (age < 50) msg1 = '中年期';
    else msg1 = '老年期';
    console.log(msg1,age);
    msg1 = '出生日期：'+date1.toLocaleString()+'，年龄：'+age+'，'+ msg1;
    //再次调用函数，获取另一个随机日期
    let date2 = this.randomDate();
    age = (new Date()).getFullYear() - date2.getFullYear();
    let msg2 = '';
    //使用switch...case语句，计算所在的年龄段分类值。由于case语句中需要调价判断条件，我们在switch的表达式中使用true值 
    switch (true){ 
      case (age < 7): 
        msg2 = "幼儿期"; 
        break; 
      case (age >=7 && age< 18): 
        msg2 = "少年期"; 
        break; 
      case (age >= 18 && age< 36): 
        msg2 = "青年期"; 
        break; 
      case (age >= 35 && age< 50): 
        msg2 = "中年期"; 
        break; 
      default: 
        msg2 = "老年期"; 
        break; 
    } 
    console.log(msg2);
    msg2 = '出生日期：'+date2.toLocaleString()+'，年龄：'+age+'，'+ msg2;
    //第三次调用函数，获取另一个随机日期
    let date3 = this.randomDate();
    age = (new Date()).getFullYear() - date3.getFullYear();
    let msg3 = '';
    //使用三元运算符，由于其嵌套比较复杂，这里只分三种年龄段 
    let a1 = ((age < 7 )? '幼儿期' : '少年期');
    let a2 = ((age < 19 && age >= 7)? '少年期' : '青年期');
    let a3 = ((age < 50 && age >= 35)? '青年期' : '老年期');    
    //msg3 = ((age < 7 )? '幼儿期' : '少年期'((age < 19 && age >= 7)? '少年期' : '青年期'));
    //msg3 = ((age < 7 )? '幼儿期' : ((age < 19 && age >= 7)? '少年期' : '青年期'((age < 50 && age>=35)? '青年期' : '老年期')));
    msg3 = ((age < 7 )? '幼儿期' : ((age < 19 && age >= 7)? '少年期' : ((age < 50 && age >= 35)? '青年期' : '老年期')));
    msg3 = '出生日期：'+date3.toLocaleString()+'，年龄：'+age+'，'+ msg3;
    return (
      <div style={{marginLeft:10}}>
        demo110-js条件语句
        <p>if语句：{msg1}</p>
        <p>switch语句：{msg2}</p>
        <p>三元运算符：{msg3}</p>
      </div>
    );
  }
}