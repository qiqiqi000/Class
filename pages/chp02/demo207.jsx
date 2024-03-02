import React, { Component } from 'react'
import '../../css/style.css';
const sys={...React.sys};
//常用的html控件textbox,checkbox,combobox,button
//定义样式.React 不能同时使用两个组件？非也.
//react里面写css的方法：1、通过className在style中给该class名的DOM元素添加样式；2、直接给对应的DOM元素添加style属性；3、通过定义全局变量的方法来定义一个css样式。
const buttonStyle={
  position:"absolute", 
  top: 360,
  left: 110,    
  height: '28px',
  width: '80px'
};

export default class Page207 extends Component {
  //在 JavaScript class 中，每次你定义其子类的构造函数时，都需要调用 super 方法。因此，在所有含有构造函数的的 React 组件中，构造函数必须以super(props) 开头。
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      lineheight: React.sys.lineheight,
      deptdata: ['信息管理与信息系统','大数据管理与应用','计算机科学与技术','会计学','工商管理'],
      genderdata: ['男','女'],
      hobbydata: ['下棋','钓鱼','书法','唱歌','编程'],
    };
  }

  handleClick = (e) => {
    //步骤7：输出各个控件的值
    console.log(999,document.getElementById('hobby1_0').checked);
    console.log(999,document.getElementById('hobby1_1').checked);
    console.log(999,document.getElementById('hobby1_2').checked);
    console.log(999,document.getElementById('hobby1_3').checked);
    console.log(999,document.getElementById('hobby1_4').checked);    
    let str = document.getElementById('stuid').value;
    str += '\n' + document.getElementById('stuname').value;
    str += '\n' + document.getElementById('birthdate').value;
    str += '\n' + document.getElementById('deptname').value;
    str += '\n' + document.getElementById('gender').value;
    str += '\n' + document.getElementById('hobby1_0').value+':'+(document.getElementById('hobby1_0').checked? '已选':'未选');
    str += '\n' + document.getElementById('hobby1_1').value+':'+(document.getElementById('hobby1_1').checked? '已选':'未选');
    str += '\n' + document.getElementById('hobby1_2').value+':'+(document.getElementById('hobby1_2').checked? '已选':'未选');
    str += '\n' + document.getElementById('hobby1_3').value+':'+(document.getElementById('hobby1_3').checked? '已选':'未选');
    str += '\n' + document.getElementById('hobby1_4').value+':'+(document.getElementById('hobby1_4').checked? '已选':'未选');
    alert(str);
  }

  myLabel = function(id, label, top, left) {
    let str=`<label key="${id}" id="${id}" class="labelStyle" style="position:absolute; top:${top}px; left:${left}px;">${label}:</label>`;
    //console.log(str);
    return(str);
  }
  
  myInput = function(id, type, top, left, height, width) {
    let str=`<input key="${id}" id="${id}" type="${type}" style="position:absolute; top:${top}px; left:${left}px; width:${width}px; height:${height}px"/>`;
    return(str);
  }
  
  myCombobox = function(id, top, left, height, width, data) {
    //let str=`<input key="${id}" id="${id}" type="${type}" style="position:absolute; top:${top}px; left:${left}px; width:${width}px; height:${height}px"/>`;
    let str = `<select key="${id}" id="${id}" style="position:absolute; top:${top}px; left:${left}px; width:${width}px; height:${height}px"/>`;
    data.forEach(function(item, index){ //使用forEach循环遍历数据
      str += `<option key="${id}_${index}">${item}</option>`;
    });
    str += '</select>';
    return(str);
  }

  render(){
    let {lineheight, deptdata, genderdata, hobbydata} = this.state;
    let html1='', html2='', html3='', html4='';
    //调用函数，快速生成6个label的字符串
    html1+= this.myLabel('stuid_c',  '学生学号', 20, 30);
    html1+= this.myLabel('stuname_c', '学生姓名', 20+1*lineheight,30);
    html1+= this.myLabel('birthdate_c', '出生日期', 20+2*lineheight,30);
    html1+= this.myLabel('gender_c', '性别', 20+3*lineheight,30);
    html1+= this.myLabel('deptname_c', '所在院系', 20+4*lineheight,30);
    html1+= this.myLabel('hobby_c', '个人兴趣', 20+5*lineheight,30);
    //console.log(html1)
    //编写2个textbox，1个datebox的HTML字符串
    html2+=this.myInput("stuid","text", 15, 110, 28, 200);
    html2+=this.myInput("stuname","text", 15+1*lineheight, 110, 28, 200);  //$('#div).append('<div>333333</div>')
    html2+=this.myInput("birthdate","date", 15+2*lineheight, 110, 28, 200);
    //编写2个combobox的HTML字符串
    html3 += this.myCombobox('gender', 15+3*lineheight, 110, 30, 200, genderdata)
    html3 += this.myCombobox('deptname', 15+4*lineheight, 110, 30, 200, deptdata)
    //编写1个checkbox各个子项的HTML字符串,使用for...in循环遍历数据
    for (let i in hobbydata){
      html4+='<input key="hobby1_'+i+'" id="hobby1_'+i+'"  type="checkbox" value="'+hobbydata[i]+'" style="position:absolute; top:'+ (15+5*this.state.lineheight+25*i)+'px; left:110px;" />';
      html4+='<label key="hobby2_'+i+'" for="hobby1_'+i+'" style="position:absolute; top: '+(15+5*lineheight+25*i)+'px; left:140px; width:200px;">'+hobbydata[i]+'</label>';
    };
    //可以只是用一个字符串变量，本例只是为了显示多个dangerouslySetInnerHTML的用法而已。
    let html=html1+html2+html3+html4;   //$('#div').html(str);
    return (
      <div>
      <div dangerouslySetInnerHTML={{__html: html1}}></div>
      <div dangerouslySetInnerHTML={{__html: html2}}></div>
      <div dangerouslySetInnerHTML={{__html: html3}}></div>
      <div dangerouslySetInnerHTML={{__html: html4}}></div>
      <button key="btnok" style={buttonStyle} onClick={this.handleClick.bind(this)}>确定</button>
      </div>
    );
  }
}


      