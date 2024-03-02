import React from 'react';
export default class Demo131 extends React.Component {
  //创建一个函数
  numberToRmb=(num)=>{
    const unitMap = ['仟', '佰', '拾', ''];
    let tmp=String(num).split('');
    let s='';
    for (let i=0; i<4; i++){
      s= s+ tmp[i]+unitMap[i];
    }
    s=s.replace('0仟','0');
    s=s.replace('0佰','0');
    s=s.replace('0拾','0');
    return s;
  }
  //创建另一个函数  
  digitToChinese = (digit) => {
    //定义一个数组，将数字0、1~9转成中文零、壹~玖
    const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    //确定最大值到12位，转成字符串保留2为小数。以2060580096.28为例
    const numStr = (1000000000000+digit).toFixed(2);  //有效共12位整数
    let s11 = numStr.slice(1, 5);  //取亿的数量值，即0020
    let s12 = numStr.slice(5, 9);  //取万的数量值，即6058
    let s13 = numStr.slice(9, 13); //取万以下的数量值，即0096
    let s21 = numStr.slice(-2);    //取小数部分，即28
    let rmb = '';
    //调用函数numberToRmb的功能是提取仟佰拾单位的数值，例如2345，变成2仟3佰4拾5
    if (s11!=='0000') { //如果金额在“亿”部分中有值,0020
      s11 = this.numberToRmb(s11);   //此时s11的值为：002拾0
      rmb += s11+'亿';
    }
    if (s12!=='0000') { //如果金额在“万”部分中有值 6058
      s12 = this.numberToRmb(s12);   //此时s12的值为：6仟05拾8
      rmb += s12+'万';
    }else{
      rmb += '0';  //不需要写“万”，例如123400004567.67
    } 
    if (s13!=='0000') { //如果金额在“万”以下部分中有值0096
      s13 = this.numberToRmb(s13);   //此时s13的值为：0仟0佰9拾6      
      rmb += s13 +'元';
    }else{
      rmb += '0元';
    }
    //将连续0个货2个以上的0替换成一个0
    while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');
    console.log(1,rmb);
    //删除亿、万、元左边的0，把0放到右边去？
    rmb = rmb.replace('0亿','亿0'); //rmb = rmb.replace('0亿','亿');
    while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');  //可能再次出现两个零的情况
    rmb = rmb.replace('0万','万');
    rmb = rmb.replace('0元','元0');  //rmb = rmb.replace('0元','元');
    while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');  //可能再次出现两个零的情况
    //如果左边第一个为0，则去掉它。
    if (rmb.slice(0,1) == '0' && digit >= 1) rmb = rmb.slice(1);
    //处理角和分的小数部分
    if (s21.slice(0,1)!=='0') rmb = rmb + s21.slice(0,1)+'角';
    //如果有“分”值，判断有没有
    if (s21.slice(-1) !=='0'){
      if (s21.slice(0,1)=='0') rmb = rmb+'0';
      rmb = rmb+ s21.slice(-1)+'分';
    }else{  
      rmb = rmb+'整';
    }
    //console.log(2,rmb);
    //将金额中的数字替换成中文。中文存储在数组中
    let tmp=rmb.split('');
    for (let i = 0; i < tmp.length; i++){
      if (!isNaN(tmp[i])) tmp[i]=digitMap[tmp[i]];
    }  
    rmb= tmp.join('');
    //console.log(3,rmb);
    return rmb;
  }      
  render() {  
    //产生10个随机数存放到数组中，将其人民币大写显示出来
    let array = [];
    for (let i=0; i<10; i++)
    array.push(Math.random()*1000000000);
    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
        {
          array.map((item, index)=><div key={index}>{item.toFixed(2)}: {this.digitToChinese(item)}</div>)
        }
      </div>
    )
  }
}
