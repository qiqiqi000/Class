import React, { Component } from 'react'
import '../../css/style.css';
import {MyCheckbox, MyCombobox, MyInput, MyRadiogroup} from '../../api/common.js';
//React.sys.dateformat = 'YYYY/MM/DD';
const sys={...React.sys}; 
export default class Page206 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    this.stuidRef = React.createRef();
    this.stunameRef = React.createRef();
    this.genderRef = React.createRef();  
    this.deptnameRef = React.createRef();  
    this.birthdateRef = React.createRef();  
    this.hobbyRef = React.createRef();  
    this.ageRef = React.createRef();  
    this.photopathRef = React.createRef();  
    this.state = {
      rowheight: 40,
      formValues: {
        stuid: "202105540101",
        stuname: "上官婉儿",
        deptname: "会计学",
        gender: "女",      
        birthdate: "1970-12-20",
        age: 0,
        hobby: ['下棋','书法','舞蹈']
      },
      initialValues: {}   //变量用来记录formValues的初值this.state.formValues
    }
  };

  componentDidMount(){ //页面启动渲染之后会执行
    //记录各个控件的初值，使用一个formValues变量
    let obj = {...this.state.formValues};
    //或者手动编写递归深拷贝的函数。
    //for (let key in this.state.formValues) obj[key] = this.state.formValues[key];
    this.setState({initialValues: {...this.state.formValues}});
    //计算实际年龄    
    this.caculateAge(this.state.formValues.birthdate);
    //设置年龄只读，文本输入框为只读状态
    //document.getElementById("age").readOnly = true;
  }

  handleOkClick = (e) => {
    //步骤7：输出各个控件的值    
    console.log(this.state.formValues);
  }

  handleResetClick = (e) => {
    //步骤8：重新设置各个控件的值为初值
    this.setState({formValues: {...this.state.initialValues}});
  }
  
  //步骤5：创建函数，将日期转为一个字符串，格式为2020-06-21
  longdate = (date) => {
    let day=new Date(date);
    return (day.getFullYear()+'-'+('0'+(1+day.getMonth())).slice(-2)+'-'+('0'+day.getDate()).slice(-2));
  }

  caculateAge = (birthdate) => {
    if (birthdate === undefined) return;
    let today = new Date();
    let birthday = new Date(birthdate);
    //计算年龄
    var age = today.getFullYear() - birthday.getFullYear();
    //调整年龄，考虑月份和日期
    if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) age --;
    this.setState({formValues:{...this.state.formValues, age:age}});
  }

  render(){
    let {rowheight, formValues} = this.state;
    //步骤8：输出数组中的React元素
    //console.log(rowheight, formValues);
    return (

    <div style={{marginLeft:20, marginTop:20}}>
      <MyInput id="stuid" ref={ref=>this.studid=ref} type="text" label="学生编码" labelwidth="80" width="200" style={{marginTop:10}} value={this.state.formValues.stuid} />
      <MyInput id="stuname" ref={ref=>this.studname=ref} type="text" label="学生姓名" labelwidth="80" width="200" style={{marginTop:10}} value={this.state.formValues.stuname} />
      <MyInput id="birthdate" ref={ref=>this.birthdate=ref} type="date" label="出生日期" labelwidth="80" width="120" style={{marginTop:10}}  value={this.state.formValues.birthdate}/>
      <MyInput id="age" ref={ref=>this.age=ref} type="text" label="年龄" labelwidth="80" width="60" style={{marginTop:10}} readOnly={true} />
      <MyRadiogroup id="gender" ref={ref=>this.gender=ref} label="性别" labelwidth="80" width="20" items="男;女;妖"  style={{marginTop:10}} value={this.state.formValues.gender} />
      <MyCombobox id="deptname" ref={ref=>this.deptname=ref} label="所属专业" labelwidth="80" width="200" items="信息管理与信息系统;大数据管理与应用;计算机科学与技术;会计学;工商管理" style={{marginTop:10}} value={this.state.formValues.deptname} />
      <MyCheckbox id="hobby" ref={ref=>this.hobby=ref} label= "个人兴趣" labelwidth="80" width="15" items="下棋;钓鱼;书法;唱歌;编程;舞蹈" style={{marginTop:10}} value={this.state.formValues.hobby} />
      <button key="btnok" style={{position:"absolute", top: 280, left: 110, height: 28, width: 80}} onClick={this.handleOkClick.bind(this)}>确定</button>
      <button key="btnreset" style={{position:"absolute", top: 280, left: 210, height: 28, width: 80}} onClick={this.handleResetClick.bind(this)}>重置</button>
    </div>
    );
  }
}    