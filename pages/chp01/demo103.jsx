import React from 'react';
export default class Demo103 extends React.Component {
  render() {
    //实例1.1.2 let与var定义变量的区分
    //Javascript的变量具有语法的作用域。在Javascript中，代码块用({})标识。对函数来说，花括号会限定使用var声明的变量的作用域。
    var topic='Javascript';
    if (topic){
      var topic='react';
      console.log('block', topic);  // block react
    }
    console.log('global', topic);  //global react
    //这里使用var，If块中的topic变量重置了块外部的topic变量的值。下面语句在if语句中使用let关键字，可以把变量的作用域限制在任何代码块内，也就是说let语句可以保留全部变量的值。If语句块之外的topic变量的值没有被重置。
    var topic='Javascript';
    if (topic){
      let topic='react';
      console.log('block', topic);  // block react
    }
    console.log('global', topic);  //global javascript
    //定义一个函数，再调用这个函数，输出的x,y值分别是什么？
    function example(flag) {
      let x;
      if (flag) {
        let x = 1;
        var y = 2;
        console.log(x, y);
      }else{
        let x = 100;
        var y = 200;
        console.log(x, y);
      }
      console.log(x, y);
    }
    example(true);

  return (
    <div style={{marginLeft:10, marginTop:20}}>
      <div>demo103-let与var变量赋值之比较</div>
      <div>topic={topic}</div>
    </div>
    );
  }
}
