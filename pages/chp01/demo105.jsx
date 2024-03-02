import React from 'react';
export default class Demo105 extends React.Component {
  render() { 
    //定义一个箭头函数
    const myLocalTime = (date) => {
      //没有输入参数或输入参数为空，则提取系统日期作为输入参数值
	    if (date == undefined || date == '') var date = new Date();  //now
      else date= new Date(date);
      console.log(date, date.toDateString());  //2023-7-1
      //提取日期中的各个部分，包括年、月、日和时间
      var y=date.getFullYear().toString();  //转成字符型数据
      var m=(date.getMonth()+1).toString();  //日期中的月份值为0~11，故需要加1
      var d=date.getDate()+'';  //在数值型数据后面加空字符（注意不是双引号），将其转成字符型数据
      var h=date.getHours()+'';
      var mi=date.getMinutes()+'';
      var sec=date.getSeconds()+'';
      var ms=`${date.getMilliseconds()}`; //使用字符串模板将数值转换为字符串
      var timeid=date.getTime()+'';
      //保持月份与日期的值为两位数，不足两位时在左边加0。
      if (m.length<2) m='0'+m;
      if (d.length<2) d='0'+d;
      if (h.length<2) h='0'+h;
      if (mi.length<2) mi='0'+mi;
      if (sec.length<2) sec='0'+sec;
      console.log('从时间戳转为日期：', new Date(1*timeid))
      //使用json格式讲不同日期字符串以不同属性进行输出。
      var rs={};	
      rs.date=y+'-'+m+'-'+d;
      rs.datetime=y+'-'+m+'-'+d+' '+h+':'+mi+':'+sec;
      rs.longdate=y+'年'+m+'月'+d+'日';
      rs.time=h+':'+mi+':'+sec+'.'+ms;
      rs.fulldatetime=y+'-'+m+'-'+d+' '+h+':'+mi+':'+sec+'.'+ms;
      rs.timestamp=y+''+m+''+d+''+timeid;
      rs.dateid=y+''+m+''+d;
      rs.timeid=timeid;  //时间整数
      rs.ms=ms;  //微秒
      rs.sec=sec;  //微秒
      console.log(rs);
      return rs;
    }
  return (
    <div style={{marginLeft:10, marginTop:20}}>
      <div>demo105-输出日期</div>
      <div>中文日期：{myLocalTime('2022-12-1').longdate}</div>
      <div>日期时间：{myLocalTime().datetime}</div>
      <div>英文日期：{myLocalTime('').date}</div>
      <div>相对毫秒数：{myLocalTime('').timeid}</div>
      <div>时间戳：{myLocalTime('').timestamp}</div>
    </div>
    );
  }
}
