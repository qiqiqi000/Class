import React from 'react';
export default class Demo102 extends React.Component {
  render() {
    //实例1.2 使用const定义一个常量
    const name = 'Mary';
    //常量的值不可以重置。如果给常量覆盖至，控制台就会报错。例如：
    //const name='Tom';
    //name='Jack';
    //使用const声明一个student对象常量，其属性值可以重复赋值。
    const student = {};  //json对象变量只能定义一次
    student.name = 'Mary';
    student.gender = 'female';
    student.name = 'Anna';
    student.age = 20;    
    console.log(1, student);
    return ( 
      //render中必须有return语句，在return中一般使用的是html语句，也可以带变量（用{}包含）
      <div>
        <h1>demo101-常量定义</h1>
        <div>本实例使用const将name变量定义为Mary这个常量值，如果再次使用const定义其值为Tom，或不使用const而将其值重置为Jack，那么控制台都会报错。同样地，JSON对象变量用const也只能定义一次和赋值一次，但其属性值可以多次赋值或修改。对于JSON对象，需要区分变量与属性两者不同的概念。</div>
      </div>
    );
  }
}
