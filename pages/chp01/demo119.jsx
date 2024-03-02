import React from 'react';
export default class Demo119 extends React.Component {
   strCounter1 = (str) => {
      let counter = [];
      let maxlength = 0;
      for (let i=0; i< str.length; i++) {
         let s = str.charAt(i);  //提取一个汉字
         let unicode = s.charCodeAt();  //计算汉字的unicode码值
         if (counter[unicode]===undefined) counter[unicode] = 0;
         counter[unicode]++;
         if (counter[unicode]>maxlength) maxlength=counter[unicode];
      }
      console.log(counter);
      console.log(counter[0],counter.length);
      let html=[];
      for (let i=0; i<counter.length; i++){
        if (counter[i]!==undefined){
            html.push(<div key={i}>{'"'+String.fromCharCode(i)+'" 出现'+counter[i]+'次'+(counter[i]==maxlength? ',次数最多':'')}</div>);
        }
      }
      return html;
   }

   strCounter2 = (str) => {
    let counter = {};
    let maxlength = 0;
    for (let i=0; i< str.length; i++) {
       let s = str.charAt(i);  //提取一个汉字
       let unicode = s.charCodeAt();  //计算汉字的unicode码值
       let key='u'+unicode
       if (counter[key]===undefined) counter[key] = 0;
       counter[key]++;
       if (counter[key]>maxlength) maxlength=counter[key];
    }
    console.log(counter);
    let html=[];
    for (let key in counter){
        let ucode=parseInt(key.substring(1));
       html.push(<div key={key}>{'"'+String.fromCharCode(ucode)+'" 出现'+counter[key]+'次'+(counter[key]==maxlength? ',次数最多':'')}</div>);
    }
    return html;
 }      
  render() { 
    let str='978-7-04-059125-5数据库系统概论北京中国人民大学信息学院浙江理工大学经济管理学院phone:010-58581118homepage:www.hep.com.cn'
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
         <div>--------第一种方法统计结果--------</div>
         <div>{this.strCounter1(str)}</div>
         <div>--------第二种方法统计结果--------</div>
         <div>{this.strCounter2(str)}</div>
      </div>
    )
  }
}
