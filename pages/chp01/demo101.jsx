import React from 'react';

export default class Demo101 extends React.Component {  //类组件
  render() {
    //实例1.1 javascript最基本的常用语句
    //注释符，与C语言、Java相同
    var x='张三';
    var y='20220554001';
    var z=20;
    document.write("浙江理工大学"); 
    document.write("你好！\ 浙江理工大学!");
    document.write("<div><h2>浙江理工大学</h2></div>");
    console.log("浙江理工大学");
    console.log("姓名: "+x);
    console.log(x, y, z);
    var btn = document.createElement("BUTTON");   // 创建一个<button>元素
    btn.innerHTML = "点击按钮";     // 插入文本
    document.body.appendChild(btn);    // 将 <button> 附加到 <body>
    var text = document.createElement("label");   //创建一个<button>元素
    text.innerHTML = "<h1>demo101-javascript最基本的常用语句</h1>";     // 插入文本
    text.id='mytext';
    document.body.appendChild(text);    // 将 <label>附加到 <body>
    let elem=document.getElementById("mytext");
    console.log(elem);
    alert("浙江理工大学欢迎你");
    //alert(x+"，浙江理工大学欢迎你");    
    elem.innerHTML = "<h3>demo101-javascript常用语句</h3>";
    elem.innerText = <h3>demo101-javascript常用语句</h3>;
    console.log(elem.innerText);
    console.log("开始");
    setTimeout(function() { 
      console.log("等候5000毫秒后再执行的语句");
    }, 5000);
    console.log("结束");
    console.log("执行结束后任务1");
    console.log("执行结束后任务2");   
    return ( 
      //render中必须有return语句，在return中一般使用的是html语句，也可以带变量（用{}包含）
      <div id="mainpage" name="mainpage">
        <h1>demo101-javascript最基本的常用语句</h1>
      </div>
    );
  }
}
