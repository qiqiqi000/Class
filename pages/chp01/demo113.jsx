import React from 'react';
//import { pinyin } from 'pinyin-pro';
//const str = "zhejiangligongdaxue浙江理工大学jingjiguanlixueyuan经济管理学院25-308办公室";
export default class Demo113 extends React.Component {
  sortString =(str)=>{
    //使用split('')将字符串中的每个字符提取出来，存放在数组中
    let letters = str.split('');
    console.log(letters);
    //使用数组排序函数，分4种情况进行排序
    letters.sort((a, b)=>{
      //如果左右两遍a,b都是非汉字，直接判断a,b的大小决定排序位置
      if (a.charCodeAt()<=255 && b.charCodeAt()<=255){
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
      //如果左边a是字母，右边b是汉字，汉字为大，字母为小，字母a在左边
      }else if (a.charCodeAt()<=255 && b.charCodeAt()>=19968){
        return -1;
      //如果右边a是汉字，左边b是字母，汉字a移到右边
      }else if (a.charCodeAt()>=19968 && b.charCodeAt()<=255){
        return 1;
      //如果a,b,都是汉字，使用localeCompare判断a，b的拼音排序  
      }else{
        return a.localeCompare(b,'zh');   //return (a-b) 20a ,12b   8  >0 12b 20a pinyin-pro.js
      } 
    });
    //讲数组中的字符连接起来转为一个字符串进行输出。
    return letters.join('');
  }
  render() {   
    let s1 = "zhejiangligongdaxue浙江理工大学jingjiguanlixueyuan经济管理学院25-308*办公室";
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:20}}>
        <div>原字符：{s1}</div>
        <div>排序后字符：{this.sortString(s1)}</div>
      </div>
    )
  }
}

//let x=10,y=10;
