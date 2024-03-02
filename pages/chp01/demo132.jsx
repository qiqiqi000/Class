import React from 'react';
export default class Demo131 extends React.Component {
  //创建一个函数 加上量词 '仟', '佰', '拾' 保留数字 例如2345，变成2仟3佰4拾5
  numberToRmb=(num)=>{
    const unitMap = ['仟', '佰', '拾', ''];  //四位数字分别对应'仟', '佰', '拾', ''
    let tmp=num.split('');  //字符串转换成数组
    let s='';
    for (let i=0; i<4; i++){
      s= s+ tmp[i]+unitMap[i];
    }
    //如果某位数为0 则不需要量词
    s=s.replace('0仟','0');  
    s=s.replace('0佰','0');
    s=s.replace('0拾','0');
    return s; 
  }
  //创建另一个函数，为主函数，将数字金额转换成人民币大写
  digitToChinese = (digit) => {
    if (digit == 0) return '人民币零元整' //0直接返回
    //定义一个数组，将数字0、1~9转成中文零、壹~玖
    const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    //确定最大值到12位，转成字符串保留2为小数。以2060580096.28为例
    const numStr = (1000000000000+digit).toFixed(2);  //转成13位数的字符串，有效共12位整数
    let s11 = numStr.slice(1, 5);  //取亿的数量值，即0020
    let s12 = numStr.slice(5, 9);  //取万的数量值，即6058
    let s13 = numStr.slice(9, 13); //取万以下的数量值，即0096
    let s21 = numStr.slice(-2);    //取小数部分，即28
    let rmb = '';
    //调用函数numberToRmb，其功能是加上量词 '仟', '佰', '拾'，保留数字。例如2345，变成2仟3佰4拾5
    if (s11!=='0000') { //如果金额在“亿”部分中有值，0020
      s11 = this.numberToRmb(s11);   //此时s11的值为：002拾0
      rmb += s11+'亿';  //其值为002拾0亿
    }
    if (s12!=='0000') { //如果金额在“万”部分中有值，6058
      s12 = this.numberToRmb(s12);   //此时s12的值为：6仟05拾8
      rmb += s12+'万';  //此时其值为002拾0亿6仟05拾8万
    }else{
      rmb += s13 === '0000'? '': '0';  //不需要写“万”，例如123400004567.67。如果万级以下也都为0则不需要返回0，例如100000000.12
    } 
    if (s13!=='0000') { //如果金额在“万”以下部分中有值0096
      s13 = this.numberToRmb(s13);   //此时s13的值为：009拾6 
      rmb += s13 +'元'; //此时其值为002拾0亿6仟05拾8万009拾6元
    }else{
      rmb += '元';
    }
    //2060580096，此时的转换结果是 002拾0亿06仟05拾8万009拾6元
    //根据标准3），这里的代码是加零的写法
    //根据读法零是放在量词后面的，所以需要交换位置，如￥107000.53 应为：人民币壹拾万零柒仟元伍角叁分
    rmb = rmb.replace('0亿','亿0')
    rmb = rmb.replace('0万','万')
    rmb = rmb.replace('0元','元0')
    //将连续2个及以上的0替换成一个0 
    while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');
    //如果左边第一个为0，则去掉它。
    if (rmb.slice(0,1) == '0' && digit >= 1) rmb = rmb.slice(1);  
    // console.log(1,rmb);
    //删除亿、万、元左边的0，把0放到右边去？
    // rmb = rmb.replace('0亿','亿0'); //rmb = rmb.replace('0亿','亿');
    // while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');  //可能再次出现两个零的情况
    // rmb = rmb.replace('0万','万');
    // rmb = rmb.replace('0元','元0');  //rmb = rmb.replace('0元','元');
    // while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');  //可能再次出现两个零的情况
    // 处理角和分的两位小数部分 
    //根据是否为0分为四种情况    举例：00   01   20  34  
    // 判断“角”值是不是0  如20 34   这一步处理后为 2'角' 3'角'   
    if (s21.slice(0,1)!=='0') rmb = rmb + s21.slice(0,1)+'角';
    //如果有“分”值是不是0
    if (s21.slice(-1) !=='0'){      //分值不为0 
      if (s21.slice(0,1)=='0') rmb = rmb+'0'; //判断“角”值是不是0 是0的话就是补上0   即01情况
      rmb = rmb+ s21.slice(-1)+'分';// 加上分值 即 01 34 情况
    }else{  //分值为0 则加'整' 00  20 这两种情况都加
      rmb = rmb+'整';   
    }
    // 最终四种情况下rmb被加上的部分： 00 整  01  01分  20 2角整  34 3角4分
    // 其他写法
    // if (dec == '00') {     
    //   dec == '整'
    //   }d
    //   else if (dec[0] == '0'){
    //   dec = '零' + dec[1] + '分'
    //   }
    //   else if (dec[1] == '0' ){
    //   dec = dec[0] + '角整'
    //   }
    //   else {
    //   dec = dec[0] + '角' + dec[1] '分'
    // }
    // 上面这种写法的简化版
    // if (dec === '00') {  
    //   dec = '整';
    // } else {
    //   dec = (dec[0] === '0' ? '零' : dec[0] + '角') + (dec[1] === '0' ? '整' : dec[1] + '分');
    // }
    //console.log(4444,rmb);
    //再次将多个0替换成一个0，例如1000.02会出现1仟元002分'
    while (rmb.indexOf('00')>=0) rmb = rmb.replaceAll('00','0');

    //最后将金额中的数字替换成中文大写数字。中文存储在上面定义的digitMap数组中
    let tmp=rmb.split('');
    for (let i = 0; i < tmp.length; i++){
      if (!isNaN(tmp[i])) tmp[i]=digitMap[tmp[i]];
    }  
    rmb= tmp.join('');
    //console.log(3,rmb);
    return '人民币' + rmb;
  }      
  render() {  
    //产生10个随机数存放到数组中，将其人民币大写显示出来
    let array = [];
    for (let i=0; i<5; i++)
    array.push(Math.random()*1000000000);
    array.push(2060580096.86)
    array.push(1100007596.86)
    array.push(20000580096.86)
    array.push(1000900012.86)
    array.push(100000.12)
    array.push(11000000000.02)
    array.push(100000000.0)
    array.push(0)
    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
        {
          array.map((item, index)=><div key={index}>{item.toFixed(2)}: {this.digitToChinese(item)}</div>)
        }
      </div>
    )
  }
}

