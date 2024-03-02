import React from 'react';
export default class Demo104 extends React.Component {
  render() {
    //1.4 let与var在循环语句中的区别
    //创建5个button按钮，在每个按钮的点击事件中用alert语句弹出显示这个序号。由于for语句中声明的i变量为全局变量，经过几次循环，其值为6。点击任何一个按钮，弹出框中显示的i值均为6，因为全局变量当前的值就是6。
    var btn1=[], btn2=[];
    for (var i=1; i<=5; i++){
      //特殊的变量用途，用来描述ui
      btn1[i-1] = <button key={i+100} onClick={function(){alert(i)}} style={{width:100, margin:'10px 0px 0px 20px'}}>点击var按钮{i}</button>;
    }
    //如果把使用var声明的同样含义的j变量改成用let进行声明，那么j的作用域受到限制。下列代码在单击各个按钮时，显示的j值是那一次循环时的值。
    for (let j=1; j<=5; j++){
      btn2[j-1] = <button key={j+200} onClick={function(){alert(j)}} style={{width:100, margin:'10px 0px 0px 20px'}}>点击let按钮{j}</button>;
    }
    //alert(j)
    /*
    let newDiv = React.createElement("div");
    console.log(newDiv);
    var btn = React.createElement("BUTTON");   // 创建一个<button>元素
    btn.innerHTML = "点击按钮";     // 插入文本
    newDiv.appendChild(btn);    // 将 <button> 附加到 <body>
   */        
  return (
    <div style={{marginLeft:10, marginTop:20}}>
      <div>demo104-let与var变量赋值之比较-循环语句中的变量作用域</div>
      <div>{btn1}</div>
      <div>{btn2}</div>
    </div>
    );
  }
}
