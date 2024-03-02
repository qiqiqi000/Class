import { dateHelper } from 'rc-easyui';
import React, { Component } from 'react'
import '../../css/style.css';
//常用的html控件textbox,checkbox,combobox,button
//定义样式.React 不能同时使用两个组件？非也.
//react里面写css的方法：1、通过className在style中给该class名的DOM元素添加样式；2、直接给对应的DOM元素添加style属性；3、通过定义全局变量的方法来定义一个css样式。
//React.sys.dateformat = 'YYYY/MM/DD';
//React.sys.rowheight = 65;
const sys={...React.sys}; 
const buttonStyle={
  position:"absolute", 
  top: 375,
  left: 110,    
  height: 28,
  width: 80
};

export default class Page206 extends Component {
  //步骤1：设置state状态变量，不在constructor中定义state变量是，不添加this.。
  state = {
    lineheight: React.sys.lineheight,
    deptdata: ['信息管理与信息系统','大数据管理与应用','计算机科学与技术','会计学','工商管理'],
    genderdata: ['男','女'],
    hobbydata: ['下棋','钓鱼','书法','唱歌','编程','跑步'],
    student:{
      stuid: "202105540101",
      stuname: "诸葛孔明",
      deptname: "会计学",
      gender: "男",
      birthdate: "1970-12-20",
      hobby1: '下棋;书法;编程',  //初值1
      hobby2: ['下棋','书法']    //初值2
    }
  };

  handleClick = (e) => {
    //步骤7：输出各个控件的值    
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
  //步骤2：创建label函数，采用绝对位置定位，在style中使用变量rowheight。在react中添加样式的方式有两种，一种是内联样式style的方式，另外一种就是添加className的方式
  myLabel = (id, label, top, left) => {
    return (<label key={id} id={id} className='labelStyle' style={{position: "absolute", top: top, left: left}}>{label}：</label>);
  }
  //步骤3：创建myInput函数，采用绝对位置定位,type为'text'时生成文本输入框，type为'date'时生成一个日期选择框
  myInput = (id, type, top, left, height, width, value) => {
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    if (value === undefined) value = '';
    return (<input key={id} id={id} type={type} style={{position: "absolute", top: top, left: left, height: height, width: width}} defaultValue={value} />);
  }
  //步骤4：创建myCombobox函数，采用绝对位置定位，根据data生成下拉框的选项
  myCombobox = function(id, top, left, height, width, data, value) {
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    if (value === undefined) value = '';
    return (
      <select key={id} id={id} style={{position: "absolute", top: top, left: left, height: height, width: width}} defaultValue={value}>
        {data.map((item, index) => <option key={id+'_'+index}>{item}</option> )}
      </select>
    )
  }
  //步骤5：创建函数，将日期转为一个字符串，格式为2020-06-21
  longdate = (date) => {
    let day=new Date(date);
    return (day.getFullYear()+'-'+('0'+(1+day.getMonth())).slice(-2)+'-'+('0'+day.getDate()).slice(-2));
  }

  render(){
    console.log(12111, sys); 
    console.log(12112, React.sys)

    let {lineheight, deptdata, genderdata, hobbydata, student} = this.state;
    //步骤6：添加各个组件到一个数组html中
    var html=[];
    //1）添加6个label，采用绝对位置定位，在style中使用变量rowheight。在react中添加样式的方式有两种，一种是内联样式style的方式，另外一种就是添加className的方式
    html.push(this.myLabel("stuid_c", "学生编码", 20, 30));
    html.push(this.myLabel("stuname_c", "学生姓名", 20+1*lineheight, 30));
    html.push(this.myLabel("birthdate_c", "出生日期", 20+2*lineheight, 30));
    html.push(this.myLabel("gender_c", "性别", 20+3*lineheight, 30));
    html.push(this.myLabel("deptname_c", "所属专业", 20+4*lineheight, 30));
    html.push(this.myLabel("hobby_c", "个人兴趣", 20+5*lineheight, 30));
    //2）添加2个textbox，1个datebox
    html.push(this.myInput("stuid", "text", 15, 110, 28, 200, "202105540101"));
    html.push(this.myInput("stuname", "text", 15+1*lineheight, 110, 28, 200, student.stuname));
    html.push(this.myInput("birthdate", "date", 15+2*lineheight, 110, 28, 150, this.longdate(new Date())));
    //3）添加性别和专业下拉框combobox
    html.push(this.myCombobox('gender',   15+3*lineheight, 110, 30, 150, genderdata, student.gender));
    html.push(this.myCombobox('deptname', 15+4*lineheight, 110, 30, 200, deptdata, student.deptname));
    //4）添加个人兴趣复选框checkbox
    for (let i in hobbydata){ 
      html.push(<input key={`hobby1_${i}`} id={`hobby1_${i}`}  type="checkbox" value={hobbydata[i]} style={{position:"absolute", top: (15+5*lineheight+25*i)+"px", left:"110px" }} defaultChecked={i<=1? true:false} />);
      html.push(<label key={`hobby2_${i}`} htmlFor={`hobby1_${i}`} style={{position:"absolute", top: (15+5*lineheight+25*i)+"px", left:"140px", width:"200px" }}>{hobbydata[i]}</label>);
    };
    //5）添加一个按钮
    html.push(<button key="btnok" style={buttonStyle} onClick={this.handleClick.bind(this)}>确定</button>);
    //步骤8：输出数组中的React元素
    return (
      <div>{html}</div>
    );
  }
}    