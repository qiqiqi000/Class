import React from 'react';
export default class Demo131 extends React.Component {
  digitToChinese = (digit) => {
    const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unitMap = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];  
    const numStr = String(digit);
    const numArr = numStr.split('').map(Number);
    const len = numArr.length;  
    let chineseStr = '';
    let zeroFlag = false;  
    for (let i = 0; i < len; i++) {
      const num = numArr[i];
      if (num === 0) {
        zeroFlag = true;
        continue;
      }
      if (zeroFlag) {
        chineseStr += digitMap[0];
        zeroFlag = false;
      }
      chineseStr += digitMap[num] + unitMap[len - i - 1];
    }  
    return chineseStr;
  }
  
  numberToRMB = (number) => {
    const integerPart = Math.floor(number);
    const decimalPart = Math.round((number - integerPart) * 100);
    const rmbStr = this.digitToChinese(integerPart);
    const decimalStr = this.digitToChinese(decimalPart);  
    return rmbStr + '元' + decimalStr + '分';
  }
    
  render() {      
    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
  
        <div>{ this.numberToRMB(12345.6)}</div>
        <div>{ this.numberToRMB(100045)}</div> 

        
      </div>
    )
  }
}
