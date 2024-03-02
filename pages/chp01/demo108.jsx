import React from 'react';
//从demo107.jsx文件中引入getPinyinFirstLetter这个函数
import { getPinyinFirstLetter } from './demo107';
//定义一个textbox边框的css，在textbox中应用时使用style={textStyle}
const textStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    //transition: 'border-color 0.3s ease',
    borderColor: '#4c9aff',
    height: 28,
    paddingLeft: 6,
    marginTop: 10
}
/*
.beautiful-border {
    border: 2px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
  }  
  .beautiful-border:focus {
    border-color: #4c9aff;
  }
*/
//定义一个类组件
const imageurl1 = require('../../images/check.png');
const imageurl2 = require('../../images/uncheck.png');
export default class Demo108 extends React.Component {
    //构造一个箭头函数，验证输入的数据 
    validation = () => {
        //获取客户编码和客户名称两个元素，在return中定义了其id分别为cid和cname
        let cid = document.getElementById('cid');
        let cname = document.getElementById('cname');
        let checkimage = document.getElementById('checkimage');
        //let uncheckimage = document.getElementById('uncheckimage');
        //checkimage.style.display = 'none';
        //uncheckimage.style.display = 'none';
        //用value属性获取客户编码和客户名称两个元素的值
        let s1 = cid.value;
        let s2 = cname.value;
        //定义一个记录错误信息的变量error，不同错误之间换行显示。
        var error='';
        //去掉客户编码和客户名称左右边的空格
        s1 = s1.trim();
        s2 = s2.trim();
        if (s1 == '' || s2 =='') error += '客户编码和客户名称都不能为空';
        //全部转换成大写字母
        s1=s1.toUpperCase(); 
        s2=s2.toUpperCase();
        //去掉字符串中间的空格，使用replace替换掉所有空格。将空格替换成空字符，替换掉的不只是一个空格，而是所有空格。
        s1=s1.replaceAll(' ', '');
        s2=s2.replaceAll(' ', '');
        console.log(s1,s2);
        //判断客户编码字符的长度是否正确
        if (s1.length != 7){
            error += '\n客户编码长度不是7位';
        }else{
            let s11 = s1.substr(0,4);  //提取字符串左边4个字符
            let s12 = s1.slice(-3);    //提取字符串右边3个字符
            console.log(s11,s12, s2.substring(0, 4));
            //使用isNaN函数判断客户编码后三位是不是数字
            if (isNaN(s12)) error += '\n客户编码后三位不是数字';
            //判断数字是否超出范围
            else if (Number(s12)<10 || Number(s12)>500) error += '客户编码后三位数字超出范围';
            //判断前4位是否为客户名称的拼音首字母，调用demo107.jsx中的getPinyinFirstLetter函数。
            if (s11 != getPinyinFirstLetter(s2.substring(0, 4))) error += '\n客户编码前4位与客户名称拼音首字母不符';
            //使用indexOf或includes判断客户名称中是否包含规定的3个汉字
            if (!s2.includes('公司') && s2.indexOf('商行')<0 && !s2.includes('店')) error += '\n客户名称中没有包含“公司”、“商行”或“店”字符';
            //判断客户名称是否以汉字开头。这里按照unicode码值>=19968为汉字，<=255为非汉字，这样去判断（下同）。
            console.log(222,s2.charAt(0),s2.charCodeAt(0));
            if (s2.charCodeAt(0)<=255) error += '\n客户名称不是汉字开头';
            //用循环提取每个字符，判断客户名称中是否只包含汉字或字母，也可以用正则表达式。
            for (let i=0; i<s2.length; i++){
                let x=s2.charCodeAt(i);
                //if (!(x>=19968 || (x>=65 && x<=90))) {
                if ((x<65) || (x<=255 && x>90)) { //unicode码65-90之间为26个字母
                  error += '\n客户名称中出现汉字与字母之外的其他字符';
                  break;
                }
            }
        }
        //输出最后的数据验证结论
        if (error!=''){
          //alert(error);
          checkimage.setAttribute('src', imageurl2);
          //checkimage.style.display = 'none';
          //uncheckimage.style.display = 'inline-block';
        } 
        else{
          console.log('数据验证正确!',s1,s2);
          checkimage.setAttribute('src', imageurl1);
          //uncheckimage.style.display = 'none';
          //checkimage.style.display = 'inline-block';
          cid.value=s1;
          cname.value=s2;
        } 
    }
    render() { 
        //浙江理工大学经管学院公司ertyu
      return (  //输出各个元素变量
        <div style={{marginLeft:10, marginTop:20}}>
           <div>
              <label>客户编码：</label>
              <input type="text" id="cid" style={textStyle} required maxLength="10" size="15"  />
               <br/>
               <label>客户名称：</label>
                  <input type="text" id="cname" style={textStyle} required maxLength="100" size="50"  />
                  <div style={{marginTop:10}}>
                     <button onClick={() => this.validation()}>验证数据</button>
                     <img id='checkimage' src={imageurl1} style={{marginLeft:10}} />
                 </div>
             </div>
         </div>
      )
    }
}
