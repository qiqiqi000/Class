import React from 'react';
export default class Demo131 extends React.Component {
  constructor(props) {
    super(props);
    //constructor 是使用JavaScript类语法定义的方法。它用于创建和初始化组件的状态，并绑定事件处理函数等。在创建组件实例时，constructor方法会自动被调用。
    //props：props 参数作为一个参数传递给构造函数。它代表组件初始化时传递给组件的属性。Props是只读的，在构造函数内部不应该修改它们。
    //知识点1）在constructor内部定义函数必须使用this和function关键字
    this.roundToFloat = function(n, m) {
    //this.roundToFloat = (n, m) => {
      let str = n.toFixed(m);
      let index = str.indexOf('.'); //找到小数点位置
      if (m > 0){
        if (index < 0){
          index = str.length;
          str += '.';
        }
        str += '0'.repeat(m-str.length+index+1);
      }
      return str;  
    };    
  }
  //在constructor之后和render()之前定义函数，不需要function关键字
  roundToDecimal(n, m) {
  //roundToDecimal =(n, m) => {
    if (typeof n !== 'number' || typeof m !== 'number' || m < 0) return '';
    let factor = 10 ** m;
    let roundedNumber = Math.round(n * factor) / factor;
    return roundedNumber.toFixed(m);
  }

  render() {
    //在render内部定义函数必须使用function关键字或使用箭头函数+类型定义语句（let、const等)，调用这个函数时不需要添加this.
    //const truncateFloat = (n, m)=> {
    function truncateFloat(n, m){
      const formattedNumber = n.toFixed(m);
      const regex = new RegExp(`\\.\\d{0,${m}}$`);
      return formattedNumber.replace(regex, (match) => match.padEnd(m + 1, "0"));
      /*
      const str = n.toFixed(m);
      return str.replace(/(\.\d*?)(0+)?$/, (_, decimalPart, zeros) => {
        return zeros ? decimalPart + "0".repeat(m - zeros.length) : decimalPart;
      });
      */

      /*
      if (typeof n !== 'number' || typeof m !== 'number' || m < 0) return '';
      let length = n.toFixed(0).length + m + (m>0 ? 1 : 0); //求字符串的实际长度，整数部分+小数部分+小数点
      let str = n.toFixed(m)+'.'+('0'.repeat(m));      
      return str.slice(0, length);
      */
    }; 

    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
        <div>{ this.roundToDecimal(12345.678, 2)}</div>
        <div>{ this.roundToDecimal(12345.678, 5)}</div>
        <div>{ this.roundToDecimal(12345.678, 0)}</div>
        <div>{ this.roundToDecimal(9999.956, 1)}</div>
        
        <div>{ this.roundToFloat(12345, 2)}</div>
        <div>{ this.roundToFloat(12345.678, 2)}</div>
        <div>{ this.roundToFloat(12345.6, 3)}</div>
        <div>{ this.roundToFloat(12345.64, 0)}</div>
        <div>{ this.roundToFloat(9999.956, 1)}</div>
        
        <div>{ truncateFloat(12345.64567, 2)}</div>
        <div>{ truncateFloat(1234567.89, 4)}</div>
        <div>{ truncateFloat(9999.956, 1)}</div>
        <div>{ truncateFloat(9999.956, 0)}</div>
        
      </div>
    )
  }
}
