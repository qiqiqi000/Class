import React, { Component } from 'react';
import { pinyin,myLocalTime } from '../../api/functions.js';

export default class Page313 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data:{
         "d:/教学资料":  ["2022数据库点名册.xlsx", "学科导论成绩单.pdf", "点名册.xls"],
         "d:/myReact/mp3": ["早安隆回.mp3", "追梦人.mp3", "白狐.mp3", "你的样子.mp3"],
         "d:/数据库作业/2021级": ["202101.rar", "202102.doc", "202102.zip", "202103.pdf"],
         "d:/2023课件": [
            {"管理信息系统": ["ppt课件.rar", "laudon.pdf", "案例分析1.doc", "试题库-选择题.docx"]}, 
            {"数据库原理与应用": ["2018习题.doc", "2022版讲义.docx", "2007版教材.pdf"]}, 
            {"软件开发工具": ["2023版前3章讲义.doc", "低代码平台介绍.mp4", "mylab实例工程.rar"]}
          ],
          "e:/毕业论文/2023届/提交版": ["201901.rar", "201902.rar", "201903.zip", "201906.zip"],
          "e:/软件备份/教学软件/管理软件演示版/": ["用友erp系统.rar", "鼎捷ERP系统.rar", "九天CRM标准版.zip"],        
         }
      };
    }
    
    async componentDidMount(){ //初始

      console.log(11112,pinyin('之12色让tyu他浙江理工TB大学'))
      console.log(11112,pinyin('zhi12色rang他浙江理工TB大学'))

      let data = {...this.state.data};
      console.log(0, data);
      
      //1.在data对应的“d:/2023课件”文件夹下直接添加一个"React工程更新src.rar"文件。在“d:/教学资料”属性值中添加一个“考试总结.xls”元素（文件名）
      data["d:/教学资料"].unshift("考试总结.xls");        
      console.log(1, data);
      return;

      data["d:/教学资料"].push("考试总结.xls");
      console.log(1, data);
      //2.判断第一层属性中是否存在“2022级作业”这样命名的文件夹（不考虑盘符，也就是d:、e:、c:盘均可以，这样的也可以“d:\homework\2022级作业”）。如果不存在这样的文件夹，那么创建一个“d:\2022级作业”这个属性文件夹，这个文件夹中作为一个数组用来直接存放多个作业文件。
      let flag = 0;
      for (let key in data){
        console.log(key, data[key]);
        if (key.indexOf('/2022级作业')>=0){
          flag = 1; 
          break;
        } 
      }
      if (flag==0) data["d:/2022级作业"] = [];
      console.log(2, data, flag);     
      //3. 如果data中存在“e:/myReact/mp3”这样的文件夹，那么将这个文件夹属性修改为“e:/audio”，并将原来的文件名属性值继续保存在这个属性中
      if (data["e:/myReact/mp3"]){
        data["e:/audio"] = data["e:/myReact/mp3"];
        delete data["e:/myReact/mp3"];
      }
      console.log(3, data);
      //4.将所有一级属性中的多层文件夹名称全部改写成根目录下的文件夹，用下划线拼接原来的目录路径。例如将属性名"d:/数据库作业/2021级"改成"d:/数据库作业_2021级"，将“e:/毕业论文/2023届/提交版”改成"e:/毕业论文_2023届_提交版"等等。
      Object.keys(data).forEach((item) => {
        //console.log(item)      
      });
      console.log(4, data);
      //5.假设"d:/2023课件"属性是存在的，判断是否在嵌套的第二层JSON对象中存在“数据库原理与应用”这个属性，如果存在的话，在它的属性值数组元素中追加一个“第6章课程视频.rar”元素。

      

    }

    sortString =(array)=>{
      array.sort((a, b)=>{
        let len = a.length<b.length?a.length:b.length;
        for (let i=0;i<len;i++){
          if (a.charCodeAt(i)!==b.charCodeAt(i)){
            // 如果左右两边a,b都是非汉字，直接判断a,b的大小决定排序位置
            if (a.charCodeAt(i)<=255 && b.charCodeAt(i)<=255){
              if (a<b) return -1;
              else if (a>b) return 1;
              else return 0;
            // 如果左边a是字母，右边b是汉字，汉字为大，字母为小，字母a在左边
            }else if (a.charCodeAt(i)<=255 && b.charCodeAt(i)>=19968){
              return -1;
            // 如果右边a是汉字，左边b是字母，汉字a移到右边
            }else if (a.charCodeAt(i)>=19968 && b.charCodeAt(i)<=255){
              return 1;
            // 如果a,b,都是汉字，使用localeCompare判断a，b的拼音排序
            }else{
              return a.localeCompare(b, 'zh');
            }
          }
        }
        // 如果前面的字符都相同，则长度较短的字符串排在前面
        if (a.length<b.length) return -1;
        else if (a.length>b.length) return 1;
        else return 0;
      });
      return array;
    };

    sortChnString =(array)=>{
      array.sort((a1, b1)=>{
        let a = pinyin(a1).pycode;
        let b = pinyin(b1).pycode;
        if (a<b) return -1;
        else if (a>b) return 1;
        else return 0;
      });
      return array;
    };

      


    render(){
      let t1=myLocalTime().ms;
      let array;
      for (let i=1; i<=10000; i++){
        array=['今天', '今2早早', '今2早啊阿吖', '今A', '今1', '今a', '今天我', 'jintian我', 'A天','123','Abc','aBc','琢zz琢','琢琢','琢琢z','琢z']; 
        this.sortString(array);
      }
      let t2=myLocalTime().ms;
      console.log(777,t2-t1)
      //console.log(7777,array);
      t2=myLocalTime().ms;
      for (let i=1; i<=10000; i++){
        array=['今天', '今2早早', '今2早啊阿吖', '今A', '今1', '今a', '今 a', '今天我', 'jintian我', 'A天','123','Ab c','aBc','琢zz琢','琢琢','琢琢z','琢z']; 
        this.sortChnString(array)
      } 
      let t3=myLocalTime().ms;
      console.log(888,t3-t2)
      console.log(888, array);
 
      return (
        <div style={{padding:10}}>

        </div>
      )
    }
}
