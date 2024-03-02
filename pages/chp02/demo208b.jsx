import { dateHelper } from 'rc-easyui';
import React, { Component } from 'react'
import '../../css/style.css';
//常用的html控件textbox,checkbox,combobox,button
//定义样式.React 不能同时使用两个组件？非也.
//react里面写css的方法：1、通过className在style中给该class名的DOM元素添加样式；2、直接给对应的DOM元素添加style属性；3、通过定义全局变量的方法来定义一个css样式。

React.sys.dateformat = 'YYYY/MM/DD';
const sys={...React.sys}; 
const buttonStyle={
  position:"absolute", 
  top: 300,
  left: 110,    
  height: 28,
  width: 80
};

export default class Page206 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);  
    this.state = {
      rowheight: 40,
      student:{
        stuid: "202105540101",
        stuname: "诸葛孔明",
        deptname: "会计学",
        gender: "男",      
        birthdate: "1970-12-20",
        age: 0,
        hobby: '下棋;书法;编程'
      }
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
  //步骤2：创建myInput函数，采用绝对位置定位,type为'text'时生成文本输入框，type为'date'时生成一个日期选择框
  myInput = (id, type, label, top, left, height, width, value) => {
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    if (value === undefined) value = '';
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>      
      <input key={id} id={id} type={type} style={{height: height, width: width}} value={value} onChange={(e)=>this.setState({[id]:e.target.value})} />
    </div>);
  }
  //步骤3：创建myCombobox函数，采用绝对位置定位，根据data生成下拉框的选项
  myCombobox = function(id, label, top, left, height, width, items, value) {
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    if (value === undefined) value = '';
    let data = items.split(';');
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>      
      <select key={id} id={id} style={{height: height, width: width}} value={value} onChange={(e)=>this.setState({[id]:e.target.value})}>
        {data.map((item, index) => <option key={id+'_'+index}>{item}</option> )}
      </select>
    </div>)
  }
  //步骤4：创建myRadionbutton函数，采用绝对位置定位，根据data生成无线按钮的选项
  myRadiogroup = function(id, label, top, left, height, width, items, value) {
    if (height == 0) height = 28;
    if (width == 0)  width = 80;
    if (value === undefined) value = '';
    let data = items.split(';');
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>     
      {data.map((item, index)=>(
       <label key={id+'_labelx'+index} style={{marginRight: width, display: 'inline-block'}}>
         <input type="radio" id={id+'_'+index} key={id+'_'+index} name={id} value={item} defaultChecked={value === item} 
         onChange={(e)=>{let id=e.target.id; console.log(999,id); }} />
         {item}
       </label>))}
    </div>)
  }

  //步骤4：创建myRadionbutton函数，采用绝对位置定位，根据data生成无线按钮的选项
  myCheckbox = function(id, label, top, left, height, width, items, value) {
    if (height == 0) height = 28;
    if (width == 0)  width = 80;
    if (value === undefined) value = '';
    let array = value.split(';');
    let data = items.split(';');
    console.log(555,array);
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>
      {data.map((item, index)=>(
        <label key={id+'_x'+index} htmlFor={id+'_'+index} style={{marginRight: width, display: 'inline-block'}}>
          <input key={id+'_'+index} id={id+'_'+index} type="checkbox" value={item} defaultChecked = {array.includes(item)} 
           />
          {item}
        </label>
       ))}
    </div>)
  }
  
  //步骤5：创建函数，将日期转为一个字符串，格式为2020-06-21
  longdate = (date) => {
    let day=new Date(date);
    return (day.getFullYear()+'-'+('0'+(1+day.getMonth())).slice(-2)+'-'+('0'+day.getDate()).slice(-2));
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    //设置个人兴趣的选项状态
    if (this.state.student.birthdate === undefined) return;
    let today = new Date();
    let birthday = new Date(this.state.student.birthdate);
    //计算年龄
    var age = today.getFullYear() - birthday.getFullYear();
    //调整年龄，考虑月份和日期
    if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) age --;
    this.setState({student:{...this.state.student, age:age}});
  }

  render(){
    let {rowheight, deptdata, genderdata, hobbydata, student} = this.state;
    //步骤6：添加各个组件到一个数组html中
    var html=[];
    //2）添加2个textbox，1个datebox
    html.push(this.myInput("stuid", "text", "学生编码", 20, 30, 28, 200, "202105540101"));
    html.push(this.myInput("stuname", "text", "学生姓名", 20+1*rowheight, 30, 28, 200, student.stuname));
    html.push(this.myInput("birthdate", "date", "出生日期", 20+2*rowheight, 30, 28, 150, this.longdate(new Date())));
    html.push(this.myInput("age", "text", "年龄", 20+2*rowheight, 300, 28, 60));
    //3）添加性别无线按钮
    html.push(this.myRadiogroup("gender", "性别", 20+3*rowheight, 60, 28, 15, '男;女;妖', '女'));
    //4）添加性别和专业下拉框combobox
    html.push(this.myCombobox('deptname', "所属专业", 20+4*rowheight, 30, 28, 150, '信息管理与信息系统;大数据管理与应用;计算机科学与技术;会计学;工商管理', student.deptname));
    //5）添加个人兴趣复选框checkbox
    html.push(this.myCheckbox('hobby', '个人兴趣', 20+5*rowheight, 30, 28, 15, '下棋;钓鱼;书法;唱歌;编程;跑步', '钓鱼;书法;编程'));
    //6）添加一个按钮
    html.push(<button key="btnok" style={buttonStyle} onClick={this.handleClick.bind(this)}>确定</button>);
    //步骤8：输出数组中的React元素
    return (
      <div>{html}</div>
    );
  }
}    