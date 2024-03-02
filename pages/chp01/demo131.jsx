import React from 'react';
export default class Demo131 extends React.Component {
  constructor(props) {
    super(props);
    //constructor 是使用JavaScript类语法定义的方法。它用于创建和初始化组件的状态，并绑定事件处理函数等。在创建组件实例时，constructor方法会自动被调用。
    //props：props 参数作为一个参数传递给构造函数。它代表组件初始化时传递给组件的属性。Props是只读的，在构造函数内部不应该修改它们。
    //知识点1）在constructor内部定义函数必须使用this和function关键字
    this.parseDigit = function(str) { //this.parseDigit = (str) => {
      //提取字符串中两部分数字
      let tmp = str.split('.'); //找到小数点位置
      let num1 = 0, num2 = 0;
      if (tmp.length > 1){
        num1 = tmp[0];
        num2 = tmp[1];
      }else{
        num1 = str;
      }
      if (isNaN(num1)) num1 = 0;
      else num1 = Number(num1);
      if (isNaN(num2)) num2 = 0;
      else num2 = Number(num2);
      if (num1 < 0) num2 = -num2;      
      return {num1, num2};  
    };    
  }
  //知识点2）在constructor之后和render()之前定义函数，不需要function关键字
  addDigits(str1, str2, factor) { //addDigits = (str1, str2, factor) => {
    let rs1 =this.parseDigit(str1);
    let rs2 =this.parseDigit(str2);
    let x = Number(rs1.num1*factor)+ Number(rs1.num2) + Number(rs2.num1*factor)+ Number(rs2.num2);
    let x1 = parseInt( Math.abs(x) / factor);
    let x2= Math.abs(x) - x1*factor;
    //console.log(x, x1, x2,(x<0? '-':''));
    return (x<0? '-':'') + x1 + (x2>0? '.'+x2: '');
  }

  render() {
    //react render中定义函数能调用外面的其他函数吗?chatgpt说不可以
    //知识点3）在render内部定义函数必须使用function关键字或使用箭头函数+类型定义语句（let、const等)，调用这个函数时不需要添加this.
    const showData = (data) => { //const showData = (data)=> {
       let html = [];
       for (let i = 0; i < data.length; i++){
         let item = data[i];
         html.push(<div key={i}>{item.a+'与'+item.b+'之和等于='+this.addDigits(item.a, item.b, item.c)}</div>)
       }
       return html;
    };
    let data=[{"a":"28.35", "b":"33.24", "c":48},{"a":"28.35", "b":"-33.24", "c":48},{"a":"-28.35", "b":"33.24", "c":48}];
    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
        { showData(data) }
      </div>
    )
  }
}
